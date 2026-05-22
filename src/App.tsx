import './App.css';
import Header from './components/Header';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { AuthProvider } from './context/auth/AuthProvider';
import { ThemeProvider } from './context/theme/ThemeProvider';
import { useAuth } from './context/auth/useAuth';
import Login from './pages/Login';

function App() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<Router>
					<AppRoutes />
				</Router>
			</ThemeProvider>
		</AuthProvider>
	);
}

function AppRoutes() {
	const { user, isInitializing } = useAuth();

	return (
		<div className='App'>
			<main className='main-content'>
				<Header />
				{isInitializing ? (
					<div className='loading' role='status' aria-live='polite'
					>
						Loading...
					</div>
				) : user ? (
					<Routes>
						<Route path='/' Component={Dashboard} />
						<Route path='/profile' Component={Profile} />
					</Routes>
				) : (
					<Login />
				)}
			</main>
		</div>
	);
}

export default App;
