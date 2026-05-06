# ADR 0001: 网站框架选 Astro 而非 Next.js / VitePress

- **状态**: Accepted
- **日期**: 2026-04-27
- **决策者**: LIYUAN

## Context

需要选定个人网站的前端框架。候选:

| 候选 | 性质 | 优点 | 缺点 |
|---|---|---|---|
| **Astro** | 静态站点生成器,文件即路由 | 学习曲线低、零运行时 JS、可复用 Vue/React 组件、构建产物纯静态 | 生态相对小,SSR/动态场景需手动配 adapter |
| **Next.js** | React 全栈框架 | 生态最大、SSR/ISR 一应俱全 | 个人静态站用不到 SSR,反而引入复杂度;React 学习成本高于用户当前 Vue 背景 |
| **VitePress** | Vue 文档站点生成器 | Vue 原生、构建快 | 偏文档站,自定义页面布局费劲 |
| **裸 Vite + Vue3** | 自己搭 | 完全可控 | 需要手写路由/构建/部署链路,违背"学习 > 结果"原则 |

用户的实际背景与目标:
- Spring Boot + Vue3 背景,前端用 Vue3 多
- 网站只需「关于我 / 项目展示 / 博客」三模块,**纯静态可满足**
- 学习目标包括"完整部署链路",框架本身复杂度不应抢戏

## Decision

**选用 Astro v6**。

具体理由:
- "文件即路由" 概念最直观,适合学习
- 构建产物是纯静态 HTML/CSS/JS,Cloudflare Pages 完美匹配
- 后续如需引入交互组件,可直接复用 Vue3 知识(`@astrojs/vue` 集成)
- Content Collections 把 Markdown 当一等公民,博客模块开箱即用

## Consequences

**正面**:
- ✅ 阶段 1 半天完成首页上线 + 完整部署链路
- ✅ 构建产物纯静态,Cloudflare Pages 全球边缘缓存,加载快
- ✅ Markdown 博客零额外代码,Content Collections + zod 校验自动报错
- ✅ Vue 组件可平滑接入未来需要交互的页面(目前没用上)

**负面 / 限制**:
- ❌ Astro 组件无响应式系统,需要按"构建时执行 + 运行时静态"心智模型
  (容易踩 Vue 思路的坑——已在 CLAUDE.md 提醒)
- ❌ 生态小于 Next.js,某些第三方集成(如复杂表单、状态管理)较少
- ❌ 全站若未来转向 SSR/ISR 需手动配 adapter,迁移成本中等

**未来变更成本**:
- 🔄 改换框架代价大(整站重写),除非有强需求(如全站 SSR)否则不动
- 🔄 在 Astro 内部加 Vue 组件成本低,`astro add vue` 即可

## 验证依据

阶段 1 完成(2026-04-28):
- `https://liyuan4ly.com` 上线、push 自动部署、HTTPS 自动签发
- 阶段 2 进一步完成 5 页(welcome / 关于我 / 项目 / 博客列表 / 博客详情),
  框架选型未成为任何阶段的瓶颈
