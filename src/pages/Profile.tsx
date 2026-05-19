import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import './CSS/Profile.css';
import { useAuth } from '../context/auth/useAuth';

type UserProfile = {
	customerId: string;
	name: string;
	email: string;
	joinDate: string;
	accountType: string;
	totalSpent: number;
	currency: string;
};

const Profile = () => {
	const { user } = useAuth();
	const customerId = user?.customerId ?? '12345';

	const [data, setData] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		let mounted = true;

		async function loadProfile() {
			try {
				const response = await apiFetch(`/api/customers/${customerId}/profile`);

				if (!mounted) return;

				setData(response);
			} catch (err: unknown) {
				if (!mounted) return;

				const message = err instanceof Error ? err.message : 'Unexpected error';

				setError(message);
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		loadProfile();

		return () => {
			mounted = false;
		};
	}, [user, customerId]);

	if (loading) {
		return <div>Loading profile...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!data) {
		return <div>No profile data available.</div>;
	}

	return (
		<div className='profile-container'>
			<h2>Profile Overview</h2>

			<div className='profile-card'>
				<div className='profile-row'>
					<span>Name</span>
					<strong>{data.name}</strong>
				</div>

				<div className='profile-row'>
					<span>Email</span>
					<strong>{data.email}</strong>
				</div>

				<div className='profile-row'>
					<span>Account Type</span>
					<strong>{data.accountType}</strong>
				</div>

				<div className='profile-row'>
					<span>Join Date</span>
					<strong>{data.joinDate}</strong>
				</div>

				<div className='profile-row'>
					<span>Total Spent</span>
					<strong>
						{data.currency} {data.totalSpent.toFixed(2)}
					</strong>
				</div>

				<div className='profile-row'>
					<span>Customer ID</span>
					<strong>{data.customerId}</strong>
				</div>
			</div>
		</div>
	);
};

export default Profile;
