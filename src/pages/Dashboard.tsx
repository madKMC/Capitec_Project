import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import SummaryCard from '../components/SummaryCard';
import './CSS/Dashboard.css';
import { useAuth } from '../context/auth/useAuth';

interface SpendingSummary {
	period: string;
	totalSpent: number;
	transactionCount: number;
	topCategory: string;
	averageTransaction: number;
	comparedToPrevious: {
		spentChange: number;
		transactionChange: number;
	};
}

const Dashboard = () => {
	const { user } = useAuth();

	const [summary, setSummary] = useState<SpendingSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		const customerId = user?.customerId ?? '12345';

		let mounted = true;

		async function loadMockData() {
			try {
				const summaryData = await apiFetch(
					`/api/customers/${customerId}/spending/summary`,
				);

				if (mounted) {
					setSummary(summaryData);
				}
			} catch (err: unknown) {
				if (mounted) {
					const errorMessage =
						err instanceof Error ? err.message : 'Unexpected error';
					setError(errorMessage);
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		loadMockData();

		return () => {
			mounted = false;
		};
	}, [user]);

	return (
		<div className='dashboard'>
			{loading && (
				<div className='state'>Loading financial insight overview...</div>
			)}

			{error && <div className='state error'>Error: {error}</div>}

			{summary && (
				<>
					<h2 className='dashboard-title'>
						Spending Summary ({summary.period})
					</h2>

					<section className='summary-grid'>
						<SummaryCard title='Total Spent' value={`R${summary.totalSpent}`} />
						<SummaryCard
							title='Transactions'
							value={summary.transactionCount}
						/>
						<SummaryCard title='Top Category' value={summary.topCategory} />
						<SummaryCard
							title='Average Transaction'
							value={`R${summary.averageTransaction}`}
						/>
					</section>
				</>
			)}

			{!loading && !summary && !error && (
				<div className='state'>No financial data available.</div>
			)}
		</div>
	);
};

export default Dashboard;
