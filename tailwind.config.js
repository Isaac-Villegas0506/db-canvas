/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                canvas: {
                    bg: '#f8f9fa',
                    grid: '#e9ecef',
                }
            }
        },
    },
    plugins: [],
}
