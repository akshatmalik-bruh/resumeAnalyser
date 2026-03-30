import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Background from '../components/Background';
import Loader from '../components/Loader';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/resume/allReports')
            .then(res => setReports(res.data.reports || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div>
            <Background />
            <div className="page-wrap">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <p className="page-title">My Reports</p>
                            <p className="page-sub" style={{ marginBottom: 0 }}>{reports.length} analysis{reports.length !== 1 ? 'es' : ''} completed</p>
                        </div>
                        <Link to="/analyse" className="btn btn-solid">+ New Analysis</Link>
                    </div>

                    {loading ? (
                        <Loader text="Fetching reports" fullPage={false} />
                    ) : reports.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</p>
                            <p style={{ fontWeight: 600, marginBottom: '8px' }}>No reports yet</p>
                            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                                Upload your first resume to get started.
                            </p>
                            <Link to="/analyse" className="btn btn-solid">Start your first analysis</Link>
                        </div>
                    ) : (
                        <div className="reports-grid">
                            {reports.map(r => {
                                const headingText = r.jobDescription ? r.jobDescription.substring(0, 20) + '...' : 'Job Analysis...';

                                return (
                                    <Link to={`/report/${r._id}`} key={r._id} className="report-card">
                                        
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', fontWeight: 600, lineHeight: 1.3, marginBottom: '6px' }}>
                                                {headingText}
                                            </p>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '4px' }}>
                                                ATS Score: <strong style={{ color: '#fff' }}>{r.AtsScore ?? '—'} / 100</strong>
                                            </span>
                                        </div>

                                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{r.createdAt ? formatDate(r.createdAt) : 'View report →'}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>Open →</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
