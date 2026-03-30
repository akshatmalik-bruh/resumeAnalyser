import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';

const Home = () => {
    const { token } = useAuth();

    return (
        <div>
            <Background />
            <section className="hero-section">
                <span className="hero-badge">✦ AI-Powered Resume Intelligence</span>
                <h1 className="hero-title">
                    Land your <span className="text-neon">dream job</span><br />
                    with a smarter resume.
                </h1>
                <p className="hero-sub">
                    Upload your resume, paste the job description, and get an ATS score,
                    interview questions, skill gap analysis, and a tailored PDF — in under 60 seconds.
                </p>
                <div className="hero-actions">
                    {token ? (
                        <Link to="/analyse" className="btn btn-neon btn-xl">
                            <span>Start Analysing →</span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="btn btn-solid btn-lg">Get Started Free</Link>
                            <Link to="/login" className="btn btn-ghost btn-lg">Log In</Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
