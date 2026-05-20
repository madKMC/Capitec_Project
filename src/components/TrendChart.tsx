import { useMemo } from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import './CSS/TrendChart.css';

type Trend = {
	month: string;
	totalSpent: number;
	transactionCount: number;
	averageTransaction: number;
};

type TrendChartProps = {
	trends: Trend[];
};

const TrendChart = ({ trends }: TrendChartProps) => {
	const chartData = useMemo(
		() =>
			trends.map((trend) => ({
				month: formatMonth(trend.month),
				totalSpent: trend.totalSpent,
				averageTransaction: trend.averageTransaction,
				transactionCount: trend.transactionCount,
			})),
		[trends],
	);

	return (
		<div className='trend-chart-card'>
			<div className='chart-header'>
				<h3 className='chart-title'>Monthly Spending Trends</h3>

				<p className='chart-subtitle'>Last 6 months overview</p>
			</div>

			<div className='trend-chart-wrapper'>
				<ResponsiveContainer width='100%' height={320}>
					<AreaChart
						data={chartData}
						margin={{
							top: 20,
							right: 10,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' opacity={0.15} />

						<XAxis dataKey='month' tickLine={false} axisLine={false} />

						<YAxis
							tickFormatter={(value) => `R${value / 1000}k`}
							tickLine={false}
							axisLine={false}
							width={50}
						/>

						<Tooltip
							formatter={(value, name) => {
								if (name === 'totalSpent') {
									return [`R${Number(value).toFixed(2)}`, 'Total Spent'];
								}

								return [`R${Number(value).toFixed(2)}`, 'Average Transaction'];
							}}
						/>

						<defs>
							<linearGradient id='spendingGradient' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='var(--accent)' stopOpacity={0.4} />
								<stop offset='95%' stopColor='var(--accent)' stopOpacity={0} />
							</linearGradient>
						</defs>

						<Area
							type='monotone'
							dataKey='totalSpent'
							stroke='var(--accent)'
							fill='url(#spendingGradient)'
							strokeWidth={3}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

function formatMonth(month: string) {
	const date = new Date(`${month}-01`);

	return new Intl.DateTimeFormat('en-ZA', {
		month: 'short',
	}).format(date);
}

export default TrendChart;
