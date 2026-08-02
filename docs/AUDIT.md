# fantasy 项目审计报告

审计日期:2026-08-02
审计范围:以 `vite 8 + TypeScript 7 + React 19` 为目标栈,对原 `vue3 + vite 2` 项目做迁移评估与重写。

## 1. 原项目现状

| 维度 | 内容 |
| --- | --- |
| 技术栈 | Vue 3.2 + Vite 2.2 + TypeScript(名义上)+ gl-matrix 3.3 + ant-design-vue 3.0.0-alpha + less |
| 路由 | vue-router 4,hash 模式,5 个页面 |
| 代码量 | 约 900 行(`src/components/*.vue`) |
| 构建产物 | 静态站点,部署到 GitHub Pages(`quarksb.github.io`) |
| 最后提交 | 2021-11-08(vite + vue3 重构),此后 3 年多未动 |

### 页面清单

| 路由 | 组件 | 实现方式 | 说明 |
| --- | --- | --- | --- |
| `/` | Index.vue | — | 导航首页 |
| `/lotus` | lotus.vue | gl-matrix 矩阵 → CSS `matrix3d` | 核心页面:64 张图按矩阵旋转,三种形态 + 透视 |
| `/magicText` | text/index.vue + text/butterfly.vue | gl-matrix + CSS `matrix3d` | 蝴蝶扇翅动画 |
| `/heartFlowers` | heartFlowers.vue | canvas 2D | 心形花朵粒子动画 |
| `/collision` | collision.vue | canvas 2D | 小球碰撞(点击加球) |

`water.vue` 是 `heartFlowers.vue` 的逐字重复副本,未挂路由。

## 2. 原项目问题清单(重写时已修复/规避)

### 功能性 bug
1. **`text/index.vue`:`this.matrixs.splice()` 空调用**——参数为空,不删除任何元素,本意是触发响应式重渲染,实际无效。
2. **`collision.vue` 下边界检测错误**——`py[i] > h - radius || py[i] < 0` 中 `py[i] < 0` 应为 `py[i] < radius`;且与后续 `py[i] < radius` 分支重复取反,会导致小球贴顶时速度反复翻转。
3. **`collision.vue` 碰撞位置回退用错变量**——`py[j] = py[j] - vx2 * t` 应为 `vy2`(垂直方向用了水平速度)。
4. **`lotus.vue` 每帧 `this.matrixs.splice()` 同样无效**,且 `requestAnimationFrame` 在组件卸载后不清理(路由切换后动画继续跑)。

### 工程问题
5. 声称 TypeScript 项目但**没有 `tsconfig.json`**,仅 `main.ts` / `vite.config.ts` 两个 .ts 文件,组件全部为无类型 JS。
6. `.babelrc` 是 webpack/babel 时代残留(ant-design-vue 按需加载),对 vite 完全无效。
7. `travis.yml` 已废弃;`README.md` 的 `yarn` 命令与实际 `pnpm` 不符。
8. 脏代码:`console.info('sb')`(2 处)、CSS 拼写错误(`width: 100p` 少 x)、`styleMarginLeft` 驼峰错误。
9. 依赖全部停留在 2021 年(ant-design-vue 还是 `3.0.0-alpha`),存在供应链与兼容性风险。

## 3. 迁移决策

| 决策点 | 选择 | 理由 |
| --- | --- | --- |
| 框架 | Vue → **React 19** | 用户指定目标栈 |
| 构建 | Vite 2 → **Vite 8**(rolldown 内核) | 用户指定;node 22.21.1 满足 `^20.19 || >=22.12` |
| 编译器 | 无 → **TypeScript 7.0.2**(原生 Go 版) | 用户指定;顺带补齐全部类型 |
| UI 控件 | ant-design-vue → **antd 6**(React 版) | 用户指定保留 antd 体系 |
| 路由 | vue-router → **react-router-dom 7**,沿用 hash 模式 | GitHub Pages 静态托管下 hash 路由免 404 配置 |
| 渲染核心 | gl-matrix 保留 | 框架无关纯 JS 库,算法可原样复用 |
| less | **移除** | antd v6 基于 CSS-in-JS,不再需要 less 预处理器 |

## 4. 迁移工作量与复用率

- 核心算法(矩阵变换、canvas 绘制、碰撞物理)约 70% 可**逐行复用**,仅需包装进 React 生命周期:
  - `lotus.vue` 的 `render()` 循环 → `useEffect` + `requestAnimationFrame`,refs 镜像控制参数(避免闭包 stale);
  - Vue `computed`(eye / viewMat)→ 普通函数;
  - `this.$refs.canvas` → `useRef<HTMLCanvasElement>`。
- 纯 UI 层(模板、控制面板)全部重写为 TSX。
- 预计结果:5 页约 900 行(混 JS)→ ~750 行严格类型 TSX,且去掉重复文件与死代码。

## 5. 迁移后收益

1. 全项目严格类型(`strict: true`),TS 7 原生编译器,类型检查秒级完成。
2. 构建从 vite 2(esbuild/rollup)升级到 vite 8(rolldown),产物更快更小。
3. 修复上述 9 项问题(含 2 个物理模拟 bug)。
4. 卸载 3 个 Vue 专属依赖 + less,依赖面收窄。
