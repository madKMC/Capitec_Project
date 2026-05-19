import React, { useEffect, useState } from 'react';
import type { Theme } from './theme.types';
import { ThemeContext } from './theme.context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const getInitialTheme = (): Theme => {
		const stored = localStorage.getItem('theme') as Theme | null;

		if (stored) return stored;

		return window.matchMedia?.('(prefers-color-scheme: light)').matches
			? 'light'
			: 'dark';
	};

	const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

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
