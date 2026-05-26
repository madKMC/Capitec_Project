import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import './Dashboard.css';
import { useAuth } from '../../context/auth/useAuth';
import CategoryChart from './Components/CategoryChart/CategoryChart';
import TrendChart from './Components/TrendChart/TrendChart';
import GoalsChart from './Components/GoalsChart/GoalsChart';
import TransactionsCard from './Components/TransactionCard/TransactionCard';

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

type Category = {
	name: string;
	amount: number;
	percentage: number;
	transactionCount: number;
	color: string;
	icon: string;
};

type Trend = {
	month: string;
	totalSpent: number;
	transactionCount: number;
	averageTransaction: number;
};

type Goal = {
	id: string;
	title: string;
	targetAmount: number;
	currentAmount: number;
	dueDate: string;
	status: 'on_track' | 'warning' | 'exceeded';
	category: string;
	monthlyBudget: number;
	currentSpent: number;
	percentageUsed: number;
	daysRemaining: number;
};

const Dashboard = () => {
	const { user } = useAuth();

	const [summary, setSummary] = useState<SpendingSummary | null>(null);
	const [goals, setGoals] = useState<Goal[] | null>(null);
	const [categories, setCategories] = useState<Category[] | null>(null);
	const [trends, setTrends] = useState<Trend[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		const customerId = user?.customerId ?? '12345';

		let mounted = true;

		async function loadMockData() {
			setError(null);
			setLoading(true);
			try {
				const summaryData = await apiFetch(
					`/api/customers/${customerId}/spending/summary`,
				);
				const categoryData = await apiFetch(
					`/api/customers/${customerId}/spending/categories?`,
				);

				const trendsData = await apiFetch(
					`/api/customers/${customerId}/spending/trends`,
				);

				const goalsData = await apiFetch(`/api/customers/${customerId}/goals`);

				if (mounted) {
					setSummary(summaryData);
					setCategories(categoryData.categories);
					setTrends(trendsData.trends);
					setGoals(goalsData.goals);
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
		<main className='dashboard'>
			{loading && (
				<div className='state' role='status' aria-live='polite'>Loading financial insight overview...</div>
			)}

			{error && <div className='state error' role='alert'>Error: {error}</div>}

			{summary && (
				<>
					<h2 className='dashboard-title'>
						Spending Summary ({summary.period})
					</h2>

					<section className='summary-grid' aria-label="Spending summary">
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
					<section className='chart-section' aria-label="Charts and transactions">
						{categories && <CategoryChart categories={categories} />}
						{trends && <TrendChart trends={trends} />}
						{goals && <GoalsChart goals={goals} />}
						<TransactionsCard customerId={user?.customerId ?? '12345'} />
					</section>
				</>
			)}

			{!loading && !summary && !error && (
				<div className='state' role='status' aria-live='polite'>No financial data available.</div>
			)}
		</main>
	);
};

export default Dashboard;
