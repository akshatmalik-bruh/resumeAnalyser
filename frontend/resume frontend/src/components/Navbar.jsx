import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { token, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const close = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="logo" onClick={close}>ResAnalyse</Link>

            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                {!token ? (
                    <>
                        <Link to="/login" className="nav-link" onClick={close}>Log In</Link>
                        <Link to="/signup" className="nav-link-cta" onClick={close}>Get Started</Link>
                    </>
                ) : (
                    <>
                        <Link to="/analyse" className={`nav-link ${location.pathname === '/analyse' ? 'active-link' : ''}`} onClick={close}>Analyse</Link>
                        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active-link' : ''}`} onClick={close}>Resumes</Link>
                        <button
                            className="nav-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                            onClick={() => { logout(); close(); }}
                        >
                            Log out
                        </button>
                    </>
                )}
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span style={{ transform: isOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                <span style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'scaleX(0)' : 'none' }} />
                <span style={{ transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none' }} />
            </div>
        </nav>
    );
};

export default Navbar;
