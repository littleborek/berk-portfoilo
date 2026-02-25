/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.html", "./src/js/**/*.js"],
    theme: {
        extend: {
            colors: {
                'accent': '#7c3aed', // Electric Violet (Indigo-Purple hybrid)
                'accent-light': '#a78bfa',
                'glass': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.15)',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif']
            }
        },
    },
    plugins: [],
}
