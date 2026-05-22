import { useAuth } from '../context/auth/useAuth';
import './CSS/Login.css';

const Login = () => {
    const { login } = useAuth();

    return (
        <main className='login-page'>
            <div className='login-card'>
                <h1>Finance Insight Overview</h1>
                <p className='login-subtitle'>Select an account to continue</p>

                <div className='login-users' role='list' aria-label='List of user accounts'>
                    <button className='login-user-btn' onClick={() => login('alice')} role='listitem' aria-label='Login as Alice Smith, Standard user'>
                        <span className='login-user-name'>Alice Smith</span>
                        <span className='login-user-type'>Standard</span>
                    </button>
                    <button className='login-user-btn' onClick={() => login('bob')} role='listitem' aria-label='Login as Bob Jones, Premium user'>
                        <span className='login-user-name'>Bob Jones</span>
                        <span className='login-user-type'>Premium</span>
                    </button>
                    <button className='login-user-btn' onClick={() => login('john')} role='listitem' aria-label='Login as John Doe, Premium user'>
                        <span className='login-user-name'>John Doe</span>
                        <span className='login-user-type'>Premium</span>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Login;