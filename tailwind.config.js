/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./script.js", "./chatbot.js"],
    theme: {
        extend: {
            colors: {
                'accent': '#1abc9c',
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
