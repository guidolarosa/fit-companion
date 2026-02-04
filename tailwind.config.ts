import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-barlow-condensed)", "sans-serif"],
        body: ["var(--font-barlow)", "sans-serif"],
      },
      fontSize: {
        // Mobile-first typography scale per guidelines
        'xs': ['0.625rem', { lineHeight: '1rem' }],    // 10px - Labels, metadata
        'sm': ['0.6875rem', { lineHeight: '1rem' }],   // 11px - Secondary info
        'base': ['0.875rem', { lineHeight: '1.25rem' }], // 14px - Body text
        'lg': ['1rem', { lineHeight: '1.5rem' }],      // 16px - Emphasized body
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px - Section headers
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px - Card titles
        '3xl': ['2rem', { lineHeight: '2.25rem' }],    // 32px - Dashboard metrics
        '4xl': ['2.5rem', { lineHeight: '2.5rem' }],   // 40px - Hero numbers
      },
      spacing: {
        // Spacing scale per guidelines
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Semantic colors for health app per guidelines
        deficit: {
          DEFAULT: "hsl(var(--color-deficit))",
          foreground: "#FFFFFF",
        },
        surplus: {
          DEFAULT: "hsl(var(--color-surplus))",
          foreground: "#FFFFFF",
        },
        maintenance: {
          DEFAULT: "hsl(var(--color-maintenance))",
          foreground: "#FFFFFF",
        },
        extreme: {
          DEFAULT: "hsl(var(--color-extreme))",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin": {
          to: { transform: "rotate(360deg)" },
        },
        "progress-fill": {
          from: { strokeDashoffset: "var(--circumference)" },
          to: { strokeDashoffset: "var(--target-offset)" },
        },
        "pulse-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 4px hsl(var(--color-deficit)))" },
          "50%": { filter: "drop-shadow(0 0 12px hsl(var(--color-deficit)))" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin": "spin 0.6s linear infinite",
        "progress-fill": "progress-fill 1s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
      transitionDuration: {
        // Animation timing per guidelines
        "micro": "150ms",
        "standard": "200ms",
        "emphasis": "300ms",
        "progress": "750ms",
      },
      transitionTimingFunction: {
        "ease-out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

