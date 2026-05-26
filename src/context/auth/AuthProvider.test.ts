import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthProvider';
import { useAuth } from '../auth/useAuth';
import * as client from '../../api/client';
import { describe, beforeEach, it, expect, vi } from 'vitest';

// Helper consumer component so tests can read context values
function TestConsumer(): React.ReactElement {
	const { user, token, isInitializing } = useAuth();
	return React.createElement(
		'div',
		null,
		React.createElement(
			'span',
			{ 'data-testid': 'user' },
			user?.name ?? 'none',
		),
		React.createElement('span', { 'data-testid': 'token' }, token ?? 'none'),
		React.createElement(
			'span',
			{ 'data-testid': 'init' },
			isInitializing ? 'initializing' : 'ready',
		),
	);
}

describe('AuthProvider', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	it('initializes with no user or token', () => {
		render(
			React.createElement(
				AuthProvider,
				null,
				React.createElement(TestConsumer),
			),
		);
		expect(screen.getByTestId('user').textContent).toBe('none');
		expect(screen.getByTestId('token').textContent).toBe('none');
		expect(screen.getByTestId('init').textContent).toBe('ready');
	});

	it('restores user from localStorage and validates token', async () => {
		localStorage.setItem('token', 'stored-token');
		localStorage.setItem(
			'user',
			JSON.stringify({
				name: 'Alice',
				customerId: '1',
				accountType: 'standard',
			}),
		);
		vi.spyOn(client, 'apiFetch').mockResolvedValue({ name: 'Alice' }); // profile check passes

		render(
			React.createElement(
				AuthProvider,
				null,
				React.createElement(TestConsumer),
			),
		);

		await waitFor(() => {
			expect(screen.getByTestId('user').textContent).toBe('Alice');
			expect(screen.getByTestId('init').textContent).toBe('ready');
		});
	});

	it('clears user and token when profile validation fails', async () => {
		localStorage.setItem('token', 'expired-token');
		localStorage.setItem(
			'user',
			JSON.stringify({ name: 'Alice', customerId: '1' }),
		);
		vi.spyOn(client, 'apiFetch').mockRejectedValue(new Error('401'));

		render(
			React.createElement(
				AuthProvider,
				null,
				React.createElement(TestConsumer),
			),
		);

		await waitFor(() => {
			expect(screen.getByTestId('user').textContent).toBe('none');
			expect(screen.getByTestId('token').textContent).toBe('none');
			expect(screen.getByTestId('init').textContent).toBe('ready');
		});

		expect(localStorage.getItem('token')).toBeNull();
	});

	it('login stores token and user and updates context', async () => {
		const fakeResponse = {
			token: 'new-token',
			user: { name: 'Bob', customerId: '2', accountType: 'premium' },
		};
		vi.spyOn(client, 'apiFetch').mockResolvedValue(fakeResponse);

		const loginFnRef: { current?: (username: string) => Promise<void> } = {};
		const Capture = () => {
			const { login, user } = useAuth();
			React.useEffect(() => {
				loginFnRef.current = login;
			}, [login]);
			return React.createElement(
				'span',
				{ 'data-testid': 'user' },
				user?.name ?? 'none',
			);
		};

		render(
			React.createElement(AuthProvider, null, React.createElement(Capture)),
		);

		await act(async () => {
			await loginFnRef.current!('bob');
		});

		expect(screen.getByTestId('user').textContent).toBe('Bob');
		expect(localStorage.getItem('token')).toBe('new-token');
	});

	it('logout clears localStorage and resets user to null', async () => {
		localStorage.setItem('token', 'active-token');
		localStorage.setItem(
			'user',
			JSON.stringify({ name: 'Alice', customerId: '1' }),
		);
		vi.spyOn(client, 'apiFetch').mockResolvedValue(null); // profile + logout

		const logoutFnRef: { current?: () => Promise<void> } = {};
		const Capture = () => {
			const { logout, user } = useAuth();
			React.useEffect(() => {
				logoutFnRef.current = logout;
			}, [logout]);
			return React.createElement(
				'span',
				{ 'data-testid': 'user' },
				user?.name ?? 'none',
			);
		};

		render(
			React.createElement(AuthProvider, null, React.createElement(Capture)),
		);
		await act(async () => {
			await logoutFnRef.current!();
		});

		expect(screen.getByTestId('user').textContent).toBe('none');
		expect(localStorage.getItem('token')).toBeNull();
		expect(localStorage.getItem('user')).toBeNull();
	});

	it('isInitializing is false immediately when no token is stored', () => {
		render(
			React.createElement(
				AuthProvider,
				null,
				React.createElement(TestConsumer),
			),
		);
		expect(screen.getByTestId('init').textContent).toBe('ready');
	});
});
