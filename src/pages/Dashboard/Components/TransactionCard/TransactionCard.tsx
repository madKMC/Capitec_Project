import { useEffect, useState } from 'react';
import './TransactionCard.css';
import { apiFetch } from '../../../../api/client';
import CardTitle from '../../../../components/CardTitles/CardTitle';
import TransactionInfo from '../../../../components/TransactionInfo/TransactionInfo';

type Transaction = {
	id: string;
	date: string;
	merchant: string;
	category: string;
	amount: number;
	description: string;
	paymentMethod: string;
	icon: string;
	categoryColor: string;
};

type Category = {
	name: string;
	color: string;
	icon: string;
};

type DateRangePreset = {
	label: string;
	value: string;
};

type FiltersResponse = {
	categories: Category[];
	dateRangePresets: DateRangePreset[];
};

type Props = {
	customerId: string;
	filterData: FiltersResponse | null;
	selectedDateRange: string;
};

const TransactionsCard = ({
	customerId,
	filterData,
	selectedDateRange,
}: Props) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [sortBy, setSortBy] = useState<string>('date_desc');

	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(false);

	const limit = 20;

	/* Fetch transactions */
	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);

			const data = await apiFetch(
				`/api/customers/${customerId}/transactions?limit=${limit}&offset=${offset}&range=${selectedDateRange}&category=${selectedCategory === 'All' ? '' : selectedCategory}&sortBy=${sortBy}`,
			);

			setTransactions(data.transactions);
			setHasMore(data.pagination.hasMore);
			setLoading(false);
		};

		fetchTransactions();
	}, [customerId, offset, selectedCategory, sortBy, selectedDateRange]);

	useEffect(() => {
		setOffset(0);
	}, [selectedDateRange, selectedCategory, sortBy]);

	return (
		<div className='transactions-card'>
			<CardTitle
				title='Transactions'
				subtitle='Operational financial activity stream'
			/>

			{/* Filters */}
			<div className='transactions-filters'>
				<label htmlFor='category-select' className='visually-hidden'>
					Select category
				</label>
				<select
					id='category-select'
					value={selectedCategory}
					onChange={(e) => {
						setSelectedCategory(e.target.value);
						setOffset(0);
					}}
					aria-label='Select transaction category'
				>
					<option value='All'>All Categories</option>
					{filterData?.categories.map((cat) => (
						<option key={cat.name} value={cat.name}>
							{cat.name}
						</option>
					))}
				</select>

				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					aria-label='Sort transactions'
				>
					<option value='date_desc'>Newest First</option>
					<option value='date_asc'>Oldest First</option>
					<option value='amount_desc'>Highest Amount</option>
					<option value='amount_asc'>Lowest Amount</option>
				</select>
			</div>

			{/* Body */}
			<div className='transactions-body'>
				{loading ? (
					<div
						className='transactions-loading'
						role='status'
						aria-live='polite'
					>
						Loading dataset...
					</div>
				) : transactions.length === 0 ? (
					<p className='empty-state'>No transactions found for this period.</p>
				) : (
					transactions.map((txn) => (
						<div key={txn.id} className='transaction-row'>
							<div
								className='transaction-icon'
								style={{ background: txn.categoryColor }}
								aria-hidden='true'
							/>

							<TransactionInfo
								merchant={txn.merchant}
								description={txn.description}
								date={txn.date}
							/>

							<div
								className='transaction-amount'
								aria-label={`Transaction amount: R${txn.amount.toFixed(2)}`}
							>
								R{txn.amount.toFixed(2)}
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination control layer */}
			<div className='transactions-footer'>
				<button
					onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
					disabled={offset === 0}
					aria-label='Previous page of transactions'
				>
					Previous
				</button>

				<button
					onClick={() => setOffset((prev) => prev + limit)}
					disabled={!hasMore}
					aria-label='Next page of transactions'
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default TransactionsCard;
