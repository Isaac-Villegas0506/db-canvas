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
                canvas: {
                    bg: 'var(--canvas-bg)',
                    grid: 'var(--canvas-grid)',
                }
            }
        },
    },
    plugins: [],
}
