import { render, screen } from '@testing-library/react';
import AppRoutes from './App';
import { it, expect, vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

let authState = {
	user: null as null | {
		customerId: string;
		name: string;
		accountType: string;
	},
	isInitializing: true,
};

vi.mock('./context/auth/useAuth', () => ({
	useAuth: () => authState,
}));

vi.mock('./context/theme/useTheme', () => ({
	useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

it('renders loading indicator while initializing', () => {
	authState = { user: null, isInitializing: true };

	render(React.createElement(AppRoutes));
	expect(screen.getByRole('status')).toHaveTextContent('Loading...');
});

it('renders Login when there is no authenticated user', () => {
	authState = { user: null, isInitializing: false };

	render(React.createElement(AppRoutes));
	expect(
		screen.getByRole('list', { name: /list of user accounts/i }),
	).toBeInTheDocument();
});

vi.mock('./pages/Dashboard/Dashboard', () => ({
	default: () => React.createElement('h1', null, 'Dashboard'),
}));

vi.mock('./pages/Profile/Profile', () => ({
	default: () => React.createElement('div', null, 'Profile Page'),
}));

it('renders Dashboard and Profile routes when user is authenticated', () => {
	authState = {
		user: { customerId: '1', name: 'Alice', accountType: 'standard' },
		isInitializing: false,
	};

	render(React.createElement(AppRoutes));
	expect(
		screen.getByRole('heading', { name: /dashboard/i }),
	).toBeInTheDocument();

	window.history.pushState({}, '', '/profile');
	render(React.createElement(AppRoutes));
	expect(screen.getByText(/profile page/i)).toBeInTheDocument();
});

it('renders profile page at /profile for authenticated user', () => {
	render(React.createElement(AppRoutes));
	expect(screen.getByText(/profile page/i)).toBeInTheDocument();
});
