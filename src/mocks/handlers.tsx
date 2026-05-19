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

/* Simple session store */
const sessions = new Map<string, string>();
const createToken = (username: string) => {
	const token = `mock-token-${username}-${Date.now()}`;
	sessions.set(token, username);
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
		return HttpResponse.json({
			period: period,
			totalSpent: 4250.75,
			transactionCount: 47,
			averageTransaction: 90.44,
			topCategory: 'Groceries',
			comparedToPrevious: {
				spentChange: 12.5,
				transactionChange: -3.2,
			},
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
		const user = users[username];
		if (!user) {
			return HttpResponse.json({ message: 'Not found' }, { status: 404 });
		}
		return HttpResponse.json({
			dateRange: {
				startDate: '2024-08-16',
				endDate: '2024-09-16',
			},
			totalAmount: 4250.75,
			categories: [
				{
					name: 'Groceries',
					amount: 1250.3,
					percentage: 29.4,
					transactionCount: 15,
					color: '#FF6B6B',
					icon: 'shopping-cart',
				},
				{
					name: 'Entertainment',
					amount: 890.2,
					percentage: 20.9,
					transactionCount: 8,
					color: '#4ECDC4',
					icon: 'film',
				},
				{
					name: 'Transportation',
					amount: 680.45,
					percentage: 16.0,
					transactionCount: 12,
					color: '#45B7D1',
					icon: 'car',
				},
				{
					name: 'Dining',
					amount: 520.3,
					percentage: 12.2,
					transactionCount: 9,
					color: '#F7DC6F',
					icon: 'utensils',
				},
				{
					name: 'Shopping',
					amount: 450.8,
					percentage: 10.6,
					transactionCount: 6,
					color: '#BB8FCE',
					icon: 'shopping-bag',
				},
				{
					name: 'Utilities',
					amount: 458.7,
					percentage: 10.8,
					transactionCount: 3,
					color: '#85C1E9',
					icon: 'zap',
				},
			],
		});
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
		return HttpResponse.json({
			trends: [
				{
					month: '2024-01',
					totalSpent: 3890.25,
					transactionCount: 42,
					averageTransaction: 92.62,
				},
				{
					month: '2024-02',
					totalSpent: 4150.8,
					transactionCount: 38,
					averageTransaction: 109.23,
				},
				{
					month: '2024-03',
					totalSpent: 3750.6,
					transactionCount: 45,
					averageTransaction: 83.35,
				},
				{
					month: '2024-04',
					totalSpent: 4200.45,
					transactionCount: 39,
					averageTransaction: 107.7,
				},
				{
					month: '2024-05',
					totalSpent: 3980.3,
					transactionCount: 44,
					averageTransaction: 90.46,
				},
				{
					month: '2024-06',
					totalSpent: 4250.75,
					transactionCount: 47,
					averageTransaction: 90.44,
				},
			],
		});
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
		return HttpResponse.json({
			transactions: [
				{
					id: 'txn_123456',
					date: '2024-09-16T14:30:00Z',
					merchant: 'Pick n Pay',
					category: 'Groceries',
					amount: 245.8,
					description: 'Weekly groceries',
					paymentMethod: 'Credit Card',
					icon: 'shopping-cart',
					categoryColor: '#FF6B6B',
				},
				{
					id: 'txn_123457',
					date: '2024-09-15T10:15:00Z',
					merchant: 'Netflix',
					category: 'Entertainment',
					amount: 199.0,
					description: 'Monthly subscription',
					paymentMethod: 'Debit Order',
					icon: 'film',
					categoryColor: '#4ECDC4',
				},
			],
			pagination: {
				total: 1250,
				limit: 20,
				offset: 0,
				hasMore: true,
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
