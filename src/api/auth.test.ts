import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { logout } from '../../src/api/auth';
import * as client from '../../src/api/client';

describe('logout', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.spyOn(client, 'apiFetch').mockResolvedValue(null);
	});

	afterEach(() => vi.restoreAllMocks());

	it('does not call apiFetch when no token is present', async () => {
		await logout();
		expect(client.apiFetch).not.toHaveBeenCalled();
	});

	it('calls /auth/logout with POST when token exists', async () => {
		localStorage.setItem('token', 'valid-token');
		await logout();
		expect(client.apiFetch).toHaveBeenCalledWith(
			'/auth/logout',
			expect.objectContaining({ method: 'POST' }),
		);
    });

    it('sends Authorization bearer header with stored token', async () => {
	localStorage.setItem('token', 'my-secret-token');
	await logout();
	const options = vi.mocked(client.apiFetch).mock.calls[0][1] as RequestInit;
	expect(options?.headers && typeof options.headers === 'object' && 'Authorization' in options.headers ? (options.headers as Record<string, string>)['Authorization'] : undefined).toBe('Bearer my-secret-token');
});
});
