import { http, HttpResponse } from 'msw';

interface User {
	customerId: string;
	name: string;
	email: string;
	joinDate: string;
	accountType: string;
	totalSpent: number;
	currency: string;
}

const periodToDays = (period: string) =>
	({ '7d': 7, '30d': 30, '90d': 90, '1y': 365 })[period] ?? 30;

const users: Record<string, User> = {
	alice: {
		customerId: '1',
		name: 'Alice Smith',
		email: 'alice@example.com',
		joinDate: '2024-02-01',
		accountType: 'standard',
		totalSpent: 1200.0,
		currency: 'ZAR',
	},
	bob: {
		customerId: '2',
		name: 'Bob Jones',
		email: 'bob@example.com',
		joinDate: '2022-08-15',
		accountType: 'premium',
		totalSpent: 20450.75,
		currency: 'ZAR',
	},
	john: {
		customerId: '12345',
		name: 'John Doe',
		email: 'john.doe@email.com',
		joinDate: '2023-01-15',
		accountType: 'premium',
		totalSpent: 15420.5,
		currency: 'ZAR',
	},
};

const allTransactions = [
	{
		id: 'txn_001',
		date: '2026-05-19T09:00:00Z',
		merchant: 'Checkers',
		category: 'Groceries',
		amount: 312.5,
		description: 'Weekly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_002',
		date: '2026-05-15T18:00:00Z',
		merchant: 'Netflix',
		category: 'Entertainment',
		amount: 199.0,
		description: 'Monthly subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_003',
		date: '2026-05-12T14:30:00Z',
		merchant: 'Uber',
		category: 'Transportation',
		amount: 145.0,
		description: 'Ride to airport',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_004',
		date: '2026-05-08T19:15:00Z',
		merchant: "Nando's",
		category: 'Dining',
		amount: 187.5,
		description: 'Dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_005',
		date: '2026-04-28T11:00:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 456.3,
		description: 'Monthly shop',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_006',
		date: '2026-04-22T14:00:00Z',
		merchant: 'Woolworths',
		category: 'Shopping',
		amount: 890.0,
		description: 'Clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_007',
		date: '2026-04-18T10:00:00Z',
		merchant: 'MTN',
		category: 'Utilities',
		amount: 299.0,
		description: 'Mobile contract',
		paymentMethod: 'Debit Order',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_008',
		date: '2026-04-14T20:00:00Z',
		merchant: 'Spur',
		category: 'Dining',
		amount: 345.0,
		description: 'Family dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_009',
		date: '2026-04-08T08:00:00Z',
		merchant: 'Spotify',
		category: 'Entertainment',
		amount: 89.99,
		description: 'Music subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_010',
		date: '2026-04-02T16:00:00Z',
		merchant: 'BP',
		category: 'Transportation',
		amount: 650.0,
		description: 'Fuel',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_011',
		date: '2026-03-26T10:30:00Z',
		merchant: 'Spar',
		category: 'Groceries',
		amount: 278.4,
		description: 'Grocery run',
		paymentMethod: 'Debit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_012',
		date: '2026-03-22T13:00:00Z',
		merchant: 'KFC',
		category: 'Dining',
		amount: 125.8,
		description: 'Lunch',
		paymentMethod: 'Cash',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_013',
		date: '2026-03-18T15:00:00Z',
		merchant: 'H&M',
		category: 'Shopping',
		amount: 540.0,
		description: 'Clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_014',
		date: '2026-03-14T21:00:00Z',
		merchant: 'Steam',
		category: 'Entertainment',
		amount: 299.0,
		description: 'Game purchase',
		paymentMethod: 'Credit Card',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_015',
		date: '2026-03-08T09:30:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 389.6,
		description: 'Weekly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_016',
		date: '2026-03-02T08:00:00Z',
		merchant: 'Eskom',
		category: 'Utilities',
		amount: 1200.0,
		description: 'Electricity bill',
		paymentMethod: 'EFT',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_017',
		date: '2026-02-26T17:00:00Z',
		merchant: 'Uber',
		category: 'Transportation',
		amount: 98.5,
		description: 'City ride',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_018',
		date: '2026-02-22T08:30:00Z',
		merchant: 'Vida e Caffè',
		category: 'Dining',
		amount: 65.0,
		description: 'Morning coffee',
		paymentMethod: 'Debit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_019',
		date: '2026-02-18T11:00:00Z',
		merchant: 'Checkers',
		category: 'Groceries',
		amount: 445.2,
		description: 'Monthly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_020',
		date: '2026-02-12T14:00:00Z',
		merchant: 'Mr Price',
		category: 'Shopping',
		amount: 320.0,
		description: 'Clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_021',
		date: '2026-02-06T19:00:00Z',
		merchant: 'Showmax',
		category: 'Entertainment',
		amount: 149.0,
		description: 'Streaming subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_022',
		date: '2026-02-01T15:00:00Z',
		merchant: 'Shell',
		category: 'Transportation',
		amount: 780.0,
		description: 'Fuel',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_023',
		date: '2026-01-26T10:00:00Z',
		merchant: 'Woolworths Food',
		category: 'Groceries',
		amount: 523.8,
		description: 'Weekly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_024',
		date: '2026-01-22T19:30:00Z',
		merchant: "McDonald's",
		category: 'Dining',
		amount: 198.5,
		description: 'Dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_025',
		date: '2026-01-18T08:00:00Z',
		merchant: 'Telkom',
		category: 'Utilities',
		amount: 499.0,
		description: 'Internet bill',
		paymentMethod: 'Debit Order',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_026',
		date: '2026-01-14T11:00:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 267.9,
		description: 'Grocery run',
		paymentMethod: 'Debit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_027',
		date: '2026-01-10T14:00:00Z',
		merchant: 'Sportsmans Warehouse',
		category: 'Shopping',
		amount: 1240.0,
		description: 'Sports equipment',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_028',
		date: '2026-01-06T18:00:00Z',
		merchant: 'Netflix',
		category: 'Entertainment',
		amount: 199.0,
		description: 'Monthly subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_029',
		date: '2025-12-28T07:30:00Z',
		merchant: 'Gautrain',
		category: 'Transportation',
		amount: 245.0,
		description: 'Train commute',
		paymentMethod: 'Gautrain Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_030',
		date: '2025-12-24T19:00:00Z',
		merchant: "Nando's",
		category: 'Dining',
		amount: 210.0,
		description: 'Christmas Eve dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_031',
		date: '2025-12-20T08:00:00Z',
		merchant: 'Rain',
		category: 'Utilities',
		amount: 149.0,
		description: 'Mobile data',
		paymentMethod: 'Debit Order',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_032',
		date: '2025-12-16T10:00:00Z',
		merchant: 'Checkers',
		category: 'Groceries',
		amount: 398.7,
		description: 'Weekly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_033',
		date: '2025-12-12T15:00:00Z',
		merchant: 'Zara',
		category: 'Shopping',
		amount: 1650.0,
		description: 'Christmas shopping',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_034',
		date: '2025-12-08T17:00:00Z',
		merchant: 'Uber',
		category: 'Transportation',
		amount: 112.0,
		description: 'City ride',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_035',
		date: '2025-12-04T20:00:00Z',
		merchant: 'Spur',
		category: 'Dining',
		amount: 456.0,
		description: 'Family dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_036',
		date: '2025-11-28T10:30:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 341.2,
		description: 'Monthly shop',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_037',
		date: '2025-11-24T08:00:00Z',
		merchant: 'Spotify',
		category: 'Entertainment',
		amount: 89.99,
		description: 'Music subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_038',
		date: '2025-11-20T08:00:00Z',
		merchant: 'City Power',
		category: 'Utilities',
		amount: 890.0,
		description: 'Electricity',
		paymentMethod: 'EFT',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_039',
		date: '2025-11-16T13:00:00Z',
		merchant: 'KFC',
		category: 'Dining',
		amount: 145.6,
		description: 'Lunch',
		paymentMethod: 'Cash',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_040',
		date: '2025-11-12T14:00:00Z',
		merchant: 'H&M',
		category: 'Shopping',
		amount: 780.0,
		description: 'Winter clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_041',
		date: '2025-10-28T18:00:00Z',
		merchant: 'Netflix',
		category: 'Entertainment',
		amount: 199.0,
		description: 'Monthly subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_042',
		date: '2025-10-22T16:00:00Z',
		merchant: 'BP',
		category: 'Transportation',
		amount: 720.0,
		description: 'Fuel',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_043',
		date: '2025-10-18T10:00:00Z',
		merchant: 'Woolworths Food',
		category: 'Groceries',
		amount: 612.4,
		description: 'Weekly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_044',
		date: '2025-10-14T19:30:00Z',
		merchant: "McDonald's",
		category: 'Dining',
		amount: 178.9,
		description: 'Dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_045',
		date: '2025-10-08T08:00:00Z',
		merchant: 'MTN',
		category: 'Utilities',
		amount: 299.0,
		description: 'Mobile contract',
		paymentMethod: 'Debit Order',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_046',
		date: '2025-10-02T11:00:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 289.3,
		description: 'Grocery run',
		paymentMethod: 'Debit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_047',
		date: '2025-09-26T14:00:00Z',
		merchant: 'Mr Price',
		category: 'Shopping',
		amount: 445.0,
		description: 'Clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_048',
		date: '2025-09-20T20:00:00Z',
		merchant: 'Ster-Kinekor',
		category: 'Entertainment',
		amount: 120.0,
		description: 'Cinema tickets',
		paymentMethod: 'Credit Card',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_049',
		date: '2025-09-14T16:00:00Z',
		merchant: 'Shell',
		category: 'Transportation',
		amount: 810.0,
		description: 'Fuel',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_050',
		date: '2025-09-08T08:30:00Z',
		merchant: 'Vida e Caffè',
		category: 'Dining',
		amount: 78.5,
		description: 'Morning coffee',
		paymentMethod: 'Debit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_051',
		date: '2025-08-28T10:00:00Z',
		merchant: 'Spar',
		category: 'Groceries',
		amount: 534.6,
		description: 'Monthly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_052',
		date: '2025-08-22T21:00:00Z',
		merchant: 'Steam',
		category: 'Entertainment',
		amount: 499.0,
		description: 'Game purchase',
		paymentMethod: 'Credit Card',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_053',
		date: '2025-08-16T17:00:00Z',
		merchant: 'Uber',
		category: 'Transportation',
		amount: 189.0,
		description: 'Airport ride',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_054',
		date: '2025-08-10T19:00:00Z',
		merchant: "Nando's",
		category: 'Dining',
		amount: 267.5,
		description: 'Dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_055',
		date: '2025-08-04T14:00:00Z',
		merchant: 'Woolworths',
		category: 'Shopping',
		amount: 2340.0,
		description: 'Winter wardrobe',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_056',
		date: '2025-07-28T08:00:00Z',
		merchant: 'Eskom',
		category: 'Utilities',
		amount: 1350.0,
		description: 'Electricity bill',
		paymentMethod: 'EFT',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_057',
		date: '2025-07-22T10:30:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 478.9,
		description: 'Weekly groceries',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_058',
		date: '2025-07-16T18:00:00Z',
		merchant: 'Netflix',
		category: 'Entertainment',
		amount: 199.0,
		description: 'Monthly subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_059',
		date: '2025-07-10T07:30:00Z',
		merchant: 'Gautrain',
		category: 'Transportation',
		amount: 310.0,
		description: 'Train commute',
		paymentMethod: 'Gautrain Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_060',
		date: '2025-07-04T20:00:00Z',
		merchant: 'Spur',
		category: 'Dining',
		amount: 523.0,
		description: 'Birthday dinner',
		paymentMethod: 'Credit Card',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_061',
		date: '2025-06-26T10:00:00Z',
		merchant: 'Checkers',
		category: 'Groceries',
		amount: 367.8,
		description: 'Grocery run',
		paymentMethod: 'Debit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_062',
		date: '2025-06-20T08:00:00Z',
		merchant: 'Spotify',
		category: 'Entertainment',
		amount: 89.99,
		description: 'Music subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_063',
		date: '2025-06-14T16:00:00Z',
		merchant: 'BP',
		category: 'Transportation',
		amount: 695.0,
		description: 'Fuel',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
	{
		id: 'txn_064',
		date: '2025-06-08T12:30:00Z',
		merchant: 'KFC',
		category: 'Dining',
		amount: 167.4,
		description: 'Lunch',
		paymentMethod: 'Cash',
		icon: 'utensils',
		categoryColor: '#F7DC6F',
	},
	{
		id: 'txn_065',
		date: '2025-06-02T15:00:00Z',
		merchant: 'Zara',
		category: 'Shopping',
		amount: 1890.0,
		description: 'Seasonal clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_066',
		date: '2025-05-26T08:00:00Z',
		merchant: 'Telkom',
		category: 'Utilities',
		amount: 499.0,
		description: 'Internet bill',
		paymentMethod: 'Debit Order',
		icon: 'zap',
		categoryColor: '#85C1E9',
	},
	{
		id: 'txn_067',
		date: '2025-05-18T11:00:00Z',
		merchant: 'Pick n Pay',
		category: 'Groceries',
		amount: 412.6,
		description: 'Monthly shop',
		paymentMethod: 'Credit Card',
		icon: 'shopping-cart',
		categoryColor: '#FF6B6B',
	},
	{
		id: 'txn_068',
		date: '2025-04-28T14:00:00Z',
		merchant: 'H&M',
		category: 'Shopping',
		amount: 650.0,
		description: 'Clothing',
		paymentMethod: 'Credit Card',
		icon: 'shopping-bag',
		categoryColor: '#BB8FCE',
	},
	{
		id: 'txn_069',
		date: '2025-04-15T18:00:00Z',
		merchant: 'Showmax',
		category: 'Entertainment',
		amount: 149.0,
		description: 'Streaming subscription',
		paymentMethod: 'Debit Order',
		icon: 'film',
		categoryColor: '#4ECDC4',
	},
	{
		id: 'txn_070',
		date: '2025-04-02T17:00:00Z',
		merchant: 'Uber',
		category: 'Transportation',
		amount: 134.0,
		description: 'City ride',
		paymentMethod: 'Credit Card',
		icon: 'car',
		categoryColor: '#45B7D1',
	},
];

/* Simple session store */
const storedSessions = localStorage.getItem('msw-sessions');
const sessions = new Map<string, string>(
	storedSessions ? JSON.parse(storedSessions) : [],
);
const saveSessions = () => {
	localStorage.setItem('msw-sessions', JSON.stringify([...sessions]));
};
const createToken = (username: string) => {
	const token = `mock-token-${username}-${Date.now()}`;
	sessions.set(token, username);
	saveSessions();
	return token;
};

export const handlers = [
	/* login: accept { username } and return token + user */
	http.post('/auth/login', async ({ request }) => {
		const body = (await request.json()) as Record<string, string>;
		const username = body?.username;
		if (!username || !users[username]) {
			return HttpResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 },
			);
		}
		const token = createToken(username);
		return HttpResponse.json({ token, user: users[username] });
	}),

	http.post('/auth/logout', async ({ request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');

		if (!token || !sessions.has(token)) {
			return HttpResponse.json({ message: 'Invalid token' }, { status: 401 });
		}

		sessions.delete(token);
		saveSessions();

		return HttpResponse.json({
			message: 'Logged out successfully',
		});
	}),

	/* Customer Profile */
	http.get('/api/customers/{:customerId}/profile', ({ params, request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}
		return HttpResponse.json({
			...user,
			customerId: params.customerId ?? user.customerId,
		});
	}),

	/* Spending Summary */
	http.get('/api/customers/:customerId/spending/summary', ({ request }) => {
		const period = new URL(request.url).searchParams.get('period') ?? '30d';
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}
		const cutoff = new Date(Date.now() - periodToDays(period) * 86400000);
		const filtered = allTransactions.filter((t) => new Date(t.date) >= cutoff);
		const totalSpent = filtered.reduce((s, t) => s + t.amount, 0);
		const categoryTotals = new Map<string, number>();
		for (const t of filtered)
			categoryTotals.set(
				t.category,
				(categoryTotals.get(t.category) ?? 0) + t.amount,
			);
		const topCategory =
			[...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
			'N/A';
		const days = periodToDays(period);
		const now = new Date();
		const currentCutoff = new Date(now.getTime() - days * 86400000);
		const previousCutoff = new Date(now.getTime() - days * 2 * 86400000);

		const currentFiltered = allTransactions.filter(
			(t) => new Date(t.date) >= currentCutoff,
		);
		const previousFiltered = allTransactions.filter((t) => {
			const d = new Date(t.date);
			return d >= previousCutoff && d < currentCutoff;
		});

		const currentSpent = currentFiltered.reduce((s, t) => s + t.amount, 0);
		const previousSpent = previousFiltered.reduce((s, t) => s + t.amount, 0);

		const spentChange =
			previousSpent === 0
				? 0
				: parseFloat(
						(((currentSpent - previousSpent) / previousSpent) * 100).toFixed(1),
					);

		const currentCount = currentFiltered.length;
		const previousCount = previousFiltered.length;

		const transactionChange =
			previousCount === 0
				? 0
				: parseFloat(
						(((currentCount - previousCount) / previousCount) * 100).toFixed(1),
					);

		return HttpResponse.json({
			period,
			totalSpent: parseFloat(totalSpent.toFixed(2)),
			transactionCount: filtered.length,
			averageTransaction: parseFloat(
				(totalSpent / (filtered.length || 1)).toFixed(2),
			),
			topCategory,
			comparedToPrevious: { spentChange, transactionChange },
		});
	}),

	/* Spending by Category with Filtering */
	http.get('/api/customers/:customerId/spending/categories', ({ request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const url = new URL(request.url);
		const period = url.searchParams.get('period') ?? '30d';
		const startDateParam = url.searchParams.get('startDate');
		const endDateParam = url.searchParams.get('endDate');

		const cutoff = startDateParam
			? new Date(startDateParam)
			: new Date(Date.now() - periodToDays(period) * 86400000);
		const end = endDateParam ? new Date(endDateParam) : new Date();

		const filtered = allTransactions.filter((txn) => {
			const d = new Date(txn.date);
			return d >= cutoff && d <= end;
		});

		const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);

		// Group by category
		const categoryMap = new Map<
			string,
			{ amount: number; count: number; color: string; icon: string }
		>();
		for (const txn of filtered) {
			const existing = categoryMap.get(txn.category);
			if (existing) {
				existing.amount += txn.amount;
				existing.count += 1;
			} else {
				categoryMap.set(txn.category, {
					amount: txn.amount,
					count: 1,
					color: txn.categoryColor,
					icon: txn.icon,
				});
			}
		}

		const categories = Array.from(categoryMap.entries()).map(
			([name, data]) => ({
				name,
				amount: parseFloat(data.amount.toFixed(2)),
				percentage: parseFloat(((data.amount / totalAmount) * 100).toFixed(1)),
				transactionCount: data.count,
				color: data.color,
				icon: data.icon,
			}),
		);

		return HttpResponse.json({ totalAmount, categories });
	}),

	/* Monthly Spending Trends */
	http.get('/api/customers/:customerId/spending/trends', ({ request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}
		const months = Math.min(
			Number(new URL(request.url).searchParams.get('months') ?? '12'),
			24,
		);

		// Build a map of year-month → aggregated data
		const monthMap = new Map<
			string,
			{ totalSpent: number; transactionCount: number }
		>();
		for (const txn of allTransactions) {
			const key = txn.date.slice(0, 7); // 'YYYY-MM'
			const existing = monthMap.get(key);
			if (existing) {
				existing.totalSpent += txn.amount;
				existing.transactionCount += 1;
			} else {
				monthMap.set(key, { totalSpent: txn.amount, transactionCount: 1 });
			}
		}

		const sorted = Array.from(monthMap.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.slice(-months)
			.map(([month, data]) => ({
				month,
				totalSpent: parseFloat(data.totalSpent.toFixed(2)),
				transactionCount: data.transactionCount,
				averageTransaction: parseFloat(
					(data.totalSpent / data.transactionCount).toFixed(2),
				),
			}));

		return HttpResponse.json({ trends: sorted });
	}),

	/* Transactions with Filtering */
	http.get('/api/customers/:customerId/transactions', ({ request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}

		const url = new URL(request.url);
		const limit = Math.min(Number(url.searchParams.get('limit') ?? '20'), 100);
		const offset = Number(url.searchParams.get('offset') ?? '0');
		const category = url.searchParams.get('category');
		const startDate = url.searchParams.get('startDate');
		const endDate = url.searchParams.get('endDate');
		const range = url.searchParams.get('range');
		const sortBy = url.searchParams.get('sortBy') ?? 'date_desc';

		const cutoff = startDate
			? new Date(startDate)
			: range
				? new Date(Date.now() - periodToDays(range) * 86400000)
				: new Date(0);
		const end = endDate ? new Date(endDate) : new Date();

		let filtered = allTransactions.filter((txn) => {
			const d = new Date(txn.date);
			const dateMatch = d >= cutoff && d <= end;
			const categoryMatch =
				!category || category === 'All' || txn.category === category;
			return dateMatch && categoryMatch;
		});

		const sorters: Record<
			string,
			(a: (typeof filtered)[0], b: (typeof filtered)[0]) => number
		> = {
			date_desc: (a, b) =>
				new Date(b.date).getTime() - new Date(a.date).getTime(),
			date_asc: (a, b) =>
				new Date(a.date).getTime() - new Date(b.date).getTime(),
			amount_desc: (a, b) => b.amount - a.amount,
			amount_asc: (a, b) => a.amount - b.amount,
		};
		filtered = filtered.sort(sorters[sortBy] ?? sorters.date_desc);

		const page = filtered.slice(offset, offset + limit);

		return HttpResponse.json({
			transactions: page,
			pagination: {
				total: filtered.length,
				limit,
				offset,
				hasMore: offset + limit < filtered.length,
			},
		});
	}),

	/* Spending Goals */
	http.get('/api/customers/:customerId/goals', ({ request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}
		return HttpResponse.json({
			goals: [
				{
					id: 'goal_001',
					category: 'Entertainment',
					monthlyBudget: 1000.0,
					currentSpent: 650.3,
					percentageUsed: 65.03,
					daysRemaining: 12,
					status: 'on_track',
				},
				{
					id: 'goal_002',
					category: 'Groceries',
					monthlyBudget: 1500.0,
					currentSpent: 1450.8,
					percentageUsed: 96.72,
					daysRemaining: 12,
					status: 'warning',
				},
				{
					id: 'goal_003',
					category: 'Dining',
					monthlyBudget: 1000.0,
					currentSpent: 1070.8,
					percentageUsed: 107.08,
					daysRemaining: 12,
					status: 'exceeded',
				},
				{
					id: 'goal_004',
					category: 'Shopping',
					monthlyBudget: 500.0,
					currentSpent: 320.0,
					percentageUsed: 64.0,
					daysRemaining: 12,
					status: 'on_track',
				},
			],
		});
	}),

	/*Available Categories and Filters */
	http.get('/api/customers/:customerId/filters', ({ request }) => {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.replace('Bearer ', '');
		const username = sessions.get(token);
		if (!username) {
			return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}
		return HttpResponse.json({
			categories: [
				{
					name: 'Groceries',
					color: '#FF6B6B',
					icon: 'shopping-cart',
				},
				{
					name: 'Entertainment',
					color: '#4ECDC4',
					icon: 'film',
				},
				{
					name: 'Transportation',
					color: '#45B7D1',
					icon: 'car',
				},
				{
					name: 'Dining',
					color: '#F7DC6F',
					icon: 'utensils',
				},
				{
					name: 'Shopping',
					color: '#BB8FCE',
					icon: 'shopping-bag',
				},
				{
					name: 'Utilities',
					color: '#85C1E9',
					icon: 'zap',
				},
			],
			dateRangePresets: [
				{
					label: 'Last 7 days',
					value: '7d',
				},
				{
					label: 'Last 30 days',
					value: '30d',
				},
				{
					label: 'Last 90 days',
					value: '90d',
				},
				{
					label: 'Last year',
					value: '1y',
				},
			],
		});
	}),
];
