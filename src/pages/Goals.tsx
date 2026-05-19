import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import './CSS/Goals.css';
import { useAuth } from '../context/auth/useAuth';

type Goal = {
	id: string;
	category: string;
	monthlyBudget: number;
	currentSpent: number;
	percentageUsed: number;
	daysRemaining: number;
	status: 'on_track' | 'warning' | 'exceeded';
};

type SpendingGoalsResponse = {
	goals: Goal[];
};

const SpendingGoals = () => {
	const { user } = useAuth();
	const customerId = user?.customerId ?? '12345';

	const [data, setData] = useState<SpendingGoalsResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		let mounted = true;

		async function loadGoals() {
			try {
				const response = await apiFetch(`/api/customers/${customerId}/goals`);

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

		loadGoals();

		return () => {
			mounted = false;
		};
	}, [user, customerId]);

	if (loading) {
		return <div>Loading spending goals...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!data) {
		return <div>No goals available.</div>;
	}

	const getStatusClass = (status: Goal['status']) => {
		switch (status) {
			case 'on_track':
				return 'goal-on-track';
			case 'warning':
				return 'goal-warning';
			case 'exceeded':
				return 'goal-exceeded';
			default:
				return '';
		}
	};

	return (
		<div className='goals-container'>
			<h2>Spending Goals</h2>

			<div className='goals-grid'>
				{data.goals.map((goal) => (
					<div
						key={goal.id}
						className={`goal-card ${getStatusClass(goal.status)}`}
					>
						<h3>{goal.category}</h3>

						<div className='goal-row'>
							<span>Budget</span>
							<strong>R{goal.monthlyBudget.toFixed(2)}</strong>
						</div>

						<div className='goal-row'>
							<span>Spent</span>
							<strong>R{goal.currentSpent.toFixed(2)}</strong>
						</div>

						<div className='goal-row'>
							<span>Usage</span>
							<strong>{goal.percentageUsed.toFixed(1)}%</strong>
						</div>

						<div className='goal-row'>
							<span>Days Left</span>
							<strong>{goal.daysRemaining}</strong>
						</div>

						<div className='goal-status'>
							Status: {goal.status.replace('_', ' ')}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SpendingGoals;
