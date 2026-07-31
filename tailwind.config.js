/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        'luper-primary': 'var(--luper-primary)',
        'luper-surface': 'var(--luper-surface)',
        'luper-success': 'var(--luper-success)',
        'luper-base': '#161618',
        'luper-card': '#1a1a1d',
        'luper-subtle': 'rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
};
