// ============================================================================
// FinanceX Enhanced Audio & Speech Synthesis Service (TTS)
// Handles natural voice synthesis, sentence chunking, playback controls,
// speed adjustments, and visual audio-wave state tracking.
// ============================================================================

export type SpeechRate = 0.8 | 1.0 | 1.25;

export interface SpeechStatusListener {
  (status: { isSpeaking: boolean; isPaused: boolean; currentTextId?: string }): void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingState = false;
  private isPausedState = false;
  private currentTextId?: string;
  private speechRate: SpeechRate = 1.0;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private tamilVoice: SpeechSynthesisVoice | null = null;
  private indianVoice: SpeechSynthesisVoice | null = null;
  private sentenceQueue: string[] = [];
  private currentQueueIndex: number = 0;
  private listeners: Set<SpeechStatusListener> = new Set();
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (voices.length === 0) return;

    // 1. Detect Native Tamil Voice
    this.tamilVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('ta') ||
        v.lang.toLowerCase().includes('ta-in') ||
        v.name.toLowerCase().includes('tamil') ||
        v.name.toLowerCase().includes('valluvar') ||
        v.name.toLowerCase().includes('தமிழ்')
    ) || null;

    // 2. Detect Indian English / Multilingual Voice
    this.indianVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('en-in') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('neerja')
    ) || null;

    // 3. Natural or standard English
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
    );
    const englishVoice = voices.find((v) => v.lang.startsWith('en'));

    this.preferredVoice = this.indianVoice || naturalVoice || englishVoice || voices[0] || null;
  }

  public subscribe(listener: SpeechStatusListener): () => void {
    this.listeners.add(listener);
    listener({
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentTextId: this.currentTextId
    });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const status = {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentTextId: this.currentTextId
    };
    this.listeners.forEach((l) => l(status));
  }

  /**
   * Cleans markdown, latex, formulas and URLs into natural spoken speech
   */
  public cleanTextForSpeech(text: string): string {
    const isTamil = /[\u0B80-\u0BFF]/.test(text) || (typeof window !== 'undefined' && localStorage.getItem('financex_language') === 'ta');
    let cleaned = text
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '') // remove code blocks
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // keep link text only
      .replace(/\$\$[\s\S]*?\$\$/g, '') // remove display math
      .replace(/\$([^\$]+)\$/g, '$1') // inline math
      .replace(/\\text\{([^\}]+)\}/g, '$1')
      .replace(/\\frac\{([^\}]+)\}\{([^\}]+)\}/g, isTamil ? '$1 வகுத்தல் $2' : '$1 divided by $2')
      .replace(/\\times/g, isTamil ? ' பெருக்கல் ' : ' times ')
      .replace(/\\approx/g, isTamil ? ' தோராயமாக ' : ' approximately ')
      .replace(/\\sum/g, isTamil ? ' கூட்டுத்தொகை ' : ' sum of ')
      .replace(/\\Delta/g, 'delta')
      .replace(/[—–]/g, ', ')
      .replace(/[-*•]\s+/g, '') // remove bullet points
      .replace(/\n+/g, ' ')
      .trim();

    if (isTamil) {
      cleaned = cleaned
        .replace(/₹\s*([0-9,.]+)/g, '$1 ரூபாய் ')
        .replace(/₹/g, ' ரூபாய் ')
        .replace(/%/g, ' சதவீதம் ')
        .replace(/=/g, ' சமம் ');
    } else {
      cleaned = cleaned
        .replace(/₹\s*([0-9,.]+)/g, 'Rupees $1 ')
        .replace(/₹/g, 'Rupees ')
        .replace(/%/g, ' percent ')
        .replace(/=/g, ' equals ');
    }

    return cleaned;
  }

  /**
   * Splits long text into natural sentence chunks to prevent browser cutoff
   */
  private splitIntoSentences(text: string): string[] {
    const rawSentences = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [text];
    const chunks: string[] = [];
    let current = '';

    for (const s of rawSentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if (current.length + trimmed.length < 220) {
        current += (current ? ' ' : '') + trimmed;
      } else {
        if (current) chunks.push(current);
        current = trimmed;
      }
    }
    if (current) chunks.push(current);
    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Speak a piece of text with pause/resume support and text ID tracking
   */
  public speak(text: string, textId?: string) {
    if (!this.synth) return;

    // If already speaking the same text, toggle pause/resume
    if (this.isSpeakingState && this.currentTextId === textId) {
      if (this.isPausedState) {
        this.resume();
      } else {
        this.pause();
      }
      return;
    }

    this.stop();

    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) return;

    this.sentenceQueue = this.splitIntoSentences(cleaned);
    this.currentQueueIndex = 0;
    this.currentTextId = textId;
    this.isSpeakingState = true;
    this.isPausedState = false;
    this.notify();

    this.playNextChunk();
  }

  private playNextChunk() {
    if (!this.synth || this.currentQueueIndex >= this.sentenceQueue.length) {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentTextId = undefined;
      this.notify();
      return;
    }

    const chunk = this.sentenceQueue[this.currentQueueIndex];
    const isTamilText = /[\u0B80-\u0BFF]/.test(chunk) || (typeof window !== 'undefined' && localStorage.getItem('financex_language') === 'ta');
    const utterance = new SpeechSynthesisUtterance(chunk);

    if (isTamilText) {
      utterance.lang = 'ta-IN';
      if (this.tamilVoice) {
        utterance.voice = this.tamilVoice;
      }
      utterance.rate = Math.max(0.75, this.speechRate * 0.92);
      utterance.pitch = 1.0;
    } else {
      utterance.lang = 'en-IN';
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      utterance.rate = this.speechRate;
      utterance.pitch = 1.02;
    }

    utterance.onend = () => {
      this.currentQueueIndex++;
      this.playNextChunk();
    };

    utterance.onerror = (e) => {
      console.warn('[FinanceX Speech Error]', e);
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentTextId = undefined;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (!this.synth || !this.isSpeakingState) return;
    this.synth.pause();
    this.isPausedState = true;
    this.notify();
  }

  public resume() {
    if (!this.synth || !this.isSpeakingState) return;
    this.synth.resume();
    this.isPausedState = false;
    this.notify();
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.sentenceQueue = [];
    this.currentQueueIndex = 0;
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentTextId = undefined;
    this.notify();
  }

  public setSpeed(rate: SpeechRate) {
    this.speechRate = rate;
    if (this.isSpeakingState && !this.isPausedState) {
      // Re-trigger current chunk with new rate
      if (this.synth) {
        this.synth.cancel();
        this.playNextChunk();
      }
    }
  }

  public getSpeed(): SpeechRate {
    return this.speechRate;
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentTextId: this.currentTextId,
      speed: this.speechRate
    };
  }
}

export const speechService = new SpeechService();
