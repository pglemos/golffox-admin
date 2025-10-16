export const typography = {
  display: 'clamp(2.75rem, 2vw + 2.25rem, 4.25rem)',
  headline: 'clamp(2rem, 1.5vw + 1.75rem, 3rem)',
  title: 'clamp(1.5rem, 1vw + 1.35rem, 2.25rem)',
  body: '1rem',
  small: '0.875rem',
  micro: '0.75rem',
} as const;

export const fonts = {
  sans: '"Inter", "SF Pro Display", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};
