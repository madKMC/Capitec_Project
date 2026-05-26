import {
	FaUserCircle,
	FaSignOutAlt,
	FaSun,
	FaMoon,
	FaUser,
} from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth';
import { useTheme } from '../../context/theme/useTheme';
import './Header.css';

const Header = () => {
	const { user, logout } = useAuth();
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
				<h1 className='brand'>Finance Insight Overview</h1>
			</div>

			<div className='header-actions'>
				<button
					className='icon-button'
					onClick={toggleTheme}
					aria-label={
						theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
					}
				>
					{theme === 'dark' ? <FaSun /> : <FaMoon />}
				</button>

				{user && (
					<div className='profile-wrapper'>
						<button
							className='icon-button profile'
							onClick={() => setOpen((p) => !p)}
							aria-label='Profile menu'
							aria-expanded={open}
							aria-haspopup='menu'
						>
							<FaUserCircle aria-hidden='true' />
						</button>

						{open && (
							<div
								className='dropdown'
								role='menu'
								aria-label='Profile options'
								onKeyDown={(e) => {
									if (e.key === 'Escape') {
										setOpen(false);
									}
								}}
							>
								{user && (
									<>
										<div className='active-user'>
											<p>{user.name}</p>
											<span>{user.accountType}</span>
										</div>

										<div className='dropdown-actions'>
											<button
												className='dropdown-item profile-action'
												onClick={handleViewProfile}
												role='menuitem'
												tabIndex={0}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														handleViewProfile();
													}
												}}
											>
												<FaUser aria-hidden='true' />
												View Profile
											</button>

											<button
												className='dropdown-item logout'
												onClick={logout}
												role='menuitem'
												tabIndex={0}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														logout();
													}
												}}
											>
												<FaSignOutAlt aria-hidden='true' />
												Logout
											</button>
										</div>
									</>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
