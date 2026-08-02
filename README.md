# fantasy

> 展示 CSS `matrix3d` 的魔力:用 [gl-matrix](https://github.com/toji/gl-matrix) 在 JavaScript 里计算 3D 变换矩阵,经 CSS `matrix3d()` 渲染到 DOM。

技术栈:**React 19 + Vite 8 + TypeScript 7 + antd 6**。

## 页面

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | Home | 导航首页 |
| `/lotus` | Lotus | 64 张图片矩阵旋转,三种形态 + 透视开关 |
| `/magicText` | Butterfly | 蝴蝶扇翅动画 |
| `/heartFlowers` | Heart Flowers | Canvas 心形粒子动画 |
| `/collision` | Collision | Canvas 小球碰撞,点击加球 |

## 开发

```bash
bun install
bun run dev       # 开发服务器
bun run build     # tsc 类型检查 + 生产构建
bun run preview   # 本地预览构建产物(8080)
```

> 包管理器:项目以 [bun](https://bun.sh) 为准(`packageManager` 已锁定)。

### 环境注意(本机)

若 `bun install` 报 `unable to write files to tempdir: PermissionDenied`,是全局缓存目录
`~/.bun/install/cache` 不可写(bun 的报错信息有误导性,见 [oven-sh/bun#32634](https://github.com/oven-sh/bun/issues/32634))。
将缓存指到可写路径即可:

```bash
BUN_INSTALL_CACHE_DIR=.bun-cache bun install
```

## 部署

```bash
bun run deploy    # 构建并推送 GitHub Pages
```

## 迁移记录

本仓库由 2021 年的 Vue 3 + Vite 2 版本迁移重写而来,迁移决策、原项目问题清单见 [docs/AUDIT.md](./docs/AUDIT.md)。
