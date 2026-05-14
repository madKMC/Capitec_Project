import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Trends from './pages/Trends';
import Budgets from './pages/Budgets';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Theme from './pages/Theme';

function App() {
	return (
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
						<Route path='/budgets' Component={Budgets} />
						<Route path='/profile' Component={Profile} />
						<Route path='/settings' Component={Settings} />
						<Route path='/theme' Component={Theme} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
