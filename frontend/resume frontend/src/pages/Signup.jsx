import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';
import Loader from '../components/Loader';

const Signup = () => {
    const [username, setUsername] = useState('');
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
            const res = await api.post('/auth/register', { username, email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
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
                        <h1>Join us to level up your ATS game today.</h1>
                        <p>Create a free account to instantly compare your resume against any job description, pinpoint skill gaps, and land more interviews.</p>
                    </div>

                    {/* Right Side Form */}
                    <div className="auth-right">
                        <form className="form-card" onSubmit={handleSubmit}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '8px', color: '#fff' }}>Create your account</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '28px' }}>Start getting smarter about your job search</p>
                            
                            {error && <p className="form-error" style={{ marginBottom: '16px' }}>{error}</p>}
                            
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input className="form-input" type="text" placeholder="johndoe" value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email address</label>
                                <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input className="form-input" type="password" placeholder="Min 6 chars, 1 number, uppercase" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-solid" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account →'}
                            </button>
                            
                            {loading && <Loader text="Initialising" />}
                            
                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                <p className="form-link" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    Already have an account? <Link to="/login" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;
