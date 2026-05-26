import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

function TestConsumer(): React.ReactElement {
	const { theme } = useTheme();
	return React.createElement('span', { 'data-testid': 'theme' }, theme);
}

it('returns theme value when inside ThemeProvider', () => {
	localStorage.setItem('theme', 'light');
	render(
		React.createElement(ThemeProvider, null, React.createElement(TestConsumer)),
	);
	expect(screen.getByTestId('theme').textContent).toBe('light');
});

it('throws when used outside ThemeProvider', () => {
	const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
	expect(() => renderHook(() => useTheme())).toThrow();
	spy.mockRestore();
});