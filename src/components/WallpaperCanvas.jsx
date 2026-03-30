import { useEffect, useRef } from 'react';

const CHARS = '01';
const COL_W = 14;

export default function WallpaperCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drops = [];
    let animId;
    let last = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.floor(w / COL_W);
      drops = Array.from({ length: cols }, () => -Math.floor(Math.random() * 80));
    }

    function animate(ts) {
      animId = requestAnimationFrame(animate);
      if (ts - last < 42) return;
      last = ts;

      const W = window.innerWidth, H = window.innerHeight;
      // RETRO RETHEME — blue tinted rain effect
      ctx.fillStyle = 'rgba(58,110,165,0.06)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${COL_W - 1}px "Segoe UI", Tahoma, sans-serif`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i];
        if (y < 0) { drops[i]++; continue; }
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * COL_W;

        ctx.fillStyle = '#2989D8';
        ctx.shadowColor = '#2989D8';
        ctx.shadowBlur = 6;
        ctx.fillText(ch, x, y * COL_W);

        if (y > 0) {
          ctx.fillStyle = 'rgba(41,137,216,0.5)';
          ctx.shadowBlur = 3;
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, (y - 1) * COL_W);
        }
        ctx.shadowBlur = 0;

        if (y * COL_W > H && Math.random() > 0.975) {
          drops[i] = -Math.floor(Math.random() * 40);
        } else {
          drops[i]++;
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(animate);

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(animate);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas id="desktop-canvas" ref={canvasRef} />;
}
