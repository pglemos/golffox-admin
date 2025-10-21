// Global theme configuration
export const brand = {
  primary: '#5B2EFF',
  secondary: '#00E0FF',
  accent: '#FFD700',
  dark: '#0A0A0A',
  light: '#F5F5F7',
  neutral: '#D1D5DB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',
};

const theme = {
  brand,
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    primary: brand.primary,
    secondary: brand.secondary,
    success: brand.success,
    danger: brand.danger,
    warning: brand.warning,
    info: brand.info,
    light: brand.light,
    dark: brand.dark,
  }
};

export default theme;