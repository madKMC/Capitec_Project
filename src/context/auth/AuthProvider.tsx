import { useState } from 'react';
import { apiFetch } from '../../api/client';
import { AuthContext } from './auth.context';
import type { User, AuthContextType } from './auth.types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [token, setToken] = useState<string | null>(() =>
		localStorage.getItem('token'),
	);

	const login: AuthContextType['login'] = async (username) => {
		const response = await apiFetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username }),
		});

		localStorage.setItem('token', response.token);
		localStorage.setItem('user', JSON.stringify(response.user));

		setToken(response.token);
		setUser(response.user);
	};

	const logout: AuthContextType['logout'] = async () => {
		const storedToken = localStorage.getItem('token');

		try {
			if (storedToken) {
				await apiFetch('/auth/logout', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${storedToken}`,
					},
				});
			}
		} catch {
			// fail-safe logout to be added here if needed, but for now we ignore any errors during logout
		}

		localStorage.removeItem('token');
		localStorage.removeItem('user');

		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
