/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7367F0',
        'primary-light': '#9E95F5',
        'primary-dark': '#5E50EE',
        secondary: '#82868B',
        success: '#28C76F',
        warning: '#FF9F43',
        danger: '#EA5455',
        info: '#00CFE8',
        dark: '#4B4B4B',
        'bg-main': '#F8F7FA',
        'card-bg': '#FFFFFF',
        'sidebar-bg': '#FFFFFF',
        'text-main': '#6E6B7B',
        'text-dark': '#5E5873',
        'border-color': '#EBE9F1',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(34,41,47,.1)',
        sidebar: '0 0 15px 0 rgba(34,41,47,.05)',
      },
    },
  },
  plugins: [],
}
