import { useEffect, useState } from 'react';
import { getUsers } from '../api/users';

export function useUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUsers() {
			try {
				const data = await getUsers();
				setUsers(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : String(err));
			} finally {
				setLoading(false);
			}
		}

		fetchUsers();
	}, []);

	return {
		users,
		loading,
		error,
	};
}
