import './CSS/Navigation.css';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
	return (
		<nav className='navigation'>
			<div className='desktop-nav'>
				<div className='navigation-logo'>CSID</div>
                <NavLink to='/'>Dashboard</NavLink>
                <NavLink to='/transactions'>Transactions</NavLink>
				<NavLink to='/categories'>Categories</NavLink>
				<NavLink to='/trends'>Trends</NavLink>
				<NavLink to='/goals'>Goals</NavLink>
			</div>

			<div className='mobile-nav'>
                <NavLink to='/' >Dashboard</NavLink>
                <NavLink to='/transactions'>Transactions</NavLink>
                <NavLink to='/categories'>Categories</NavLink>
				<NavLink to='/trends'>Trends</NavLink>
				<NavLink to='/goals'>Goals</NavLink>
			</div>
		</nav>
	);
};

export default Navigation;
