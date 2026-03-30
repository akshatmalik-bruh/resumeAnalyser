import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Background from '../components/Background';
import Loader from '../components/Loader';

const ResumePreview = () => {
    const { id } = useParams();
    const [htmlContent, setHtmlContent] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                // Fetch the PDF as blob for download, and display via object URL in iframe
                const res = await api.get(`/resume/resumeGenerator/${id}`, {
                    responseType: 'blob'
                });
                const blob = new Blob([res.data], { type: 'application/pdf' });
                setPdfBlob(blob);
                // Create an object URL so we can render it in the iframe
                const url = URL.createObjectURL(blob);
                setHtmlContent(url);
            } catch (err) {
                setError(err.response?.data?.message || 'Could not generate resume. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchResume();

        // Cleanup object URL on unmount
        return () => {
            if (htmlContent) URL.revokeObjectURL(htmlContent);
        };
    }, [id]);

    const handleDownload = () => {
        if (!pdfBlob) return;
        setDownloading(true);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tailored_resume_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloading(false);
    };

    return (
        <div>
            <Background />
            <div className="page-wrap">
                <div className="container" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <p className="page-title">Tailored Resume</p>
                            <p className="page-sub" style={{ marginBottom: 0 }}>AI-optimised for your target job description</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Link to={`/report/${id}`} className="btn btn-ghost btn-sm">← Back to Report</Link>
                            <button
                                className="btn btn-solid"
                                onClick={handleDownload}
                                disabled={!pdfBlob || downloading}
                            >
                                {downloading ? 'Downloading…' : '↓ Download PDF'}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px 0', width: '100%' }}>
                            <Loader text="Generating Resume" fullPage={false} />
                            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '16px' }}>
                                This process takes about 20-30 seconds.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px', width: '100%' }}>
                            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</p>
                            <p style={{ fontWeight: 600, marginBottom: '8px' }}>Couldn't generate resume</p>
                            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '24px' }}>{error}</p>
                            <Link to={`/report/${id}`} className="btn btn-ghost">← Back to Report</Link>
                        </div>
                    ) : (
                        <div className="resume-preview-wrap">
                            <iframe
                                ref={iframeRef}
                                src={htmlContent}
                                className="resume-iframe"
                                title="Tailored Resume Preview"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
