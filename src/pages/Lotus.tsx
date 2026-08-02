import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mat4, quat, vec3 } from 'gl-matrix';
import { InputNumber, Radio, Slider, Switch } from 'antd';
import logo from '../assets/logo.png';
import portrait from '../assets/youyuxi.jpg';

type LotusType = 'one' | 'two' | 'three';

interface LotusCtl {
  type: LotusType;
  num: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  /** 是否飘逸:推进动画时间 */
  shuffle: boolean;
  /** 循环开关:是否运行动画 */
  animating: boolean;
  /** 透视开关 */
  perspective: boolean;
}

const ROTATE_KEYS = ['rotateX', 'rotateY', 'rotateZ'] as const;

const BASE_VIEW_POINT = vec3.fromValues(0, 0, 600);
const BASE_UP = vec3.fromValues(0, 1, 0);
const CENTER = vec3.fromValues(0, 0, 0);
const RADIUS = 200;

export default function Lotus() {
  const [ctl, setCtlState] = useState<LotusCtl>({
    type: 'one',
    num: 64,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    shuffle: true,
    animating: true,
    perspective: false,
  });
  // ref 镜像:动画循环每帧读取最新控制值,避免闭包拿到过期状态
  const ctlRef = useRef(ctl);
  const setCtl = (patch: Partial<LotusCtl>) => {
    ctlRef.current = { ...ctlRef.current, ...patch };
    setCtlState((prev) => ({ ...prev, ...patch }));
  };

  // 每帧重渲染的矩阵(转换后的 matrix3d 字符串)
  const [matrices, setMatrices] = useState<string[]>([]);
  const [viewTransform, setViewTransform] = useState('none');
  const timeRef = useRef(1);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!ctl.animating) return;

    // 原始透视矩阵会把 x/y 映射到 [0,1] 区间,乘缩放恢复显示大小
    const angle = Math.PI / 6;
    const k1 = Math.hypot(...BASE_VIEW_POINT) * Math.tan(angle / 2);
    const perspMatrix = mat4.multiply(
      mat4.create(),
      mat4.fromScaling(mat4.create(), vec3.fromValues(k1, k1, k1)),
      mat4.perspective(mat4.create(), angle, 1, 100, 10000),
    );

    const render = () => {
      const c = ctlRef.current;
      const time = timeRef.current;
      const { type, num, shuffle } = c;

      // 相机:旋转观察点得到 eye,lookAt 得到视图矩阵
      const q = quat.fromEuler(quat.create(), c.rotateX, c.rotateY, c.rotateZ);
      const eye = vec3.transformQuat(vec3.create(), BASE_VIEW_POINT, q);
      const up = vec3.transformQuat(vec3.create(), BASE_UP, q);
      const viewMat = mat4.lookAt(mat4.create(), eye, CENTER, up);
      const eyeHalf = vec3.scale(vec3.create(), eye, 0.5);

      const out: string[] = [];
      for (let i = 0; i < num; i++) {
        const m = mat4.create();
        if (type === 'one' || type === 'two') {
          if (type === 'one') {
            mat4.rotateZ(m, m, ((2 * (i + 0.04 * time)) / num) * Math.PI);
          } else {
            mat4.rotateY(m, m, ((2 * (i + 0.04 * time)) / num) * Math.PI);
          }
          mat4.rotateX(m, m, ((i % 8) * 0.25 - 0.005 * time) * Math.PI);
          mat4.translate(m, m, eyeHalf);
        } else {
          // type three:花瓣形 — 绕倾斜轴旋转 + 沿轴缩放
          const a = -0.02 * time + 0.25 * (i % 8) * Math.PI;
          const a1 = (i / num) * 2 * Math.PI;
          const scaleVec = vec3.fromValues(1, 3 * Math.cos(a) * Math.cos(a), 1);
          const axis = vec3.fromValues(Math.cos(a1), Math.sin(a1), 0);
          mat4.rotate(m, m, a, axis);
          mat4.rotateZ(m, m, a1);
          mat4.translate(m, m, vec3.fromValues(0, RADIUS, 0));
          mat4.scale(m, m, scaleVec);
          mat4.multiply(m, viewMat, m);
        }
        if (c.perspective) {
          mat4.multiply(m, perspMatrix, m);
        }
        out.push(m.toString());
      }

      setMatrices(out);
      setViewTransform(viewMat.toString());

      if (shuffle) timeRef.current += 1;
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ctl.animating]);

  return (
    <div className="lotus">
      <Link className="back-link" to="/">← 返回</Link>
      <div className="lotus-stage">
        {matrices.map((m, i) => (
          <img
            key={i}
            className="lotus-img"
            src={logo}
            alt=""
            style={{ transform: `matrix3d(${m})` }}
          />
        ))}
        <img
          className="lotus-portrait"
          src={portrait}
          alt="portrait"
          style={{ transform: `matrix3d(${viewTransform})` }}
        />
      </div>
      <div className="lotus-control">
        <Radio.Group
          value={ctl.type}
          onChange={(e) => setCtl({ type: e.target.value as LotusType })}
        >
          <Radio.Button value="one">type1</Radio.Button>
          <Radio.Button value="two">type2</Radio.Button>
          <Radio.Button value="three">type3</Radio.Button>
        </Radio.Group>

        <div className="ctl-row">
          <h4>基础图片数量</h4>
          <Slider
            min={8}
            max={64}
            value={ctl.num}
            onChange={(v) =>
              setCtl({ num: Math.floor((Array.isArray(v) ? v[0] : v) / 8) * 8 })
            }
          />
        </div>

        {ROTATE_KEYS.map((key) => (
          <div className="ctl-row" key={key}>
            <h4>绕{key.slice(-1)}轴旋转</h4>
            <Slider
              min={-180}
              max={180}
              value={ctl[key]}
              onChange={(v) =>
                setCtl({ [key]: Array.isArray(v) ? v[0] : v } as Partial<LotusCtl>)
              }
            />
            <InputNumber
              min={-180}
              max={180}
              value={ctl[key]}
              onChange={(v) => setCtl({ [key]: v ?? 0 } as Partial<LotusCtl>)}
            />
          </div>
        ))}

        <div className="ctl-row">
          <h4>循环开关</h4>
          <Switch
            checked={ctl.animating}
            onChange={(checked) => setCtl({ animating: checked })}
          />
        </div>
        <div className="ctl-row">
          <h4>动画开关</h4>
          <Switch
            checked={ctl.shuffle}
            onChange={(checked) => setCtl({ shuffle: checked })}
          />
        </div>
        <div className="ctl-row">
          <h4>透视开关</h4>
          <Switch
            checked={ctl.perspective}
            onChange={(checked) => setCtl({ perspective: checked })}
          />
        </div>
      </div>
    </div>
  );
}
