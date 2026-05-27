import { useMemo, useState } from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import './TrendChart.css';
import CardTitle from '../../../../components/CardTitles/CardTitle';

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
	const [selectedMonths, setSelectedMonths] = useState(12);

	const chartData = useMemo(() => {
		return trends.slice(-selectedMonths).map((trend) => ({
			month: formatMonth(trend.month),
			totalSpent: trend.totalSpent,
			averageTransaction: trend.averageTransaction,
			transactionCount: trend.transactionCount,
		}));
	}, [trends, selectedMonths]);

	if (chartData.length === 0) {
		return (
			<div className='trend-chart-card'>
				<CardTitle title='Monthly Spending Trends' />
				<p className='empty-state'>No trend data available for this range.</p>
			</div>
		);
	}

	return (
		<div className='trend-chart-card'>
			<CardTitle
				aria-hidden='true'
				title='Monthly Spending Trends'
				subtitle={`Last ${selectedMonths} months overview`}
			/>
			<div
				className='trend-month-filter'
				role='group'
				aria-label='Select month range'
			>
				<div className='trend-month-filter'>
					<label htmlFor='month-range' className='trend-month-label'>
						{selectedMonths}M
					</label>
					<input
						id='month-range'
						type='range'
						min={1}
						max={12}
						value={selectedMonths}
						onChange={(e) => setSelectedMonths(Number(e.target.value))}
						aria-label={`Show last ${selectedMonths} months`}
					/>
				</div>
			</div>

			{/* Screen reader data table */}
			<table className='sr-only'>
				<caption>
					Monthly spending trends for the last {chartData.length} months
				</caption>
				<thead>
					<tr>
						<th scope='col'>Month</th>
						<th scope='col'>Total Spent (R)</th>
						<th scope='col'>Average Transaction (R)</th>
						<th scope='col'>Transaction Count</th>
					</tr>
				</thead>
				<tbody>
					{chartData.map((row) => (
						<tr key={row.month}>
							<td>{row.month}</td>
							<td>{row.totalSpent.toFixed(2)}</td>
							<td>{row.averageTransaction.toFixed(2)}</td>
							<td>{row.transactionCount}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className='trend-chart-wrapper' aria-hidden='true'>
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
							contentStyle={{
								background: 'var(--panel)',
								border: '1px solid var(--border)',
								borderRadius: '4px',
								color: 'var(--text)',
							}}
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
