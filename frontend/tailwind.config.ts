import type { Config } from 'tailwindcss'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const defaultTheme = require('tailwindcss/defaultTheme') // Import the default
const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                ...defaultTheme.colors, // Include default colors
                quinterny: {
                    50: '#eeefff',
                    100: '#e0e2ff',
                    200: '#c8c9fd',
                    300: '#a6a7fb',
                    400: '#8077f6',
                    500: '#7864f0',
                    600: '#6948e3',
                    700: '#5b3ac8',
                    800: '#4a31a2',
                    900: '#3f2f80',
                    950: '#261c4a',
                },
                gradient: {
                    100: '#44ADFF',
                    200: '#84C9FF',
                },
                secondary: {
                    50: '#f5f7f8',
                    100: '#e4efef',
                    200: '#bad4d5',
                    300: '#8fb7b9',
                    400: '#689599',
                    500: '#4d7a7f',
                    600: '#3c6065',
                    700: '#334d52',
                    800: '#2c3f43',
                    900: '#283639',
                    950: '#131d20',
                },
                tertiary: {
                    50: '#fffbeb',
                    100: '#fdf3c8',
                    200: '#fce58b',
                    300: '#fad24f',
                    400: '#f9bf29',
                    500: '#f39d0d',
                    600: '#d77708',
                    700: '#b2530b',
                    800: '#91400f',
                    900: '#773510',
                    950: '#441a04',
                },
                quatery: {
                    50: '#fffbeb',
                    100: '#fdf3c8',
                    200: '#fce58b',
                    300: '#fad24f',
                    400: '#f9bf29',
                    500: '#f39d0d',
                    600: '#d77708',
                    700: '#b2530b',
                    800: '#91400f',
                    900: '#773510',
                    950: '#441a04',
                },
                primary: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#000000',
                },
                txt: {
                    100: '#333333',
                    200: '#555555',
                },
                neutral: {
                    0: '#0A5EFE',
                    50: '#262626',
                    80: '#868686',
                    90: '#CECECE',
                    100: '#F5F5F7',
                    200: '#FFFFFF',
                },
                danger: '#FF6B6B',
                success: '#4CAF50',
                accent: '#FFA500',
                black: '#000',
            },

            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require('tailwindcss-animate')],
}
export default config
