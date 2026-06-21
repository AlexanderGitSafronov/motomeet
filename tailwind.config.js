/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables so dark/light themes swap automatically.
        primary: 'var(--mm-primary)',
        'primary-hover': 'var(--mm-primary-hover)',
        'primary-soft': 'var(--mm-primary-soft)',
        accent: 'var(--mm-accent)',
        'accent-soft': 'var(--mm-accent-soft)',
        bg: 'var(--mm-bg)',
        surface: 'var(--mm-surface)',
        'surface-2': 'var(--mm-surface-2)',
        'surface-3': 'var(--mm-surface-3)',
        border: 'var(--mm-border)',
        'glass-border': 'var(--mm-glass-border)',
        text: 'var(--mm-text)',
        'text-secondary': 'var(--mm-text-secondary)',
        'text-muted': 'var(--mm-text-muted)',
        success: 'var(--mm-success)',
        'success-soft': 'var(--mm-success-soft)',
        error: 'var(--mm-error)',
        'error-soft': 'var(--mm-error-soft)',
        warning: 'var(--mm-warning)',
        'on-primary': 'var(--mm-on-primary)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Oswald carries full Cyrillic, keeping the bold-condensed look for UA copy.
        display: ['Oswald', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '22px',
        xl: '28px',
        full: '999px',
      },
      boxShadow: {
        glow: '0 12px 40px -8px rgba(139, 92, 246, 0.45)',
        'glow-sm': '0 6px 20px -6px rgba(139, 92, 246, 0.4)',
        card: '0 8px 30px -12px rgba(0, 0, 0, 0.5)',
        sheet: '0 -8px 40px -8px rgba(0, 0, 0, 0.55)',
      },
      backdropBlur: { glass: '18px' },
      maxWidth: { app: '440px' },
      keyframes: {
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.25s ease-out',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
