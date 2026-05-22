import { useEffect, useMemo, useState } from 'react';
import './CSS/TransactionCard.css';
import { apiFetch } from '../api/client';

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

type TransactionsResponse = {
	transactions: Transaction[];
	pagination: {
		total: number;
		limit: number;
		offset: number;
		hasMore: boolean;
	};
};

type FiltersResponse = {
	categories: Category[];
	dateRangePresets: DateRangePreset[];
};

type Props = {
	customerId: string;
};

const TransactionsCard = ({ customerId }: Props) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [dateRanges, setDateRanges] = useState<DateRangePreset[]>([]);

	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [selectedRange, setSelectedRange] = useState<string>('30d');

	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const limit = 20;

	/* Fetch filters (categories + date presets) */
	useEffect(() => {
		const fetchFilters = async () => {
			const data: FiltersResponse = await apiFetch(
				`/api/customers/${customerId}/filters`,
			);

			setCategories(data.categories);
			setDateRanges(data.dateRangePresets);
		};

		fetchFilters();
	}, [customerId]);

	/* Fetch transactions */
	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);

			const data: TransactionsResponse = await apiFetch(
				`/api/customers/${customerId}/transactions?limit=${limit}&offset=${offset}&range=${selectedRange}`,
			);

			setTransactions(data.transactions);
			setHasMore(data.pagination.hasMore);
			setLoading(false);
		};

		fetchTransactions();
	}, [customerId, offset, selectedRange]);

	/* Filtering logic (client-side layer on top of API payload) */
	const filteredTransactions = useMemo(() => {
		return transactions.filter((txn) => {
			const categoryMatch =
				selectedCategory === 'All' || txn.category === selectedCategory;

			return categoryMatch;
		});
	}, [transactions, selectedCategory]);

	return (
		<div className='transactions-card'>
			<div className='transactions-header'>
				<div>
					<h3 className='transactions-title'>Transactions</h3>
					<p className='transactions-subtitle'>
						Operational financial activity stream
					</p>
				</div>
			</div>

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
					{categories.map((cat) => (
						<option key={cat.name} value={cat.name}>
							{cat.name}
						</option>
					))}
				</select>

				<select
					value={selectedRange}
					onChange={(e) => {
						setSelectedRange(e.target.value);
						setOffset(0);
					}}
					id='date-range-select'
					aria-label='Select date range for transactions'
				>
					{dateRanges.map((range) => (
						<option key={range.value} value={range.value}>
							{range.label}
						</option>
					))}
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
				) : (
					filteredTransactions.map((txn) => (
						<div key={txn.id} className='transaction-row'>
							<div
								className='transaction-icon'
								style={{ background: txn.categoryColor }}
								aria-hidden='true'
							/>

							<div className='transaction-meta'>
								<div className='transaction-merchant'>{txn.merchant}</div>
								<div className='transaction-description'>{txn.description}</div>
							</div>

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
