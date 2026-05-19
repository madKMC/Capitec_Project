import {
	FaUserCircle,
	FaSignOutAlt,
	FaSun,
	FaMoon,
	FaUser,
} from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/useAuth';
import { useTheme } from '../context/theme/useTheme';
import './CSS/Header.css';

const Header = () => {
	const { user, login, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();

	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	const handleViewProfile = () => {
		navigate('/profile');
		setOpen(false);
	};

	return (
		<header className='header'>
			<div className='header-left'>
				<span className='brand'>
					Finance Insight Overview
				</span>
			</div>

			<div className='header-actions'>
				<button
					className='icon-button'
					onClick={toggleTheme}
					aria-label='Toggle theme'
				>
					{theme === 'dark' ? (
						<FaSun />
					) : (
						<FaMoon />
					)}
				</button>

				<div className='profile-wrapper'>
					<button
						className='icon-button profile'
						onClick={() => setOpen((p) => !p)}
						aria-label='Profile menu'
					>
						<FaUserCircle />
					</button>

					{open && (
						<div className='dropdown'>
							<div className='dropdown-section'>
								<p className='dropdown-label'>
									Switch User
								</p>

								<button
									className='dropdown-item'
									onClick={() =>
										login('alice')
									}
								>
									Alice
								</button>

								<button
									className='dropdown-item'
									onClick={() =>
										login('bob')
									}
								>
									Bob
								</button>

								<button
									className='dropdown-item'
									onClick={() =>
										login('john')
									}
								>
									John
								</button>
							</div>

							{user && (
								<>
									<hr className='dropdown-divider' />

									<div className='active-user'>
										<p>{user.name}</p>
										<span>
											{user.accountType}
										</span>
									</div>

									<div className='dropdown-actions'>
										<button
											className='dropdown-item profile-action'
											onClick={
												handleViewProfile
											}
										>
											<FaUser />
											View Profile
										</button>

										<button
											className='dropdown-item logout'
											onClick={logout}
										>
											<FaSignOutAlt />
											Logout
										</button>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;