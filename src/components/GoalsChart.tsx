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

import { apiFetch } from '../api/client';
import { useAuth } from '../context/auth/useAuth';
import './CSS/GoalsChart.css';

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
			<div className='chart-header'>
				<h3 className='chart-title'>Spending Goals</h3>

				<p className='chart-subtitle'>Monthly budget progress</p>
			</div>

			<div className='goals-chart-wrapper'>
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
												x={x - 36}
												y={y - 12}
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
								/>
							))}
						</Bar>

						{/* remaining */}
						<Bar
							dataKey='remaining'
							stackId='goal'
							fill='var(--border)'
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className='goal-summary'>
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
		</div>
	);
};

export default GoalsChart;
