/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',      /* Blue-500: Professional & Secure */
                secondary: '#64748b',    /* Slate-500: Neutral */
                accent: '#06b6d4',       /* Cyan-500: Tech/Data Flow */
                success: '#10b981',      /* Emerald-500: Signal Success */
                'dark-bg': '#020617',      /* Slate-950: Intense Dark */
                'dark-surface': '#0f172a', /* Slate-900: Card Surfaces */
                'text-primary': '#f8fafc', /* Slate-50: Crisp White Text */
                'text-secondary': '#94a3b8', /* Slate-400: Muted Text */
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
