import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const getInitialTheme = (): Theme => {
		const stored = localStorage.getItem('theme') as Theme | null;

		if (stored) return stored;

		return window.matchMedia?.('(prefers-color-scheme: light)').matches
			? 'light'
			: 'dark';
	};

	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		localStorage.setItem('theme', theme);

		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error(
			'useTheme must be used within ThemeProvider'
		);
	}

	return context;
};