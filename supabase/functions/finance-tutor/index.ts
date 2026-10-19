// Supabase Edge Function: finance-tutor
// Hugging Face Inference API / Open LLM & RAG Integration for FinanceX AI Tutor
// Follows Deno / Supabase Functions standard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration defaults
const DEFAULT_PROVIDER = Deno.env.get('AI_PROVIDER') || 'huggingface';
const DEFAULT_HF_MODEL = Deno.env.get('HF_MODEL') || 'Qwen/Qwen2.5-72B-Instruct';

interface TutorRequestBody {
  prompt: string;
  conversationId?: string;
  topic?: string;
  language?: 'en' | 'ta';
  groundedContext?: string;
  history?: Array<{ sender: 'USER' | 'AI'; text: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // 1. Verify caller authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized user.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Read request payload
    const body: TutorRequestBody = await req.json();
    const { prompt, conversationId, topic, language = 'en', groundedContext, history = [] } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Missing or empty prompt parameter.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const provider = Deno.env.get('AI_PROVIDER') || DEFAULT_PROVIDER;
    const hfToken = Deno.env.get('HF_TOKEN');
    const hfModel = Deno.env.get('HF_MODEL') || DEFAULT_HF_MODEL;
    const geminiKey = Deno.env.get('GEMINI_API_KEY');

    // 3. Construct pedagogical system prompt
    const systemPrompt = `You are the FinanceX AI Educational Financial Tutor, a pedagogical mentor specializing in NISM certifications (Series VIII, XV, V-A), quantitative finance, derivative pricing, fixed income math, and Indian securities regulations (SEBI).

PEDAGOGICAL TEACHING GUIDELINES:
1. Understand the learner's actual question and answer it directly.
2. Structure your response into:
   - **Direct Answer**: Concise 1-2 sentence core concept definition.
   - **Detailed Explanation**: Clear breakdown of underlying financial mechanics and theory.
   - **Practical Example**: Realistic Indian market scenario (NIFTY, Reliance, RBI repo, government bonds) when helpful.
   - **Mathematical Formula**: Clear formula notation where applicable.
   - **Exam Tip / Caveat**: Key NISM trap or market risk warning.
3. LANGUAGE REQUIREMENT:
   - If selected language is 'ta' (Tamil), respond primarily in natural Tamil while preserving standard English financial terms (e.g., "Compound Interest", "Modified Duration", "Call Option", "Sharpe Ratio", "Delta", "FCFF", "P/E Ratio").
   - If selected language is 'en' (English), respond in crisp, professional English.
4. FINANCIAL SAFETY RULES:
   - You provide educational explanations only, NOT personalized financial advice.
   - Do NOT fabricate live prices or guarantee investment returns.
   - If asked non-financial questions, politely guide the learner back to financial concepts.

${groundedContext ? `AUTHORITATIVE CURRICULUM GROUNDING:\n${groundedContext}\n` : ''}`;

    let replyText = '';
    let usedModel = hfModel;

    // 4. Inference execution
    if (provider === 'huggingface' && hfToken) {
      console.log(`[FinanceX Observability] Query received | Lang: ${language} | Provider: huggingface | Model: ${hfModel}`);

      const hfMessages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4).map((m) => ({
          role: m.sender === 'USER' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: `[Topic Context: ${topic || 'General'}] [Language: ${language}]\n\nLearner Question: ${prompt}` }
      ];

      const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${hfModel}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: hfModel,
          messages: hfMessages,
          max_tokens: 1024,
          temperature: 0.3
        })
      });

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        console.warn(`[Hugging Face API Error] Status: ${hfResponse.status} | Body: ${errorText}`);
        throw new Error(`Hugging Face API error (${hfResponse.status}): ${errorText}`);
      }

      const hfData = await hfResponse.json();
      replyText = hfData.choices?.[0]?.message?.content || 'No response generated from Hugging Face.';
    } else if (geminiKey) {
      console.log(`[FinanceX Observability] Query received | Lang: ${language} | Fallback Provider: gemini-1.5-flash`);
      usedModel = 'gemini-1.5-flash';

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nContext/Topic: ${topic || 'General'}\nLanguage: ${language}\n\nLearner Question: ${prompt}` }]
              }
            ]
          })
        }
      );

      const geminiData = await geminiResponse.json();
      replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } else {
      // In development environments without live external API keys
      console.log(`[FinanceX Observability] Local Grounded Inference | Lang: ${language}`);
      replyText = `### Concept Analysis: ${prompt}\n\nPlease configure HF_TOKEN on the Supabase Edge Function environment for full Hugging Face Open LLM inference.`;
    }

    const latencyMs = Date.now() - startTime;
    console.log(`[FinanceX Observability] Response generated | Latency: ${latencyMs}ms | Model: ${usedModel}`);

    // 5. Record to ai_messages if conversationId is provided
    if (conversationId) {
      try {
        await supabaseClient.from('ai_messages').insert([
          { conversation_id: conversationId, sender_type: 'USER', message_text: prompt },
          { conversation_id: conversationId, sender_type: 'AI', message_text: replyText }
        ]);
      } catch (dbErr) {
        console.warn('[FinanceX DB Warning] Could not persist message:', dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        reply: replyText,
        model: usedModel,
        provider: provider,
        language: language,
        latencyMs: latencyMs
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    console.error(`[FinanceX AI Tutor Error] Latency: ${latencyMs}ms | Error:`, err.message);

    return new Response(
      JSON.stringify({
        error: err.message || 'AI Tutor failed to process question.',
        fallbackNotice: 'An error occurred while contacting the AI Tutor inference server. Please retry.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
