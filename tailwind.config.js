/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // Path ke semua file komponen React Anda
	],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/typography"), // AKTIFKAN PLUGIN TYPOGRAPHY DI SINI
	],
};
