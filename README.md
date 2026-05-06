# liyuan4ly-site

LIYUAN 的个人网站,生产地址 `https://liyuan4ly.com`。

包含「关于我」「项目展示」「博客」三大模块,搭配入场页 + 双主题(夕阳/月夜)。
Astro 静态站,部署在 Cloudflare Pages,push `main` 自动构建。

## 技术栈

- **框架**: Astro v6(静态站点生成器,文件即路由)
- **样式**: Tailwind v4(`@theme` block + CSS 变量驱动主题切换)
- **内容**: Content Collections + zod schema 校验
- **字体**: Inter(英文)+ Noto Sans SC(中文)
- **部署**: Cloudflare Pages
- **Node 版本**: ≥ 22.12

## 项目结构

```
liyuan4ly-site/
├── src/
│   ├── pages/                    # 文件路由,每个文件即一个页面
│   │   ├── welcome.astro         # 入场页(首访引导主题)
│   │   ├── index.astro           # 「关于我」首页
│   │   ├── projects.astro        # 项目展示
│   │   └── blog/
│   │       ├── index.astro       # 博客列表
│   │       └── [...slug].astro   # 博客详情(动态路由)
│   ├── layouts/
│   │   └── BaseLayout.astro      # 全站外壳:导航 / 主题 / 字体
│   ├── components/
│   │   ├── Nav.astro
│   │   └── ThemeToggle.astro
│   ├── content/
│   │   └── blog/                 # 博客文章 Markdown
│   │       └── hello-world.md
│   ├── content.config.ts         # 博客 frontmatter schema(zod)
│   ├── data/
│   │   └── projects.json         # 项目展示静态数据
│   ├── lib/
│   │   └── theme.ts              # 主题切换运行时
│   └── styles/
│       └── global.css            # Tailwind + 主题 token + CSS 变量
├── public/
│   ├── bg/entrance.webp          # 入场背景图
│   └── favicon.{ico,svg}
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 本地开发

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # 输出到 dist/
npm run preview      # 本地预览构建产物
```

## 部署

Cloudflare Pages GitHub 集成:push `main` 后自动构建。
配置已在 Pages 控制台保存:

- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **Node 版本**: v22.16(Cloudflare 默认)

## 页面与路由

| Path | 文件 | 说明 |
|---|---|---|
| `/welcome` | `pages/welcome.astro` | 入场选择主题(首访自动跳此) |
| `/` | `pages/index.astro` | 「关于我」 |
| `/projects` | `pages/projects.astro` | 项目展示(数据来自 `data/projects.json`) |
| `/blog` | `pages/blog/index.astro` | 博客列表 |
| `/blog/<slug>` | `pages/blog/[...slug].astro` | 博客详情(动态路由,slug 即文件名) |

**首访引导**: 未在 localStorage 找到主题选择时,任意页面会跳到 `/welcome`;
已选过的回访直接进入对应页面。

## 主题系统

双主题 **夕阳(sunset)** 和 **月夜(moonlight)**,实现要点:

1. **CSS 变量** 定义在 `src/styles/global.css`:
   - 默认 `:root` 是夕阳
   - `[data-theme="moonlight"]` 是月夜覆盖
2. **运行时切换** 由 `src/lib/theme.ts` 提供:
   - `applyTheme(theme)` — 设置 `data-theme` 属性 + 持久化到 localStorage
   - `setTheme(theme)`、`toggleTheme()` — 用户操作入口
3. **防闪烁**: BaseLayout 头部内联脚本在渲染前同步读 localStorage,
   避免主题切换时白屏一瞬

**Tailwind 用法约定**: 颜色统一从 CSS 变量读(如 `bg-[var(--color-bg)]`),
**不要硬编码 `bg-zinc-900` 这类**——会破坏主题切换。

## 博客(Content Collections)

新增博客文章:

1. 在 `src/content/blog/` 下新建 `<slug>.md`
2. frontmatter 必须满足 `src/content.config.ts` 的 schema:
   ```yaml
   ---
   title: '文章标题'           # 必填
   pubDate: 2026-04-28         # 必填,zod 自动解析为 Date
   description: '简介'         # 可选,用于列表页 + SEO
   tags: ['astro', 'web']      # 可选,默认 []
   draft: false                # 可选,默认 false;true 时列表页可过滤
   ---
   ```
3. 字段缺失/类型错误会在 `npm run build` 时直接报错
4. 文件名即 URL slug:`hello-world.md` → `/blog/hello-world`

## 项目展示数据

`src/data/projects.json` 维护静态项目列表(当前 4 个项目)。
**未接 GitHub API**——少量项目手维护即可,接 API 是过度工程。

## 域名

- **裸域作主**: `https://liyuan4ly.com`
- **`www`** 永久 301 重定向到裸域
- HTTPS 由 Cloudflare 自动签发

## 文档索引

- `CLAUDE.md` — 给 Claude Code 协作的项目约定
- `docs/decisions/` — 架构决策记录(ADR)
- `studio/notes/dev/学习笔记.md`(workspace 级)— 跨项目知识沉淀
- `studio/plans/0001-bot-site.md`(workspace 级)— 本项目的开发计划档案
- `studio/路线图.md` — 包含 site 未立项的优化种子(SITE-XX 编号)
