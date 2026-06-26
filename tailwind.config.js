/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Signature accent: a warm teal-leaning "signal" color used sparingly
        // for unread badges, active states, and the send button.
        accent: {
          50: "#effcf6",
          100: "#c9f7e5",
          200: "#94efcc",
          300: "#5fe0b3",
          400: "#34cb9c",
          500: "#16a888", // primary accent
          600: "#0e8770",
          700: "#0c6c5c",
          800: "#0c564a",
          900: "#0c473e",
        },
        surface: {
          light: "#ffffff",
          subtle: "#f5f6f8",
          dark: "#0f1419",
          darkSubtle: "#171c22",
          darkPanel: "#1c2228",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        bubble: "0 1px 2px rgba(0,0,0,0.06)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.15s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
