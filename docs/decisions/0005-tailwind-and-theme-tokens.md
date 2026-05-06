# ADR 0005: 引入 Tailwind v4,主题用单图 + 主题色蒙层 + CSS 变量

- **状态**: Accepted
- **日期**: 2026-04-29
- **决策者**: LIYUAN

## Context

确定双主题方向后(见 ADR 0003),需要选定 CSS 方案和主题切换的具体实现。

**CSS 方案选择**:

| 选项 | 优点 | 缺点 |
|---|---|---|
| 裸 CSS / SCSS | 完全可控、零依赖 | 用户自由发挥,设计令牌(颜色/间距)易失控 |
| Tailwind v3 | 生态成熟、设计令牌强制一致 | v4 已发布,新项目没必要从老版本起步 |
| **Tailwind v4** | 最新版,`@theme` block 原生支持 CSS 变量、构建更快 | 生态文档相对较新 |

用户已有 CSS 基础,希望"把 Tailwind 当作一套规范来学",而不是"绕开 CSS"。

**主题切换的视觉实现**:

| 选项 | 优点 | 缺点 |
|---|---|---|
| 多张主题背景图切换 | 直观、视觉冲击强 | 加载多份图,首屏成本高、切换有延迟 |
| CSS filter(hue-rotate / brightness) | 一张图,纯 CSS | 滤镜效果不可控,主题色无法精确指定 |
| **单图 + 主题色半透明蒙层 + CSS 变量** | 一张图,主题色完全可控,CSS transition 平滑 | 蒙层透明度需调试以保证图片可读 |

## Decision

**CSS 方案**: 引入 Tailwind v4(`@tailwindcss/vite` plugin)。

**主题实现**:

1. **单图打底**: `public/bg/entrance.webp`,所有主题共用
2. **主题色 token** 定义在 `src/styles/global.css`:
   ```css
   @theme { /* 全局 token,Tailwind v4 语法 */ }
   :root { /* 默认 sunset 主题 CSS 变量 */ }
   [data-theme="moonlight"] { /* 月夜主题覆盖 */ }
   ```
3. **蒙层**: 入场页背景图 + 半透明色块(夕阳橙 / 月夜蓝)叠加,毛玻璃滤镜保证文字可读
4. **运行时切换**: `lib/theme.ts` 改 `<html data-theme>` 属性,
   CSS 变量级联生效,所有用了变量的元素自动重绘
5. **GPU 合成动画**: CSS transition 颜色过渡 60fps 丝滑

## Consequences

**正面**:
- ✅ 单图加载,首屏成本低
- ✅ Tailwind 强制使用 token,设计语言一致
- ✅ 主题切换走 CSS transition,GPU 合成,不卡顿
- ✅ 新增主题只需追加 `[data-theme="..."]` 一段,扩展性好

**负面 / 限制**:
- ❌ Tailwind v4 文档相对新,部分 API 还在演化(影响小,本项目用的都是稳定特性)
- ❌ 蒙层透明度调试花了时间(夕阳橙太浓掩盖底图,太淡又不像主题)
- ❌ 必须坚持"颜色从变量读"——硬编码 `bg-zinc-900` 会破坏切换
  (已在 CLAUDE.md 列为禁止项)

**未来变更成本**:
- 🔄 加新主题:CSS 一段 + welcome 按钮 + ThemeToggle 选项
- 🔄 替换底图:换 `public/bg/entrance.webp`,所有主题自动适配
- 🔄 调蒙层强度:改 CSS 变量值,无代码改动

## 验证依据

阶段 2.4 完成(2026-04-29):
- 全站 Tailwind 重构 + 主题切换实测 60fps 丝滑
- 入场图(AI 生成 + Squoosh 转 WebP)193 KB,首屏可接受
- 浅深双主题在文字可读性、按钮对比度上都达标
