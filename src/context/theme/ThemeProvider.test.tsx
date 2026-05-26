import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, it, expect, vi } from 'vitest';
import { useTheme } from './useTheme';
import { ThemeProvider } from './ThemeProvider';

function TestConsumer(): React.ReactElement {
	const { theme, toggleTheme } = useTheme();
	return (
		<div>
			<span data-testid='theme'>{theme}</span>
			<button onClick={toggleTheme}>Toggle</button>
		</div>
	);
}

beforeEach(() => localStorage.clear());

it('defaults to dark theme when no preference is stored', () => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockReturnValue({ matches: false }),
	});
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	expect(screen.getByTestId('theme').textContent).toBe('dark');
});

it('uses stored theme from localStorage', () => {
	localStorage.setItem('theme', 'light');
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	expect(screen.getByTestId('theme').textContent).toBe('light');
});

it('uses OS light preference when nothing is stored', () => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockReturnValue({ matches: true }),
	});
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	expect(screen.getByTestId('theme').textContent).toBe('light');
});

it('toggleTheme switches from light to dark', () => {
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
	expect(screen.getByTestId('theme').textContent).toBe('dark');
});

it('toggleTheme switches from light to dark', () => {
	localStorage.setItem('theme', 'light');
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
	expect(screen.getByTestId('theme').textContent).toBe('dark');
});

it('sets data-theme attribute on document root', () => {
	localStorage.setItem('theme', 'light');
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

it('persists toggled theme to localStorage', () => {
	render(
		<ThemeProvider>
			<TestConsumer />
		</ThemeProvider>,
	);
	fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
	expect(localStorage.getItem('theme')).toBe('dark');
});
