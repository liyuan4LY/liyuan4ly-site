// ============================================================
// theme.ts —— 主题切换的运行时逻辑
// ============================================================
// 作用：
// 1. 提供主题类型定义（TypeScript 的好处之一：编译期防错）
// 2. 提供 applyTheme(theme) 函数：把主题写到 <html> 上
// 3. 提供 getStoredTheme() 函数：从 localStorage 读上次选的主题
// 4. 提供 storeTheme(theme) 函数：写主题到 localStorage
//
// 调用时机：
// - 用户在 /welcome 页面点选风格 → 调 storeTheme + applyTheme
// - 任意页面加载时 → 自动从 localStorage 读取并 applyTheme
// - 任意页面点击主题切换按钮 → 调 storeTheme + applyTheme
// ============================================================


/**
 * 三种主题状态：
 * - 'sunset'  夕阳模式（暖色主题）
 * - 'moonlit' 月夜模式（冷色主题）
 * - 'dual'    双模式（入场图原貌，无色调蒙层）
 *
 * TypeScript 的"联合类型（Union Type）"语法：
 *   type Theme = 'sunset' | 'moonlit' | 'dual'
 * 表示 Theme 这个类型只能是这三个字符串之一。
 * 类比 Java 的枚举（enum）。
 */
export type Theme = 'sunset' | 'moonlit' | 'dual';

/**
 * localStorage 里用的 key 名。
 * 用常量替代散落的字符串字面量：避免拼错、改一处即改全部。
 *
 * ⚠️ 注意：BaseLayout.astro 的内联防闪烁脚本里也用到了同样的字符串，
 * 那里因为 is:inline 不能 import，只能硬编码 'liyuan-theme'。
 * 如果将来要改这个 key 名，记得两个地方一起改。
 */
export const STORAGE_KEY = 'liyuan-theme';


/**
 * 把主题应用到 <html> 元素。
 * <html data-theme="sunset"> → CSS 里 [data-theme="sunset"] 选择器生效
 * → 所有用 var(--xxx) 的地方颜色一起变。
 */
export function applyTheme(theme: Theme): void {
  // document.documentElement 就是 <html> 元素
  document.documentElement.dataset.theme = theme;
  // ↑ 等价于 document.documentElement.setAttribute('data-theme', theme)
}


/**
 * 从 localStorage 读出之前选的主题。
 * 没存过返回 null（让调用方决定默认值）。
 */
export function getStoredTheme(): Theme | null {
  // typeof 检查避免 SSG 构建时（无 window）报错
  if (typeof localStorage === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  // 校验值合法（防止 localStorage 被手改成无效值）
  if (stored === 'sunset' || stored === 'moonlit' || stored === 'dual') {
    return stored;
  }
  return null;
}


/**
 * 把主题写到 localStorage（持久化，下次访问还在）。
 */
export function storeTheme(theme: Theme): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, theme);
}


/**
 * 复合操作：存 + 应用。组件里通常调这个。
 */
export function setTheme(theme: Theme): void {
  storeTheme(theme);
  applyTheme(theme);
}


/**
 * 在两种主题间循环切换：sunset → moonlit → sunset
 * （dual 通常只在入场页用，切换按钮里不参与循环）
 */
export function toggleTheme(): void {
  const current = getStoredTheme() ?? 'sunset';
  const next: Theme = current === 'sunset' ? 'moonlit' : 'sunset';
  setTheme(next);
}
