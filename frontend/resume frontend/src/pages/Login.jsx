import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';
import Loader from '../components/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Background />
            <div className="page-wrap" style={{ justifyContent: 'center', padding: '100px 24px 60px' }}>
                <div className="auth-grid">
                    
                    {/* Left Side Marketing Text */}
                    <div className="auth-left">
                        <h1>You will be able to analyse the resume shortly.</h1>
                        <p>Sign in to unlock AI-powered insights, ATS match scoring, and tailored interview prep that lands you the job.</p>
                    </div>

                    {/* Right Side Form */}
                    <div className="auth-right">
                        <form className="form-card" onSubmit={handleSubmit}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '8px', color: '#fff' }}>Welcome back</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '28px' }}>Log in to your ResAnalyse account</p>
                            
                            {error && <p className="form-error" style={{ marginBottom: '16px' }}>{error}</p>}
                            
                            <div className="form-group">
                                <label className="form-label">Email address</label>
                                <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-solid" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
                                {loading ? 'Logging in...' : 'Log In →'}
                            </button>
                            
                            {loading && <Loader text="Authenticating" />}
                            
                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                <p className="form-link" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    Don't have an account? <Link to="/signup" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
