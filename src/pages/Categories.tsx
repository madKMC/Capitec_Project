import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import './CSS/Categories.css';
import { useAuth } from '../context/auth/useAuth';

type Category = {
	name: string;
	amount: number;
	percentage: number;
	transactionCount: number;
	color: string;
	icon: string;
};

type SpendingCategoriesResponse = {
	dateRange: {
		startDate: string;
		endDate: string;
	};
	totalAmount: number;
	categories: Category[];
};

const SpendingCategories = () => {
	const { user } = useAuth();

	const [data, setData] = useState<SpendingCategoriesResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		const customerId = user?.customerId ?? '12345';

		let mounted = true;

		async function loadCategories() {
			try {
				const params = new URLSearchParams({
					period: '30d',
				});

				const response = await apiFetch(
					`/api/customers/${customerId}/spending/categories?${params.toString()}`,
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

		loadCategories();

		return () => {
			mounted = false;
		};
	}, [user]);

	if (loading) {
		return <div>Loading category breakdown...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!data) {
		return <div>No category data available.</div>;
	}

	return (
		<div>
			<h2>Spending by Category</h2>

			<p>
				{data.dateRange.startDate} → {data.dateRange.endDate}
			</p>

			<p>Total Spent: R{data.totalAmount}</p>

			<div>
				{data.categories.map((category) => (
					<div
						key={category.name}
						style={{
							borderLeft: `6px solid ${category.color}`,
							paddingLeft: '1rem',
							marginBottom: '1rem',
						}}
					>
						<h3>{category.name}</h3>

						<p>Amount: R{category.amount}</p>

						<p>{category.percentage}% of total spending</p>

						<p>Transactions: {category.transactionCount}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default SpendingCategories;
