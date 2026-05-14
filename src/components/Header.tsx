import React from 'react';
import './Header.css';
import { FaBell, FaUser, FaSearch } from 'react-icons/fa';

const Header = () => {
	return (
		<header>
			<form className='header-form'>
				<div className='search-bar'>
					<input type='text' placeholder='Search...' />
					<button type='submit'><FaSearch /></button>
				</div>

				<div className='profile-actions'>
					<button type='button'><FaBell /></button>
					<button type='button'><FaUser /></button>
				</div>
			</form>
		</header>
	);
};

export default Header;
