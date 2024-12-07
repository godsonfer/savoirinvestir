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
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                pulse: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                },
                glow: {
                    '0%, 100%': {
                        boxShadow: '0 0 0 0 rgba(var(--primary-rgb), 0)'
                    },
                    '50%': {
                        boxShadow: '0 0 20px 0px rgba(var(--primary-rgb), 0.3)'
                    }
                }
            },
            animation: {
                shimmer: 'shimmer 2s linear infinite',
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                glow: 'glow 2s ease-in-out infinite'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
})
