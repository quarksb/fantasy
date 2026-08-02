import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HeartFlowers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.body.clientHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const radius = h - w ? w : h; // 沿用原实现:取短边(实际恒为 w)
    ctx.translate(w / 2, h / 2);

    let step = 1;
    let moveStep = 0;
    let spin = 0;
    let raf = 0;

    const drawHeart = (x: number, y: number, size: number) => {
      const ratio = size == null ? 1 : size / 60;
      ctx.fill(
        new Path2D(
          `M${x} ${y - 30 * ratio} c0 ${-3 * ratio} ${-10 * ratio} ${-15 * ratio} ${-25 * ratio} ${-15 * ratio} c ${-30 * ratio} 0 ${-30 * ratio} ${30 * ratio} ${-30 * ratio} ${30 * ratio} c0 ${25 * ratio} ${20 * ratio} ${47 * ratio} ${55 * ratio} ${65 * ratio} c ${35 * ratio} ${-18 * ratio} ${55 * ratio} ${-40 * ratio} ${55 * ratio} ${-65 * ratio} c0 0 0 ${-30 * ratio} ${-30 * ratio} ${-30 * ratio} c ${-15 * ratio} 0 ${-25 * ratio} ${12 * ratio} ${-25 * ratio} ${15 * ratio} Z`,
        ),
      );
    };

    const draw = () => {
      ctx.clearRect(-w / 2, -h / 2, w, h);
      // 5 圈心形,逐圈缩小颜色渐变
      for (let i = 1; i < 6; i++) {
        ctx.save();
        ctx.fillStyle = `rgb(${51 * i},${255 - 51 * i},255)`;
        ctx.rotate(Math.PI * 0.01 * i * (i % 2 ? step : -step));
        for (let j = 0; j < i * 6; j++) {
          ctx.transform(
            Math.cos((Math.PI * 2) / (i * 6)),
            Math.sin((Math.PI * 2) / (i * 6)),
            -Math.sin((Math.PI * 2) / (i * 6)),
            Math.cos((Math.PI * 2) / (i * 6)),
            0,
            0,
          );
          drawHeart(
            ((i * radius) / 20 + 10 * moveStep) * Math.sqrt(1 - spin * spin) * spin,
            ((i * radius) / 20 + 10 * moveStep) * spin,
            ((20 + 10 * moveStep) * radius) / 1200,
          );
        }
        ctx.restore();
      }
      step += 0.2;
      moveStep = Math.cos((Math.PI * step) / 60);
      spin = Math.cos((Math.PI * step) / 120);
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="heart">
      <Link className="back-link" to="/">← 返回</Link>
      <canvas ref={canvasRef} className="full" />
    </div>
  );
}
