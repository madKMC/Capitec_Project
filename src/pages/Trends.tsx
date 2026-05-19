import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import './CSS/Trends.css';
import { useAuth } from '../context/auth/useAuth';

type Trend = {
	month: string;
	totalSpent: number;
	transactionCount: number;
	averageTransaction: number;
};

type SpendingTrendsResponse = {
	trends: Trend[];
};

const SpendingTrends = () => {
	const { user } = useAuth();

	const [data, setData] = useState<SpendingTrendsResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		const customerId = user?.customerId ?? '12345';

		let mounted = true;

		async function loadTrends() {
			try {
				const response = await apiFetch(
					`/api/customers/${customerId}/spending/trends`,
				);

				if (mounted) {
					setData(response);
				}
			} catch (err: unknown) {
				if (mounted) {
					const message =
						err instanceof Error ? err.message : 'Unexpected error';

					setError(message);
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		loadTrends();

		return () => {
			mounted = false;
		};
	}, [user]);

	if (loading) {
		return <div>Loading spending trends...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!data) {
		return <div>No trend data available.</div>;
	}

	return (
		<div className='trends-container'>
			<h2>Monthly Spending Trends</h2>

			<div className='trends-summary'>
				<p>Last 6 months performance overview</p>
			</div>

			<div className='trends-grid'>
				{data.trends.map((trend) => (
					<div key={trend.month} className='trend-card'>
						<h3>{trend.month}</h3>

						<div className='trend-row'>
							<span>Total Spent</span>
							<strong>R{trend.totalSpent.toFixed(2)}</strong>
						</div>

						<div className='trend-row'>
							<span>Transactions</span>
							<strong>{trend.transactionCount}</strong>
						</div>

						<div className='trend-row'>
							<span>Avg Transaction</span>
							<strong>R{trend.averageTransaction.toFixed(2)}</strong>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SpendingTrends;
