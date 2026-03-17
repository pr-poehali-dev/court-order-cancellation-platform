import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        syne:  ["Syne", "sans-serif"],
        onest: ["Onest", "sans-serif"],
      },
      borderRadius: {
        sm:   "calc(var(--radius) - 8px)",
        md:   "calc(var(--radius) - 4px)",
        lg:   "var(--radius)",
        xl:   "calc(var(--radius) + 4px)",
        "2xl":"calc(var(--radius) + 8px)",
        full: "9999px",
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        blue: {
          DEFAULT: "hsl(var(--blue))",
          light:   "hsl(var(--blue-light))",
          dark:    "hsl(var(--blue-dark))",
          50:      "hsl(var(--blue-50))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light:   "hsl(var(--gold-light))",
          50:      "hsl(var(--gold-50))",
        },
        grey: {
          50:  "hsl(var(--grey-50))",
          100: "hsl(var(--grey-100))",
          200: "hsl(var(--grey-200))",
          500: "hsl(var(--grey-500))",
          800: "hsl(var(--grey-800))",
          900: "hsl(var(--grey-900))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.4s ease forwards",
      },
      boxShadow: {
        card:      "0 2px 16px rgba(30,60,120,0.07)",
        "card-hover": "0 8px 32px rgba(30,60,120,0.13)",
        blue:      "0 4px 20px rgba(30,90,210,0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;