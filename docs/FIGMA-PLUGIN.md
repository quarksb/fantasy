# Figma 插件改造潜质评估

评估对象:`fantasy`(CSS matrix3d + Canvas 2D 视觉 demo 项目)
评估时间:2026-08-02

## 结论

**有潜质,中等偏上。** 项目天然分为「控制面板 UI / 数学核心 / 渲染目标」三层,前两层可几乎原样复用,Figma 插件只需替换渲染目标。适合做成**参数化 3D 图形/装饰资产生成器**,而不是复刻网页动画。

## 为什么有潜质

### 1. 项目分层恰好契合 Figma 插件架构

| 本项目分层 | 现状 | Figma 插件中的角色 |
| --- | --- | --- |
| 控制面板 | antd(Slider/Radio/Switch/InputNumber) | **插件 UI 几乎原样复用**(React + antd 打包进 `figma.showUI`) |
| 数学核心 | gl-matrix 矩阵、粒子/碰撞公式(纯函数) | **直接进插件主线程**,框架无关 |
| 渲染目标 | CSS `matrix3d` / Canvas 2D | 替换为「3D 投影 → 生成 Figma 场景节点」 |

`Lotus.tsx` 的矩阵管线(模型矩阵 × 视图矩阵 × 透视矩阵)、`HeartFlowers.tsx` 的心形 Path2D 公式、
`Collision.tsx` 的物理步进,都是纯数学,迁移成本低。

### 2. 3D→2D 投影是成熟技术

CSS matrix3d 的 16 元矩阵与标准 4×4 投影矩阵同构。加一层 perspective divide 即可:
`clip = proj × view × model × v3d → (x/w, y/w)` 得到 2D 坐标,再生成 `Polygon`/`Vector`/`Ellipse` 节点。

### 3. 匹配 Figma 插件的官方技术栈

Figma 插件官方模板即 **Vite + TS + React**(UI 用 React 生态,主线程单文件 bundle)。
本项目的 ts7 + vite8 + React19 + antd6 全部可以直接复用。

### 4. 有真实需求的方向

- 参数化装饰资产生成器:花瓣/莲花、蝶群、心形粒子、3D 徽章,生成后直接进画布可编辑
- 「3D 效果海报」批量生成:同一套参数出多帧变体
- 教学向:3D 数学 + 插件开发双主题练手

## 关键限制(必须想清楚再动手)

1. **Figma 画布无 CSS 3D、无运行时动画** —— 交付物是伪 3D 的 2D 快照;动画只能出现在插件 UI 的预览 iframe 里,用户点「生成」后写入静态节点(或逐帧生成序列帧)。
2. **贴图不能任意扭曲** —— logo/蝴蝶 PNG 只能以矩形/多边形 fill 形式贴,翅膀的透视形变要用多边形拼合近似,不能像 CSS 那样自由 matrix3d。
3. **投影管线要补写** —— 现有代码产出的是 CSS 矩阵字符串,需改为标准 `model/view/proj → 齐次 → 2D` 管线。
4. **主线程单文件** —— gl-matrix(~90KB)需打包进插件 bundle,体积可接受。

## 建议的改造路线(若动手)

```
src/
  core/math.ts        # 现有 gl-matrix 逻辑抽为纯函数(基本已独立)
  core/project.ts     # 新增:3D 顶点 → 2D 坐标(perspective divide)
  plugin/index.ts     # Figma 主线程:收 UI 参数 → 生成节点(figma.createPolygon/Vector/Ellipse)
  plugin/createNodes.ts
  ui/                 # 复用现有 antd 控制面板 + 加 2D 实时预览 canvas
manifest.json         # plugin (main 单文件) + ui (html)
```

打包:双入口 build(plugin 主线程 + UI),产物 `plugin.js` / `ui.html` 交给 Figma 加载。

## 评分

| 维度 | 评分(5 分制) | 说明 |
| --- | --- | --- |
| 技术复用率 | 4 | UI + 数学核心可复用,仅渲染目标需重写 |
| 产品价值 | 3 | 参数化资产生成器有市场,但需选对细分场景 |
| 学习价值 | 5 | 覆盖 3D 数学 + 插件开发 + 前端打包全链路 |
| 改造工作量 | 中 | 新增投影管线 + 节点生成器,约 300-400 行 |
