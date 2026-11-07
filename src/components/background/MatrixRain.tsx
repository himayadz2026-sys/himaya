import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  speed?: 'slow' | 'normal' | 'fast';
  density?: 'low' | 'medium' | 'high';
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  speed = 'normal',
  density = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDrops();
    };

    window.addEventListener('resize', handleResize);

    // Characters: Katakana, Numbers, Cyber characters
    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜHIMAYA🛡️⚡'.split('');

    // Column spacing based on density
    const fontSize = density === 'high' ? 12 : density === 'low' ? 18 : 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = [];

    const initDrops = () => {
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Random starting position so they don't all fall in a flat line
        drops[i] = Math.floor(Math.random() * -100);
      }
    };

    initDrops();

    const speedInterval = speed === 'fast' ? 24 : speed === 'slow' ? 55 : 35;
    let lastTime = 0;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (currentTime - lastTime < speedInterval) return;
      lastTime = currentTime;

      // Dark translucent black overlay to create trail fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading character is brighter / white-green
        ctx.fillStyle = '#C8FFD4';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00FF41';
        ctx.fillText(text, x, y);

        // Body characters are neon green
        ctx.fillStyle = Math.random() > 0.8 ? '#00FF41' : 'rgba(0, 255, 65, 0.65)';
        ctx.shadowBlur = 4;
        ctx.fillText(text, x, y - fontSize);

        // Reset drop once off-screen with randomized delay
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
      style={{ display: 'block' }}
    />
  );
};
