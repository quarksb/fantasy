import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';

const demos = [
  {
    to: '/lotus',
    title: '莲花 Lotus',
    desc: '64 张图片经 gl-matrix 矩阵旋转,三种形态 + 透视开关,纯 CSS matrix3d 渲染',
  },
  {
    to: '/magicText',
    title: '蝴蝶 Butterfly',
    desc: 'gl-matrix 计算基底矩阵,翅膀绕 transform-origin 正弦扇动',
  },
  {
    to: '/heartFlowers',
    title: '心形花朵 Heart Flowers',
    desc: 'Canvas 2D 心形粒子,五环旋转扩散动画',
  },
  {
    to: '/collision',
    title: '碰撞 Collision',
    desc: 'Canvas 小球弹性碰撞模拟,点击画布任意位置添加新球',
  },
];

export default function Home() {
  return (
    <div className="home">
      <Typography.Title level={2}>Fantasy · CSS matrix3d magic</Typography.Title>
      <Typography.Paragraph type="secondary">
        用 <code>gl-matrix</code> 计算 3D 变换矩阵,再经 CSS <code>matrix3d()</code> 渲染到 DOM 的演示项目。
        本版为 React 19 + Vite 8 + TypeScript 7 迁移重写。
      </Typography.Paragraph>
      <div className="home-cards">
        {demos.map((d) => (
          <Link key={d.to} to={d.to}>
            <Card hoverable title={d.title} style={{ height: '100%' }}>
              {d.desc}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
