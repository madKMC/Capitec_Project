import { useUsers } from '../hooks/useUsers.ts';

export default function UsersPage() {
	const { users, loading, error } = useUsers();

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			<h1>Users</h1>

			{users?.map((user: { id: string; name: string }) => (
				<div key={user.id}>{user.name}</div>
			))}
		</div>
	);
}
