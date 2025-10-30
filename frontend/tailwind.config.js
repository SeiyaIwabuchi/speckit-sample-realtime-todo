/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tag-red': '#EF4444',
        'tag-orange': '#F97316',
        'tag-yellow': '#EAB308',
        'tag-green': '#22C55E',
        'tag-teal': '#14B8A6',
        'tag-blue': '#3B82F6',
        'tag-indigo': '#6366F1',
        'tag-purple': '#A855F7',
        'tag-pink': '#EC4899',
        'tag-gray': '#6B7280'
      }
    },
  },
  plugins: [],
}
