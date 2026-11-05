'use client';

import { useState, useEffect } from 'react';

interface AlbumColorResult {
  dominantRgb: string; // e.g. "245, 158, 11"
  glowStyle: {
    backgroundColor?: string;
    boxShadow?: string;
    background?: string;
  };
}

const DEFAULT_RGB = '245, 158, 11'; // Warm Sonora Amber default

// Cache to prevent re-extracting for the same image URL
const colorCache = new Map<string, string>();

export function useAlbumColor(imageUrl?: string): AlbumColorResult {
  const [rgb, setRgb] = useState<string>(DEFAULT_RGB);

  useEffect(() => {
    if (!imageUrl) {
      setRgb(DEFAULT_RGB);
      return;
    }

    if (colorCache.has(imageUrl)) {
      setRgb(colorCache.get(imageUrl)!);
      return;
    }

    // Attempt client-side canvas color sampling
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 16) {
          const pixelR = data[i];
          const pixelG = data[i + 1];
          const pixelB = data[i + 2];
          const brightness = (pixelR * 299 + pixelG * 587 + pixelB * 114) / 1000;

          // Avoid completely pitch black or pure blinding white
          if (brightness > 35 && brightness < 225) {
            r += pixelR;
            g += pixelG;
            b += pixelB;
            count++;
          }
        }

        if (count > 0) {
          const avgR = Math.round(r / count);
          const avgG = Math.round(g / count);
          const avgB = Math.round(b / count);
          const extracted = `${avgR}, ${avgG}, ${avgB}`;
          colorCache.set(imageUrl, extracted);
          setRgb(extracted);
        } else {
          setRgb(DEFAULT_RGB);
        }
      } catch {
        // Fallback for CORS restricted images
        setRgb(DEFAULT_RGB);
      }
    };

    img.onerror = () => {
      if (!isCancelled) setRgb(DEFAULT_RGB);
    };

    img.src = imageUrl;

    return () => {
      isCancelled = true;
    };
  }, [imageUrl]);

  return {
    dominantRgb: rgb,
    glowStyle: {
      background: `radial-gradient(circle at 50% 100%, rgba(${rgb}, 0.22) 0%, rgba(${rgb}, 0.05) 50%, transparent 80%)`,
    },
  };
}

