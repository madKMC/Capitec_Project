import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './CategoryChart.css';
import CardTitle from '../../../../components/CardTitles/CardTitle';

type Category = {
	name: string;
	amount: number;
	percentage: number;
	transactionCount: number;
	color: string;
	icon: string;
};

type CategoryChartProps = {
	categories: Category[];
};

const CategoryChart = ({ categories }: CategoryChartProps) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const chartData = useMemo(
		() =>
			categories.map((category) => ({
				name: category.name,
				value: category.amount,
				color: category.color,
				percentage: category.percentage,
			})),
		[categories],
	);

	return (
		<div className='category-chart-card'>
			<CardTitle
				title='Category Spending Breakdown'
			/>

			{/* Visually hidden data table for screen readers */}
			<table className='sr-only' aria-labelledby='category-chart-title'>
				<thead>
					<tr>
						<th scope='col'>Category</th>
						<th scope='col'>Amount</th>
						<th scope='col'>Percentage</th>
					</tr>
				</thead>
				<tbody>
					{chartData.map((item) => (
						<tr key={item.name}>
							<td>{item.name}</td>
							<td>R{item.value.toFixed(0)}</td>
							<td>{item.percentage}%</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className='chart-body' aria-hidden='true'>
				<div
					className='chart-wrapper'
					role='img'
					aria-label='Pie chart showing spending breakdown by category'
				>
					<ResponsiveContainer width='100%' height={320}>
						<PieChart>
							<Pie
								data={chartData}
								dataKey='value'
								nameKey='name'
								cx='50%'
								cy='50%'
								innerRadius={70}
								outerRadius={105}
								paddingAngle={2}
								onMouseEnter={(_, index) => setActiveIndex(index)}
							>
								{chartData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>

							{/* <Tooltip
								formatter={() => [
									`${chartData[activeIndex].name}`,
									`${Number(chartData[activeIndex].percentage).toFixed(1)}%`,
								]}
							/> */}
						</PieChart>
					</ResponsiveContainer>
				</div>

				<div className='category-legend'>
					{chartData.map((item, index) => (
						<div
							key={item.name}
							className={`legend-item ${activeIndex === index ? 'active' : ''}`}
							onMouseEnter={() => setActiveIndex(index)}
							tabIndex={0}
							onFocus={() => setActiveIndex(index)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									setActiveIndex(index);
								}
							}}
							role='button'
							aria-label={`View details for ${item.name} category`}
						>
							<div className='legend-left'>
								<span
									className='legend-dot'
									style={{
										background: item.color,
									}}
									aria-label={`Category color for ${item.name}`}
								/>

								<span>{item.name}</span>
							</div>

							<div className='legend-right'>
								<span>R{item.value.toFixed(0)}</span>

								<span
									className='percentage'
									aria-label={`Category percentage for ${item.name}`}
								>
									{item.percentage}%
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoryChart;
