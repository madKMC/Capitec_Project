import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { it, beforeEach, afterEach, expect, vi } from 'vitest';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';
import * as client from '../../api/client';

function TestConsumer(): React.ReactElement {
	const { user, isInitializing } = useAuth();
	return React.createElement(
		'div',
		null,
		React.createElement(
			'span',
			{ 'data-testid': 'user' },
			user?.name ?? 'none',
		),
		React.createElement(
			'span',
			{ 'data-testid': 'init' },
			isInitializing ? 'true' : 'false',
		),
	);
}

beforeEach(() => {
	localStorage.clear();
	vi.spyOn(client, 'apiFetch').mockResolvedValue({});
});
afterEach(() => vi.restoreAllMocks());

it('returns context value when inside AuthProvider', () => {
	render(
		React.createElement(AuthProvider, null, React.createElement(TestConsumer)),
	);
	expect(screen.getByTestId('user').textContent).toBe('none');
	expect(screen.getByTestId('init').textContent).toBe('false');
});

it('throws when used outside AuthProvider', () => {
	// Suppress the expected error from React's error boundary output
	const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

	expect(() => renderHook(() => useAuth())).toThrow();

	spy.mockRestore();
});
