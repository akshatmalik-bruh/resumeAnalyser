import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analyse from './pages/Analyse';
import ReportDetails from './pages/ReportDetails';
import ResumePreview from './pages/ResumePreview';
import Navbar from './components/Navbar';

// Simple protected route
const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/analyse" element={
                        <PrivateRoute>
                            <Analyse />
                        </PrivateRoute>
                    } />
                    <Route path="/report/:id" element={
                        <PrivateRoute>
                            <ReportDetails />
                        </PrivateRoute>
                    } />
                    <Route path="/resume-preview/:id" element={
                        <PrivateRoute>
                            <ResumePreview />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
