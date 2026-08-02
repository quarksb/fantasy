import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const RADIUS = 25;

export default function Collision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.body.clientHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 所有可变物理状态放在 effect 闭包里,canvas 直接绘制,无需 React 状态
    const px: number[] = [500, 800];
    const py: number[] = [430, 300];
    const vx: number[] = [0, -5];
    const vy: number[] = [-2.5, 0];
    let raf = 0;

    const drawCircle = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = '#12c2e9';
      ctx.fill();
    };

    const clear = () => {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      clear();
      const w = canvas.width;
      const h = canvas.height;

      // 移动 + 边界反弹(修复原实现:下边界 `py < 0` 检测错误、重复取反)
      for (let i = 0; i < px.length; i++) {
        px[i] += vx[i];
        py[i] += vy[i];

        if (px[i] > w - RADIUS) {
          vx[i] = -vx[i];
          px[i] = 2 * (w - RADIUS) - px[i];
        }
        if (px[i] < RADIUS) {
          vx[i] = -vx[i];
          px[i] = 2 * RADIUS - px[i];
        }
        if (py[i] > h - RADIUS) {
          vy[i] = -vy[i];
          py[i] = 2 * (h - RADIUS) - py[i];
        }
        if (py[i] < RADIUS) {
          vy[i] = -vy[i];
          py[i] = 2 * RADIUS - py[i];
        }

        drawCircle(px[i], py[i]);
      }

      // 两两弹性碰撞:回退到碰撞时刻,交换法向速度分量
      for (let i = 0; i < px.length; i++) {
        for (let j = i + 1; j < px.length; j++) {
          let dx = px[i] - px[j];
          let dy = py[i] - py[j];
          const distance = Math.hypot(dx, dy);
          if (distance < 2 * RADIUS) {
            const vx1 = vx[i];
            const vy1 = vy[i];
            const vx2 = vx[j];
            const vy2 = vy[j];
            const relSpeed = Math.hypot(vx1 - vx2, vy1 - vy2);
            if (relSpeed < 1e-9) {
              // 两球相对静止且重叠(如同一位置连点两次):沿连线推开,避免除零产生 NaN
              const inv = distance > 0 ? 1 / distance : 0;
              px[i] += dx * inv;
              py[i] += dy * inv;
              px[j] -= dx * inv;
              py[j] -= dy * inv;
              continue;
            }
            const t = (2 * RADIUS - distance) / relSpeed;

            // 位置回退到碰撞发生的时刻
            px[i] -= vx1 * t;
            py[i] -= vy1 * t;
            px[j] -= vx2 * t;
            py[j] -= vy2 * t; // 修复原实现:此处误用 vx2

            dx = px[i] - px[j];
            dy = py[i] - py[j];
            const k = ((vx1 - vx2) * dx + (vy1 - vy2) * dy) / (dx * dx + dy * dy);
            vx[i] = vx1 - k * dx;
            vy[i] = vy1 - k * dy;
            vx[j] = vx2 + k * dx;
            vy[j] = vy2 + k * dy;

            px[i] = Math.floor(px[i] + vx[i] * t);
            py[i] = Math.floor(py[i] + vy[i] * t);
            px[j] = Math.floor(px[j] + vx[j] * t);
            py[j] = Math.floor(py[j] + vy[j] * t);
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onClick = (e: MouseEvent) => {
      px.push(e.clientX - canvas.offsetLeft);
      py.push(e.clientY - canvas.offsetTop);
      vx.push(0);
      vy.push(0);
    };

    canvas.addEventListener('click', onClick);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="collision">
      <Link className="back-link" to="/">← 返回</Link>
      <div className="front-hint">
        在{' '}
        <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Advanced_animations">
          canvas 动画教程
        </a>{' '}
        基础上加点碰撞(通过鼠标单击添加新的小球)
      </div>
      <canvas ref={canvasRef} className="full" />
    </div>
  );
}
