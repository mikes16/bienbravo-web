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

    const drawFrame = useCallback((index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = framesRef.current[index];
      if (!canvas || !ctx || !img) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }, []);

    useEffect(() => {
      let mounted = true;
      const imgs: HTMLImageElement[] = [];
      let loaded = 0;

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        img.onload = () => {
          loaded++;
          if (loaded === FRAME_COUNT && mounted) {
            framesRef.current = imgs;
            const canvas = canvasRef.current;
            if (canvas) {
              canvas.width = imgs[0].naturalWidth;
              canvas.height = imgs[0].naturalHeight;
            }
            readyRef.current = true;
            onLoaded?.();
          }
        };
        imgs.push(img);
      }

      return () => {
        mounted = false;
      };
    }, [onLoaded]);

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
