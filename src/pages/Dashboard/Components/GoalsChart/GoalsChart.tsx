import { useEffect, useMemo, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Cell,
	CartesianGrid,
} from 'recharts';
import {
	FaShoppingCart,
	FaFilm,
	FaCar,
	FaUtensils,
	FaShoppingBag,
	FaBolt,
} from 'react-icons/fa';
import CardTitle from '../../../../components/CardTitles/CardTitle';

import { apiFetch } from '../../../../api/client';
import { useAuth } from '../../../../context/auth/useAuth';
import './GoalsChart.css';

type Goal = {
	id: string;
	category: string;
	monthlyBudget: number;
	currentSpent: number;
	percentageUsed: number;
	daysRemaining: number;
	status: 'on_track' | 'warning' | 'exceeded';
};

type CategoryFilter = {
	name: string;
	color: string;
	icon: string;
};

type GoalsChartProps = {
	goals: Goal[];
};

const categoryIcons = {
	'shopping-cart': FaShoppingCart,
	film: FaFilm,
	car: FaCar,
	utensils: FaUtensils,
	'shopping-bag': FaShoppingBag,
	zap: FaBolt,
} as const;

const GoalsChart = ({ goals }: GoalsChartProps) => {
	const { user } = useAuth();

	const customerId = user?.customerId ?? '12345';

	const [filters, setFilters] = useState<CategoryFilter[]>([]);

	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const loadFilters = async () => {
			try {
				const response = await apiFetch(`/api/customers/${customerId}/filters`);

				setFilters(response.categories);
			} catch (error) {
				console.error('Failed to load category metadata', error);
			}
		};

		loadFilters();
	}, [customerId]);

	const chartData = useMemo(
		() =>
			goals.map((goal) => {
				const categoryMeta = filters.find((f) => f.name === goal.category);

				return {
					category: goal.category,

					spent: goal.currentSpent,

					remaining: Math.max(goal.monthlyBudget - goal.currentSpent, 0),

					budget: goal.monthlyBudget,

					percentage: goal.percentageUsed,

					status: goal.status,

					daysRemaining: goal.daysRemaining,

					icon: categoryMeta?.icon,

					categoryColor: categoryMeta?.color,
				};
			}),
		[goals, filters],
	);

	const getStatusColor = (status: Goal['status']) => {
		switch (status) {
			case 'warning':
				return 'var(--warning)';

			case 'exceeded':
				return 'var(--danger)';

			default:
				return 'var(--success)';
		}
	};

	return (
		<div className='goals-chart-card'>
			<CardTitle
				title='Spending Goals'
				subtitle='Monthly budget progress'
			/>

			<div className='goals-chart-wrapper' aria-hidden='true'>
				<ResponsiveContainer width='100%' height={320}>
					<BarChart
						layout='vertical'
						data={chartData}
						margin={{
							top: 10,
							right: 30,
							left: isMobile ? 0 : 20,
							bottom: 10,
						}}
						barCategoryGap={18}
						role='img'
						aria-label='Bar chart showing monthly budget progress for each spending category'
					>
						<CartesianGrid
							strokeDasharray='3 3'
							opacity={0.08}
							horizontal={false}
						/>

						{/* MOBILE */}
						{isMobile ? (
							<>
								<XAxis
									type='number'
									tickFormatter={(v) => `R${v}`}
									axisLine={false}
									tickLine={false}
								/>

								<YAxis
									type='category'
									dataKey='category'
									width={40}
									axisLine={false}
									tickLine={false}
									tick={(props) => {
										const { x, y, payload } = props;

										const item = chartData.find(
											(c) => c.category === payload.value,
										);

										if (!item?.icon) return null;

										const Icon =
											categoryIcons[item.icon as keyof typeof categoryIcons];

										if (!Icon) return null;

										return (
											<foreignObject
												x={(x as number) - 36}
												y={(y as number) - 12}
												width={32}
												height={24}
											>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														width: '100%',
														height: '100%',
														color: item.categoryColor,
													}}
												>
													<Icon size={18} />
												</div>
											</foreignObject>
										);
									}}
								/>
							</>
						) : (
							<>
								{/* DESKTOP */}
								<XAxis
									type='number'
									tickFormatter={(v) => `R${v}`}
									axisLine={false}
									tickLine={false}
								/>

								<YAxis
									type='category'
									dataKey='category'
									width={90}
									axisLine={false}
									tickLine={false}
									tick={{ fill: 'var(--text)', fontSize: 12 }}
								/>
							</>
						)}

						{/* spent */}
						<Bar dataKey='spent' stackId='goal'>
							{chartData.map((entry) => (
								<Cell
									key={entry.category}
									fill={getStatusColor(entry.status)}
									radius={entry.status === 'exceeded' ? [0, 8, 8, 0] : [0, 0, 0, 0]}
								/>
							))}
						</Bar>

						{/* remaining */}
						<Bar
							dataKey='remaining'
							stackId='goal'
							fill='var(--border)'
							radius={[0, 8, 8, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className='goal-summary' aria-hidden='true'>
				{goals.map((goal) => (
					<div key={goal.id} className='goal-pill'>
						<span
							className='goal-status-dot'
							style={{
								background: getStatusColor(goal.status),
							}}
						/>

						<span>{goal.category}</span>

						<span className='goal-meta'>
							R{goal.currentSpent.toFixed(0)}
							/R
							{goal.monthlyBudget.toFixed(0)}
						</span>

						<span className='goal-meta'>
							{Math.round(goal.percentageUsed)}%
						</span>
					</div>
				))}
			</div>

			{/* Screen reader data table */}
			<table className='sr-only'>
				<caption>Monthly budget progress per spending category</caption>
				<thead>
					<tr>
						<th scope='col'>Category</th>
						<th scope='col'>Monthly Budget (R)</th>
						<th scope='col'>Amount Spent (R)</th>
						<th scope='col'>Remaining (R)</th>
						<th scope='col'>Percentage Used</th>
						<th scope='col'>Status</th>
						<th scope='col'>Days Remaining</th>
					</tr>
				</thead>
				<tbody>
					{chartData.map((row) => (
						<tr key={row.category}>
							<td>{row.category}</td>
							<td>{row.budget.toFixed(2)}</td>
							<td>{row.spent.toFixed(2)}</td>
							<td>{row.remaining.toFixed(2)}</td>
							<td>{Math.round(row.percentage)}%</td>
							<td>{row.status.replace('_', ' ')}</td>
							<td>{row.daysRemaining}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default GoalsChart;
