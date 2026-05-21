import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './CSS/CategoryChart.css';

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
			<h3 className='chart-title'>Category Spending Breakdown</h3>
			<div className='chart-body'>
				<div className='chart-wrapper'>
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
						>
							<div className='legend-left'>
								<span
									className='legend-dot'
									style={{
										background: item.color,
									}}
								/>

								<span>{item.name}</span>
							</div>

							<div className='legend-right'>
								<span>R{item.value.toFixed(0)}</span>

								<span className='percentage'>{item.percentage}%</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoryChart;
