import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StageFrameCanvasProps {
  folderIndex: number; // 1 to 7
  totalFrames: number; // 200 or 250
  currentFrame: number;
  opacity?: number;
  scale?: number;
  className?: string;
}

function formatFrameFilename(index: number): string {
  const padded = String(Math.max(1, Math.round(index))).padStart(3, '0');
  return `ezgif-frame-${padded}.jpg`;
}

export const StageFrameCanvas: React.FC<StageFrameCanvasProps> = ({
  folderIndex,
  totalFrames,
  currentFrame,
  opacity = 1.0,
  scale = 1.0,
  className = '',
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSetRef = useRef<Set<number>>(new Set());
  const [, setForceRender] = useState<number>(0);

  const getFrameUrl = useCallback((frameNum: number) => {
    return `/assets/${folderIndex}/${formatFrameFilename(frameNum)}`;
  }, [folderIndex]);

  const loadFrame = useCallback((frameNum: number): Promise<HTMLImageElement> => {
    const validFrame = Math.max(1, Math.min(totalFrames, Math.round(frameNum)));
    
    if (imageCacheRef.current.has(validFrame)) {
      return Promise.resolve(imageCacheRef.current.get(validFrame)!);
    }

    if (loadingSetRef.current.has(validFrame)) {
      return new Promise((resolve) => {
        const check = () => {
          if (imageCacheRef.current.has(validFrame)) {
            resolve(imageCacheRef.current.get(validFrame)!);
          } else {
            setTimeout(check, 20);
          }
        };
        check();
      });
    }

    loadingSetRef.current.add(validFrame);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = getFrameUrl(validFrame);
      img.onload = () => {
        imageCacheRef.current.set(validFrame, img);
        loadingSetRef.current.delete(validFrame);
        setForceRender(prev => prev + 1);
        resolve(img);
      };
      img.onerror = () => {
        loadingSetRef.current.delete(validFrame);
        reject(new Error(`Failed frame ${validFrame} for folder ${folderIndex}`));
      };
    });
  }, [folderIndex, totalFrames, getFrameUrl]);

  // Priority Preload: Load Frame 1 immediately + initial burst of 30 frames
  useEffect(() => {
    loadFrame(1);
    for (let i = 2; i <= Math.min(30, totalFrames); i++) {
      loadFrame(i);
    }
  }, [folderIndex, totalFrames, loadFrame]);

  // Dynamic Window Preload around currentFrame
  useEffect(() => {
    const validCurr = Math.max(1, Math.min(totalFrames, Math.round(currentFrame)));
    const start = Math.max(1, validCurr - 15);
    const end = Math.min(totalFrames, validCurr + 25);

    for (let i = start; i <= end; i++) {
      if (!imageCacheRef.current.has(i) && !loadingSetRef.current.has(i)) {
        loadFrame(i);
      }
    }
  }, [currentFrame, totalFrames, loadFrame]);

  // Background Stream Preloader for remaining frames
  useEffect(() => {
    let cancelled = false;

    const loadRemaining = async () => {
      // Step 1: Load every 2nd frame (keyframes)
      for (let i = 1; i <= totalFrames; i += 2) {
        if (cancelled) break;
        if (!imageCacheRef.current.has(i) && !loadingSetRef.current.has(i)) {
          await loadFrame(i).catch(() => {});
        }
      }
      // Step 2: Fill remaining intermediate frames
      for (let i = 2; i <= totalFrames; i += 2) {
        if (cancelled) break;
        if (!imageCacheRef.current.has(i) && !loadingSetRef.current.has(i)) {
          await loadFrame(i).catch(() => {});
        }
      }
    };

    const timer = setTimeout(loadRemaining, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [folderIndex, totalFrames, loadFrame]);

  // Canvas Render Loop
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const validCurrentFrame = Math.max(1, Math.min(totalFrames, Math.round(currentFrame)));
    
    // Find closest cached frame if specific frame is loading
    let imgToDraw: HTMLImageElement | undefined = imageCacheRef.current.get(validCurrentFrame);
    if (!imgToDraw) {
      let closestDiff = Infinity;
      for (const [fNum, cachedImg] of imageCacheRef.current.entries()) {
        const diff = Math.abs(fNum - validCurrentFrame);
        if (diff < closestDiff) {
          closestDiff = diff;
          imgToDraw = cachedImg;
        }
      }
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth || window.innerWidth;
    const displayHeight = canvas.clientHeight || window.innerHeight;

    if (canvas.width !== Math.floor(displayWidth * dpr) || canvas.height !== Math.floor(displayHeight * dpr)) {
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Fill theme background
    ctx.fillStyle = isDark ? '#07090E' : '#F7F7F4';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
      const imgWidth = imgToDraw.naturalWidth;
      const imgHeight = imgToDraw.naturalHeight;
      const aspectScale = Math.max(displayWidth / imgWidth, displayHeight / imgHeight) * scale;

      const renderW = imgWidth * aspectScale;
      const renderH = imgHeight * aspectScale;
      const offsetX = (displayWidth - renderW) / 2;
      const offsetY = (displayHeight - renderH) / 2;

      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.drawImage(imgToDraw, offsetX, offsetY, renderW, renderH);

      // Edge-Only Theme-Aware Gradient Overlay for high text contrast
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      const gradient = ctx.createLinearGradient(0, 0, 0, displayHeight);

      if (isDark) {
        gradient.addColorStop(0, 'rgba(7, 9, 14, 0.85)');
        gradient.addColorStop(0.18, 'rgba(7, 9, 14, 0.0)');
        gradient.addColorStop(0.82, 'rgba(7, 9, 14, 0.0)');
        gradient.addColorStop(1, 'rgba(7, 9, 14, 0.85)');
      } else {
        gradient.addColorStop(0, 'rgba(248, 249, 250, 0.95)');
        gradient.addColorStop(0.18, 'rgba(248, 249, 250, 0.0)');
        gradient.addColorStop(0.82, 'rgba(248, 249, 250, 0.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, displayWidth, displayHeight);
    }

    ctx.restore();
  }, [currentFrame, totalFrames, opacity, scale, isDark]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover pointer-events-none"
      />
    </div>
  );
};
