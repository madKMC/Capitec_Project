import { useAuth } from '../context/auth/useAuth';
import './CSS/Login.css';

const Login = () => {
    const { login } = useAuth();

    return (
        <div className='login-page'>
            <div className='login-card'>
                <h1>Finance Insight Overview</h1>
                <p className='login-subtitle'>Select an account to continue</p>

                <div className='login-users'>
                    <button className='login-user-btn' onClick={() => login('alice')}>
                        <span className='login-user-name'>Alice Smith</span>
                        <span className='login-user-type'>Standard</span>
                    </button>
                    <button className='login-user-btn' onClick={() => login('bob')}>
                        <span className='login-user-name'>Bob Jones</span>
                        <span className='login-user-type'>Premium</span>
                    </button>
                    <button className='login-user-btn' onClick={() => login('john')}>
                        <span className='login-user-name'>John Doe</span>
                        <span className='login-user-type'>Premium</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;