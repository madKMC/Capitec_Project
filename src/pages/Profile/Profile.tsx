import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import './Profile.css';
import { useAuth } from '../../context/auth/useAuth';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

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
	const navigate = useNavigate();
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
		return (
			<div className='profile-state' role='status' aria-live='polite'>
				Loading profile...
			</div>
		);
	}

	if (error) {
		return (
			<div className='profile-state error' role='alert'>
				Error: {error}
			</div>
		);
	}

	if (!data) {
		return (
			<div className='profile-state' role='status' aria-live='polite'>
				No profile data available.
			</div>
		);
	}

	return (
		<div className='profile-page'>
			<button className='back-btn' onClick={() => navigate('/')}>
				<FaArrowLeft aria-hidden='true' />
				Back
			</button>
			<section className='profile-card' aria-labelledby='profile-heading'>
				<div className='profile-header'>
					<div className='profile-avatar'>
						<FaUserCircle aria-hidden='true' />
					</div>

					<div>
						<h1 id='profile-heading'>{data.name}</h1>

						<p className='profile-subtitle'>{data.accountType} account</p>
					</div>
				</div>

				<dl className='profile-grid'>
					<div className='profile-item'>
						<dt>Email</dt>
						<dd>{data.email}</dd>
					</div>

					<div className='profile-item'>
						<dt>Join Date</dt>
						<dd>{new Date(data.joinDate).toLocaleDateString('en-ZA')}</dd>
					</div>

					<div className='profile-item'>
						<dt>Total Spent</dt>
						<dd>
							{data.currency}{' '}
							{data.totalSpent.toLocaleString('en-ZA', {
								minimumFractionDigits: 2,
							})}
						</dd>
					</div>

					<div className='profile-item'>
						<dt>Customer ID</dt>
						<dd>{data.customerId}</dd>
					</div>
				</dl>
			</section>
		</div>
	);
};

export default Profile;
