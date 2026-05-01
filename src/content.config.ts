// ============================================================
// content.config.ts —— 内容集合配置
// ============================================================
// 作用：声明本站所有"内容集合"（content collection），
//       并用 zod 定义每个集合里 .md 文件 frontmatter 的字段约束。
//       Astro 构建时会按这个 schema 校验每篇文章，
//       字段缺失/类型错误会在 `npm run build` 时直接报错（防止上线后才发现）。
// 文件位置：必须放在 src/content.config.ts，Astro 会自动发现。
// ============================================================

// 1) 从 'astro:content' 引入两个工具：
//    - defineCollection：声明一个集合
//    - z（即 zod）：类型/schema 定义库，类比 Spring Boot 的 @Valid + @NotNull 等校验注解
import { defineCollection, z } from 'astro:content';

// 2) 引入 glob loader，用来"扫描指定目录下所有 .md 文件"
//    base 表示扫描根目录、pattern 是 glob 通配符
import { glob } from 'astro/loaders';

// 3) 定义 blog 集合
const blog = defineCollection({
  // loader：告诉 Astro 这个集合的内容从哪里来
  // 这里用 glob loader 扫描 src/content/blog/ 目录下所有 .md 文件
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),

  // schema：每篇文章 frontmatter 必须符合的字段定义
  // 类比 Java DTO：每个字段名 + 类型 + 是否必填
  schema: z.object({
    // title 必填字符串。如果某篇文章 frontmatter 没写 title，构建直接报错
    title: z.string(),

    // pubDate 必填日期。在 .md 里写 `pubDate: 2026-04-28`，
    // zod 会自动把字符串解析成 Date 对象
    pubDate: z.date(),

    // description 可选字符串（.optional() = 可不填）
    // 用于文章列表页的简介，以及 SEO 的 <meta description>
    description: z.string().optional(),

    // tags 可选字符串数组，默认空数组
    // .default([]) 意味着 .md 不写这个字段时自动当作 []
    tags: z.array(z.string()).default([]),

    // draft 可选布尔，默认 false
    // 用来标记"草稿"，列表页可以过滤掉，但文件本身仍在仓库
    draft: z.boolean().default(false),
  }),
});

// 4) 导出 collections 对象。键名（这里是 'blog'）就是后面代码里
//    调用 getCollection('blog') 时用的标识符
export const collections = { blog };
