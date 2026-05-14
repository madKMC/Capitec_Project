const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
	const token = localStorage.getItem('token');
	const config: RequestInit = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: token ? `Bearer ${token}` : '',
			...(options.headers as Record<string, string>),
		},
		...options,
	};

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, config);

		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		// Handles empty responses
		if (response.status === 204) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('Fetch Error:', error);
		throw error;
	}
}
