
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// PistaSecure custom colors
				pistachio: {
					DEFAULT: '#93c47d',
					dark: '#82b36d',
					light: '#a3d48d',
					50: '#f3f9f0',
					100: '#e7f3e1',
					200: '#d0e7c4',
					300: '#b9dba6',
					400: '#a3d48d',
					500: '#93c47d',
					600: '#82b36d',
					700: '#6c9859',
					800: '#557d47',
					900: '#3e6234',
					950: '#27401f',
				},
				danger: {
					DEFAULT: '#e74c3c',
					50: '#fdf3f2',
					100: '#fbe7e5',
					200: '#f7d3cf',
					300: '#f2b5af',
					400: '#ec9187',
					500: '#e74c3c',
					600: '#d22e1d',
					700: '#af2719',
					800: '#94221a',
					900: '#7b201b',
					950: '#420c08',
				},
				warning: {
					DEFAULT: '#f39c12',
					50: '#fefaeb',
					100: '#fdf3d7',
					200: '#fbe7af',
					300: '#f9d57d',
					400: '#f6c04d',
					500: '#f39c12',
					600: '#d98209',
					700: '#b4690a',
					800: '#92540f',
					900: '#794511',
					950: '#432407',
				},
				success: {
					DEFAULT: '#2ecc71',
					50: '#f0fcf5',
					100: '#d8f8e7',
					200: '#b4f0d1',
					300: '#80e5b2',
					400: '#4ed489',
					500: '#2ecc71',
					600: '#1ea05b',
					700: '#1d844d',
					800: '#1d6840',
					900: '#1a5536',
					950: '#0b301e',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 10px rgba(147, 196, 125, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(147, 196, 125, 0.8)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
