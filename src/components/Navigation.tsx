import './Navigation.css';
import { Link } from 'react-router-dom';

const Navigation = () => {
	return (
		<nav className='navigation'>
			<div className='Desktop-Nav'>
				<div className='navigation-logo'>Logo</div>
                <Link to='/'>Dashboard</Link>
                <Link to='/transactions'>Transactions</Link>
				<Link to='/categories'>Categories</Link>
				<Link to='/trends'>Trends</Link>
                <Link to='/budgets'>Budgets</Link>
                <Link to='/profile'>Profile</Link>
				<Link to='/settings'>Settings</Link>
				<Link to='/theme'>Theme</Link>
			</div>

			<div className='Mobile-Nav'>
                <Link to='/'>Home</Link>
                <Link to='/transactions'>Transactions</Link>
                <Link to='/categories'>Analytics</Link>
                <Link to='/budgets'>Budgets</Link>
                <Link to='/profile'>Profile</Link>
			</div>
		</nav>
	);
};

export default Navigation;
