"use client";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { gsap } from "@/lib/gsap-plugins";

const FRAME_COUNT = 34;
const FRAME_PATH = "/images/chair-seq/frame-";
const PRIORITY_FRAMES = [1, FRAME_COUNT];

function frameSrc(i: number): string {
  return `${FRAME_PATH}${String(i).padStart(3, "0")}.webp`;
}

export interface ChairSequenceHandle {
  play: (duration?: number) => void;
  showLastFrame: () => void;
}

interface Props {
  className?: string;
  onLoaded?: () => void;
}

export const ChairSequence = forwardRef<ChairSequenceHandle, Props>(
  function ChairSequence({ className, onLoaded }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const readyRef = useRef(false);
    const firstFrameRef = useRef(false);

    const drawFrame = useCallback((index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = framesRef.current[index];
      if (!canvas || !ctx || !img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }, []);

    useEffect(() => {
      let mounted = true;
      const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);

      function initCanvas(img: HTMLImageElement) {
        const canvas = canvasRef.current;
        if (canvas && canvas.width === 0) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
      }

      function loadFrame(i: number): Promise<void> {
        return new Promise((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.src = frameSrc(i);
          imgs[i - 1] = img;
          img.onload = () => {
            if (!mounted) return resolve();
            initCanvas(img);
            if (!firstFrameRef.current && i === 1) {
              firstFrameRef.current = true;
              framesRef.current = imgs;
              readyRef.current = true;
              drawFrame(0);
              onLoaded?.();
            }
            resolve();
          };
          img.onerror = () => resolve();
        });
      }

      (async () => {
        await Promise.all(PRIORITY_FRAMES.map(loadFrame));
        if (!mounted) return;
        for (let i = 2; i < FRAME_COUNT; i++) {
          if (!mounted) return;
          await loadFrame(i);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [onLoaded, drawFrame]);

    useImperativeHandle(ref, () => ({
      play(duration = 1.0) {
        if (!readyRef.current) return;
        const obj = { frame: 0 };
        gsap.to(obj, {
          frame: FRAME_COUNT - 1,
          duration,
          ease: "none",
          snap: "frame",
          onUpdate: () => drawFrame(Math.round(obj.frame)),
        });
      },
      showLastFrame() {
        if (!readyRef.current) return;
        drawFrame(FRAME_COUNT - 1);
      },
    }), [drawFrame]);

    return (
      <canvas
        ref={canvasRef}
        className={className}
      />
    );
  },
);
