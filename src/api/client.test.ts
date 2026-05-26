import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { apiFetch } from './client';


// Verifies that the apiFetch function correctly includes the Authorization header with the token from localStorage when making API requests.
describe('apiFetch', () => {
	beforeEach(() => {
		localStorage.setItem('token', 'test-token-abc');
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ data: 'ok' }),
		}));
	});

	afterEach(() => {
		localStorage.clear();
		vi.resetAllMocks();
	});

	it('sends Authorization header with stored token', async () => {
		await apiFetch('/some/endpoint');
		const calledWith = (vi.mocked(fetch)).mock.calls[0]?.[1] as RequestInit;
		expect((calledWith?.headers as Record<string, string>)?.['Authorization']).toBe('Bearer test-token-abc');
	});
});

// Verifies that the apiFetch function throws an error with the correct status code when the response is not ok (e.g., 404 Not Found).
it('throws when response.ok is false', async () => {
	(vi.mocked(fetch)).mockResolvedValue({
		ok: false,
		status: 404,
		json: async () => ({}),
	} as Response);
	await expect(apiFetch('/missing')).rejects.toThrow('API Error: 404');
});

