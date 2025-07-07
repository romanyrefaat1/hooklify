// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          page: "#FFFAEB",
          surface: "#FFFFFF"
        },
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          muted: "#9CA3AF"
        },
        color: {
          primary: "#F59E0B",
          primaryLight: "#FBBF24",
          primaryDark: "#B45309",
          primaryMuted: "#FEF3C7",

          secondary: "#3B82F6",
          secondaryMuted: "#DBEAFE",

          success: "#10B981",
          successMuted: "#D1FAE5",
          warning: "#FBBF24",
          warningMuted: "#FEF9C3",
          info: "#3B82F6",
          infoMuted: "#DBEAFE",
          danger: "#EF4444",
          dangerMuted: "#FEE2E2"
        },
        border: {
          DEFAULT: "#E5E7EB"
        }
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif]
      },
      borderRadius: {
        button: "0.5rem",
        card: "0.75rem",
        modal: "1.5rem"
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)"
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem"
      },
      spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem"
      }
    }
  },
  plugins: []
}