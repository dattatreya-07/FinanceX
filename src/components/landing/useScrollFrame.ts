import { useState, useEffect, useRef, RefObject } from 'react';

export interface UseScrollFrameOptions {
  totalFrames: number;
  scrollMultiplier?: number; // Height of scroll container relative to viewport (e.g. 3 = 300vh)
  smoothingAlpha?: number; // Lerp factor (0.1 - 0.3 works best)
}

export interface UseScrollFrameReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  currentFrame: number;
  targetFrame: number;
  progress: number; // 0.0 to 1.0
  isIntersecting: boolean;
}

export function useScrollFrame({
  totalFrames,
  smoothingAlpha = 0.18,
}: UseScrollFrameOptions): UseScrollFrameReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [targetFrame, setTargetFrame] = useState<number>(1);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);

  // Intersection Observer to enable/disable animation loop when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll listener to compute target frame
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollableHeight = rect.height - viewportHeight;

      if (totalScrollableHeight <= 0) {
        setProgress(0);
        setTargetFrame(1);
        targetFrameRef.current = 1;
        return;
      }

      // Distance from top of container to top of viewport
      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollableHeight));
      
      const computedTargetFrame = Math.max(
        1,
        Math.min(totalFrames, Math.round(1 + rawProgress * (totalFrames - 1)))
      );

      setProgress(rawProgress);
      setTargetFrame(computedTargetFrame);
      targetFrameRef.current = computedTargetFrame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [totalFrames]);

  // Smooth lerp loop using requestAnimationFrame
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        const next = current + diff * smoothingAlpha;
        currentFrameRef.current = next;
        const rounded = Math.max(1, Math.min(totalFrames, Math.round(next)));
        setCurrentFrame(rounded);
      } else if (current !== target) {
        currentFrameRef.current = target;
        setCurrentFrame(target);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [totalFrames, smoothingAlpha]);

  return {
    containerRef,
    currentFrame,
    targetFrame,
    progress,
    isIntersecting,
  };
}
