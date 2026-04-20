import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                polman: {
                    primary: '#008B8B',
                    secondary: '#2F4F4F',
                    tertiary: '#7FFFD4',
                    neutral: '#F8FAFC',
                },
            },
            fontFamily: {
                headline: ['"Space Grotesk"', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                label: ['Manrope', 'sans-serif'],
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],

            },
        },
    },

    plugins: [forms],
};
