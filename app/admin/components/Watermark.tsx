'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Watermark({
  text = 'watermark',
  fontSize = 40,
  gap = 20,
  children,
}: WatermarkProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [flag, setFlag] = useState(0);

  const useWatermarkBg = () => {
    const canvas = document.createElement('canvas');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const fontSizePx = fontSize * devicePixelRatio;
    const font = `${fontSizePx}px serif`;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const { width } = ctx.measureText(text);
      const canvasSize = Math.max(100, width) + gap * devicePixelRatio;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((-45 * Math.PI) / 180);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = font;
      ctx.fillText(text, 0, 0);

      return {
        base64: canvas.toDataURL(),
        size: canvasSize,
        styleSize: canvasSize / devicePixelRatio,
      };
    }
    return {
      base64: '',
      size: 0,
      styleSize: 0,
    };
  };

  useEffect(() => {
    let div: HTMLDivElement | null = null;
    const bg = useWatermarkBg();

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        Array.from(record.removedNodes).forEach((node) => {
          if (node === div) {
            setFlag((prevFlag) => prevFlag + 1);
          }
        });
        if (record.target === div) {
          setFlag((prevFlag) => prevFlag + 1);
        }
      });
    });

    const parent = parentRef.current;
    if (parent) {
      (div as HTMLDivElement | null)?.remove();
      const { base64, styleSize } = bg;
      div = document.createElement('div');
      div.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        background-image: url(${base64});
        background-size: ${styleSize}px ${styleSize}px;
        background-repeat: repeat;
        z-index: 9999;
        inset: 0;
        pointer-events: none;
      `;
      parent.appendChild(div);
      observer.observe(parent, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
      if (div) div.remove();
    };
  }, [flag, text, fontSize, gap]);

  return (
    <div className="watermark-container" ref={parentRef}>
      {children}
    </div>
  );
}

interface WatermarkProps {
  text?: string;
  fontSize?: number;
  gap?: number;
  children?: React.ReactNode;
}
