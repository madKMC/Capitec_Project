import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Trends from './pages/Trends';
import Profile from './pages/Profile';
import { AuthProvider } from './context/auth/AuthProvider';
import SpendingGoals from './pages/Goals';
import { ThemeProvider } from './context/theme/ThemeProvider';

function App() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<Router>
					<div className='App'>
						<Navigation></Navigation>

						<main className='main-content'>
							<Header></Header>
							<Routes>
								<Route path='/' Component={Dashboard} />
								<Route path='/transactions' Component={Transactions} />
								<Route path='/categories' Component={Categories} />
								<Route path='/trends' Component={Trends} />
								<Route path='/goals' Component={SpendingGoals} />
								<Route path='/profile' Component={Profile} />
							</Routes>
						</main>
					</div>
				</Router>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
