import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Background from '../components/Background';
import Loader from '../components/Loader';

const Analyse = () => {
    const [file, setFile] = useState(null);
    const [selfDescription, setSelfDescription] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please upload your resume PDF.');

        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('selfDescription', selfDescription);
        formData.append('jobDescription', jobDescription);

        try {
            const res = await api.post('/resume/generateReport', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(`/report/${res.data.InterviewReport._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            <Background />
            <div className="center-content" style={{ padding: '100px 20px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Analyse Resume</h1>
                </div>

                <form className="form-card" style={{ maxWidth: '850px', width: '100%', padding: '32px' }} onSubmit={handleSubmit}>
                    {error && <div className="form-error" style={{ marginBottom: '12px' }}>{error}</div>}

                    <div className="analyse-form-grid">
                        <div className="analyse-left">
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label className="form-label">Upload Resume (PDF)</label>
                                <input className="form-input" type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} style={{ padding: '8px' }} />
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label className="form-label">Tell us about yourself</label>
                                <textarea 
                                    className="form-input" 
                                    rows="3" 
                                    placeholder="Brief professional summary..." 
                                    value={selfDescription} 
                                    onChange={e => setSelfDescription(e.target.value)} 
                                    required 
                                    style={{ minHeight: '90px' }}
                                />
                            </div>
                        </div>

                        <div className="analyse-right" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="form-group" style={{ marginBottom: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label className="form-label">Job Description / Role Details</label>
                                <textarea 
                                    className="form-input" 
                                    placeholder="Paste the requirements here..." 
                                    value={jobDescription} 
                                    onChange={e => setJobDescription(e.target.value)} 
                                    required 
                                    style={{ flex: 1, minHeight: '180px', resize: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-neon btn-xl" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Analyse Resume →'}
                    </button>
                    
                    {loading && <Loader text="Analysing Resume" />}
                </form>
            </div>
        </div>
    );
};

export default Analyse;
