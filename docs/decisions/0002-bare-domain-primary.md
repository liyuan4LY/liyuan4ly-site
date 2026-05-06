# ADR 0002: 主域风格用裸域 `liyuan4ly.com`,`www` 永久 301 跳裸域

- **状态**: Accepted
- **日期**: 2026-04-28
- **决策者**: LIYUAN

## Context

绑定自定义域名时面临的选择:**主域名要用 `liyuan4ly.com` 还是 `www.liyuan4ly.com`?**

历史背景:
- 早期互联网约定 `www.` 是 web 服务的子域名,与 `mail.` `ftp.` 等并列
- 现代趋势:很多大站改用裸域作主(github.com、x.com、astro.build),`www.` 仅 301 跳转
- DNS 层面,裸域 / `www` 子域可以分别配置,需要决定哪边是源、哪边是镜像

**两个候选**:

| 主域风格 | 优点 | 缺点 |
|---|---|---|
| **裸域作主** + `www` 301 跳裸域 | 字符短、现代审美、所有现代 CDN 支持(包括 CF CNAME flattening) | 早期需要"apex 域名 ANAME/ALIAS" 才能搭 CDN,现已不是问题 |
| **`www` 作主** + 裸域 301 跳 `www` | 传统约定 | 字符更长、印名片/口语都要带 `www.`,现代审美不优 |

**Cloudflare 的支持情况**(关键背景):
- Cloudflare 支持 **CNAME flattening**:在裸域上能用类 CNAME 行为指向 Cloudflare 边缘
- Cloudflare Pages 同时支持把 `liyuan4ly.com` 和 `www.liyuan4ly.com` 都加为 Custom Domain
- 301 重定向规则可在 Cloudflare 控制台直接配,无需 Worker

## Decision

- **主域**: `https://liyuan4ly.com`
- **`www` 重定向**: `https://www.liyuan4ly.com/*` 永久 301 → `https://liyuan4ly.com/$1`
- **配置位置**: Cloudflare Dashboard → Rules → Redirect Rules
- **HTTPS**: 双域名都由 Cloudflare 自动签发 / 续签

## Consequences

**正面**:
- ✅ 主域字符短,印象简洁,符合现代审美
- ✅ `www.liyuan4ly.com` 输入也能正确跳到主域,不丢用户
- ✅ 301 永久重定向对 SEO 友好,搜索引擎权重最终归集到裸域
- ✅ Cloudflare CNAME flattening 让裸域享有完整 CDN 能力(全球边缘加速 / DDoS 防护 / SSL)

**负面 / 限制**:
- ❌ 极少数老旧客户端(古早版本邮件预览器)对裸域 HTTPS 处理可能有 quirk(实际无影响)
- ❌ 如果未来想给 `www.` 单独提供不同内容(如登录页),需要拆这条规则

**未来变更成本**:
- 🔄 改主域风格成本中等:需重定向方向反转 + 通知所有外链 / 简历更新地址
- 🔄 当前选择已是行业主流,长期来看变更概率极低

## 验证依据

阶段 1.6 完成(2026-04-28),实测:
- `https://liyuan4ly.com` 直接打开
- `https://www.liyuan4ly.com` → 301 → `https://liyuan4ly.com`
- `http://liyuan4ly.com` → 301 → HTTPS 版本(Cloudflare 默认 Always Use HTTPS)
- 两个域名 HTTPS 证书均自动签发,锁图标正常
