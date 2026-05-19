import { apiFetch } from './client';

export async function logout() {
	const token = localStorage.getItem('token');

	if (!token) return;

	return apiFetch('/auth/logout', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}