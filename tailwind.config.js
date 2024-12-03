/** @type {import('tailwindcss').Config} */
import { theme } from './src/lib/theme';
import { withUt } from "uploadthing/tw";

/** @type {import('tailwindcss').Config} */
module.exports = withUt({

    darkMode: 'class',
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    ...theme.light.primary,
                    DEFAULT: theme.light.primary.main
                },
                secondary: {
                    ...theme.light.secondary,
                    DEFAULT: theme.light.secondary.main
                },
                background: {
                    main: theme.dark.background.main,
                    secondary: theme.dark.background.secondary,
                    tertiary: theme.dark.background.tertiary,
                },
                text: {
                    primary: theme.light.text.primary,
                    secondary: theme.light.text.secondary,
                    inverse: theme.light.text.inverse,
                },
                border: {
                    light: theme.light.border.light,
                    main: theme.light.border.main,
                }
            },
            container: {
                center: true,
                padding: "2rem",
                screens: {
                    "2xl": "1400px",
                },
            },
        }
    },
    plugins: [require("tailwindcss-animate")],
})
