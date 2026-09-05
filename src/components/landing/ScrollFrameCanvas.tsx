import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollFrameCanvasProps {
  folderIndex: number; // 1 to 7
  totalFrames: number; // 200 or 250
  currentFrame: number;
  isIntersecting?: boolean;
  className?: string;
  darkOverlay?: boolean;
  overlayOpacity?: number; // 0.0 to 1.0
}

function formatFrameFilename(index: number): string {
  const padded = String(Math.max(1, Math.round(index))).padStart(3, '0');
  return `ezgif-frame-${padded}.jpg`;
}

export const ScrollFrameCanvas: React.FC<ScrollFrameCanvasProps> = ({
  folderIndex,
  totalFrames,
  currentFrame,
  isIntersecting = true,
  className = '',
  darkOverlay = true,
  overlayOpacity = 0.25,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSetRef = useRef<Set<number>>(new Set());
  const [, setForceRender] = useState<number>(0);

  const getFrameUrl = useCallback((frameNum: number) => {
    return `/assets/${folderIndex}/${formatFrameFilename(frameNum)}`;
  }, [folderIndex]);

  const loadFrame = useCallback((frameNum: number): Promise<HTMLImageElement> => {
    const validFrame = Math.max(1, Math.min(totalFrames, frameNum));
    
    if (imageCacheRef.current.has(validFrame)) {
      return Promise.resolve(imageCacheRef.current.get(validFrame)!);
    }

    if (loadingSetRef.current.has(validFrame)) {
      return new Promise((resolve) => {
        const check = () => {
          if (imageCacheRef.current.has(validFrame)) {
            resolve(imageCacheRef.current.get(validFrame)!);
          } else {
            setTimeout(check, 25);
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
        // Force canvas redraw when new frame loads
        setForceRender(prev => prev + 1);
        resolve(img);
      };
      img.onerror = () => {
        loadingSetRef.current.delete(validFrame);
        reject(new Error(`Failed to load frame ${validFrame} for folder ${folderIndex}`));
      };
    });
  }, [folderIndex, totalFrames, getFrameUrl]);

  // Priority Preload: Frame 1 immediately + initial burst of 30 frames
  useEffect(() => {
    loadFrame(1);
    for (let i = 2; i <= Math.min(35, totalFrames); i++) {
      loadFrame(i);
    }
  }, [folderIndex, totalFrames, loadFrame]);

  // Dynamic Window Preload around currentFrame
  useEffect(() => {
    const start = Math.max(1, currentFrame - 20);
    const end = Math.min(totalFrames, currentFrame + 30);

    for (let i = start; i <= end; i++) {
      if (!imageCacheRef.current.has(i) && !loadingSetRef.current.has(i)) {
        loadFrame(i);
      }
    }
  }, [currentFrame, totalFrames, loadFrame]);

  // Background Preloader for remaining frames
  useEffect(() => {
    let cancelled = false;

    const loadRemaining = async () => {
      for (let i = 1; i <= totalFrames; i++) {
        if (cancelled) break;
        if (!imageCacheRef.current.has(i) && !loadingSetRef.current.has(i)) {
          await loadFrame(i).catch(() => {});
          await new Promise(r => setTimeout(r, 12));
        }
      }
    };

    const timer = setTimeout(loadRemaining, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [folderIndex, totalFrames, loadFrame]);

  // Render Frame onto Canvas with cover geometry
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const validCurrentFrame = Math.max(1, Math.min(totalFrames, Math.round(currentFrame)));
    
    // Find closest available frame if currentFrame is still loading
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

    // Dark solid base background
    ctx.fillStyle = '#07090E';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
      const imgWidth = imgToDraw.naturalWidth;
      const imgHeight = imgToDraw.naturalHeight;
      const scale = Math.max(displayWidth / imgWidth, displayHeight / imgHeight);

      const renderW = imgWidth * scale;
      const renderH = imgHeight * scale;
      const offsetX = (displayWidth - renderW) / 2;
      const offsetY = (displayHeight - renderH) / 2;

      // Draw the frame image
      ctx.drawImage(imgToDraw, offsetX, offsetY, renderW, renderH);

      // Subtle overlay gradient to ensure high contrast without darkening the main visual
      if (darkOverlay && overlayOpacity > 0) {
        // Base light dark tint
        ctx.fillStyle = `rgba(7, 9, 14, ${overlayOpacity})`;
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        // Top & bottom gradient for text contrast
        const gradient = ctx.createLinearGradient(0, 0, 0, displayHeight);
        gradient.addColorStop(0, 'rgba(7, 9, 14, 0.65)');
        gradient.addColorStop(0.25, 'rgba(7, 9, 14, 0.15)');
        gradient.addColorStop(0.75, 'rgba(7, 9, 14, 0.15)');
        gradient.addColorStop(1, 'rgba(7, 9, 14, 0.7)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      }
    }

    ctx.restore();
  }, [currentFrame, totalFrames, darkOverlay, overlayOpacity]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#07090E] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover pointer-events-none"
      />
    </div>
  );
};
