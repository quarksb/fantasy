import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mat4 } from 'gl-matrix';
import { InputNumber, Slider } from 'antd';

interface RotateCtl {
  x: number;
  y: number;
  z: number;
}

const ROTATE_KEYS = ['x', 'y', 'z'] as const;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export default function Butterfly() {
  const [rotate, setRotateState] = useState<RotateCtl>({ x: 0, y: 0, z: 0 });
  const rotateRef = useRef(rotate);
  const setRotate = (patch: Partial<RotateCtl>) => {
    rotateRef.current = { ...rotateRef.current, ...patch };
    setRotateState((prev) => ({ ...prev, ...patch }));
  };

  const [pose, setPose] = useState({ body: '', wingL: '', wingR: '' });
  const rafRef = useRef(0);

  useEffect(() => {
    let time = 0;
    const tick = () => {
      const r = rotateRef.current;
      // 基底矩阵:单位阵依次绕 X/Y/Z 旋转(与 Vue 版顺序一致)
      const base = mat4.create();
      mat4.rotateX(base, base, toRad(r.x));
      mat4.rotateY(base, base, toRad(r.y));
      mat4.rotateZ(base, base, toRad(r.z));

      // 翅膀扇动角:58° * sin(0.1 * t)
      const angle = 58 * Math.sin(0.1 * time);
      const baseStr = base.toString();
      setPose({
        body: `matrix3d(${baseStr})`,
        wingL: `matrix3d(${baseStr}) rotateY(${30 + angle}deg)`,
        wingR: `matrix3d(${baseStr}) rotateY(${150 - angle}deg)`,
      });
      time += 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="butterfly">
      <Link className="back-link" to="/">← 返回</Link>
      <div className="butterfly-stage">
        <div className="butterfly-box">
          <div className="butterfly-body" style={{ transform: pose.body }} />
          <div className="butterfly-wing" style={{ transform: pose.wingL }} />
          <div className="butterfly-wing" style={{ transform: pose.wingR }} />
        </div>
      </div>
      <div className="butterfly-control">
        {ROTATE_KEYS.map((key) => {
          const label = key.toUpperCase();
          const value = rotate[key];
          return (
            <div className="ctl-row" key={key}>
              <h4>绕{label}轴旋转</h4>
              <Slider
                min={-180}
                max={180}
                value={value}
                onChange={(v) =>
                  setRotate({ [key]: Array.isArray(v) ? v[0] : v } as Partial<RotateCtl>)
                }
              />
              <InputNumber
                min={-180}
                max={180}
                value={value}
                onChange={(v) => setRotate({ [key]: v ?? 0 } as Partial<RotateCtl>)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
