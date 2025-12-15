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
                primary: '#6366f1',      /* Indigo */
                secondary: '#8b5cf6',    /* Violet */
                accent: '#ec4899',       /* Rose */
                success: '#10b981',      /* Vert */
                'dark-bg': '#0f172a',      /* Fond très foncé */
                'dark-surface': '#1e293b', /* Surfaces */
                'text-primary': '#f1f5f9', /* Texte blanc */
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
