/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'hud-black': '#050505',
                'hud-dark': '#0a0f0d',
                'neon-green': '#39ff14',
                'neon-blue': '#00f3ff',
                'electric-purple': '#bc13fe',
                'alert-red': '#ff2a2a',
            },
            fontFamily: {
                'orbitron': ['"Orbitron"', 'sans-serif'],
                'rajdhani': ['"Rajdhani"', 'sans-serif'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #39ff141a 1px, transparent 1px), linear-gradient(to bottom, #39ff141a 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}
