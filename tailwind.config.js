const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core Tailwind-compatible colors
        primary: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#B45309",
          muted: "#FEF3C7",
          foreground: "#1F2937",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        secondary: {
          DEFAULT: "#3B82F6",
          muted: "#DBEAFE",
          foreground: "#ffffff",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        success: {
          DEFAULT: "#10B981",
          muted: "#D1FAE5",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        warning: {
          DEFAULT: "#FBBF24",
          muted: "#FEF9C3",
          50: "#FFFBEB",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#FBBF24",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        danger: {
          DEFAULT: "#EF4444",
          muted: "#FEE2E2",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        info: {
          DEFAULT: "#3B82F6",
          muted: "#DBEAFE",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        
        // Shadcn standard colors
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FEF3C7",
          foreground: "#1F2937",
        },
        muted: {
          DEFAULT: "#9CA3AF",
          foreground: "#9CA3AF",
        },
        background: "#FFFAEB",
        foreground: "#1F2937",
        input: "#F3F4F6",
        ring: "#F59E0B",
        border: "#E5E7EB",
        
        // Custom background colors
        "bg-page": "#FFFAEB",
        "bg-surface": "#FFFFFF",
        
        // Custom text colors
        "text-primary": "#1F2937",
        "text-secondary": "#4B5563",
        "text-muted": "#9CA3AF",
        
        // Shadcn compatibility
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
        
        // Sidebar colors (from shadcn)
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Poppins", "Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", "Fira Code", ...defaultTheme.fontFamily.mono]
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        base: ["1rem", { lineHeight: "1.6", letterSpacing: "0.015em" }],
        lg: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0.015em" }],
        xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.4", letterSpacing: "0.005em" }],
        "3xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.035em" }]
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800"
      },
      borderRadius: {
        button: "0.5rem",
        card: "0.75rem",
        modal: "1.5rem"
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.03)",
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)"
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
};