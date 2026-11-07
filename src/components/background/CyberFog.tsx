import React, { useEffect, useRef } from 'react';

export const CyberFog: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system for floating cyber energy motes
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2, // Drift upward
      alpha: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }));

    let fogOffset1 = 0;
    let fogOffset2 = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Moving subtle green fog layer
      fogOffset1 += 0.003;
      fogOffset2 -= 0.002;

      // Top-left fog
      const grad1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(fogOffset1) * 80,
        height * 0.2 + Math.cos(fogOffset1) * 60,
        20,
        width * 0.3,
        height * 0.2,
        width * 0.7
      );
      grad1.addColorStop(0, 'rgba(0, 255, 65, 0.07)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Bottom-right moving fog
      const grad2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(fogOffset2) * 100,
        height * 0.7 + Math.sin(fogOffset2) * 80,
        30,
        width * 0.7,
        height * 0.7,
        width * 0.8
      );
      grad2.addColorStop(0, 'rgba(0, 255, 65, 0.05)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw floating glowing particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00FF41';
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
};
