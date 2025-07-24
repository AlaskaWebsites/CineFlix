// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    prefix: '',
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                cineflix: {
                    black: '#000000',
                    red: '#E60000',
                    'dark-gray': '#333333',
                    white: '#FFFFFF',
                    'blue-600': '#2563eb',
                    'blue-700': '#1d4ed8',
                    'green-400': '#4ade80',
                    'green-600': '#16a34a',
                    'green-700': '#15803d',
                    'danger-600': '#dc2626',
                    'danger-700': '#b91c1c',
                    'gray-400': '#9ca3af',
                    'gray-500': '#6b7280',
                },
            },
            fontFamily: {
                'times-new-roman': ['Times New Roman', 'serif'],
            },
        },
    },
    plugins: [],
};