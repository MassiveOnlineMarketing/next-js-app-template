// const typographyPlugin = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs360: "360px",
      xs390: "390px",
      xs: "475px",
      sm: "640px",
      md: "768px",
      mlg: "850px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
      "container-width": "1428px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "primary-50": "#f8f8ff",
        "primary-100": "#DADCFF",
        "primary-200": "#B4B9FF",
        "primary-300": "#9C97FF",
        "primary-400": "#907EFE",
        "primary-500": "#7857FE",
        "primary-600": "#6947DB",
        "primary-700": "#422693",
        "primary-800": "#201755",
        "primary-900": "#170E31",

        "gray-1000": "#141520",
        "gray-1100": "#0B0C14",
        "gray-1200": "#04050C",
      },
      zIndex: {
        "-90": "-90",
      },
      borderRadius: {
        "4xl": "32px",
      },
      boxShadow: {
        base: "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
        md: "0px 2px 4px -1px rgba(21, 23, 77, 0.06), 0px 4px 6px -1px rgba(27, 35, 64, 0.10)",
        "custom-lg":
          "0px 18px 30px 0px rgba(0, 0, 0, 0.04), 0px 70px 60px 0px rgba(0, 0, 0, 0.03), 0px 158px 85px 0px rgba(0, 0, 0, 0.02), 0px 281px 100px 0px rgba(0, 0, 0, 0.01), 0px 439px 123px 0px rgba(0, 0, 0, 0.00)",
      },
      transitionDuration: {
        5000: "5000ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        modalOpacityIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalOpacityOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "modal-opacity-in": "modalOpacityIn 0.5s ease forwards",
        "modal-opacity-out": "modalOpacityOut 0.5s ease forwards",
      }
    },
  },
  variants: {},
};
