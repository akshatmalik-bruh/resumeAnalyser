import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Background from '../components/Background';
import Loader from '../components/Loader';

/* ── Accordion Question Item ───────────────────────────────── */
const QuestionItem = ({ q, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="q-item">
            <div className="q-header" onClick={() => setOpen(!open)}>
                <span className="q-text">{index + 1}. {q.question}</span>
                <span className={`q-chevron ${open ? 'open' : ''}`}>▾</span>
            </div>
            <div className={`q-body ${open ? 'open' : ''}`}>
                <div className="q-body-inner">
                    <p className="q-intention">💡 {q.intention}</p>
                    <p className="q-answer">{q.answer}</p>
                </div>
            </div>
        </div>
    );
};

/* ── Score Ring Component ──────────────────────────────────── */
const ScoreRing = ({ score }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let frame;
        let current = 0;
        const increment = () => {
            current += 1;
            setDisplay(current);
            if (current < score) frame = requestAnimationFrame(increment);
        };
        const delay = setTimeout(() => { frame = requestAnimationFrame(increment); }, 400);
        return () => { clearTimeout(delay); cancelAnimationFrame(frame); };
    }, [score]);

    return (
        <div className="score-ring-wrap">
            <div className="score-ring" style={{ '--p': display }}>
                <span className="score-num">{display}</span>
                <span className="score-denom">out of 100</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ATS Match Score</p>
        </div>
    );
};

/* ── Main Report Page ──────────────────────────────────────── */
const ReportDetails = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stage, setStage] = useState(0); // 0 = loading, 1 = score, 2 = gaps, 3 = questions
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/resume/getReportById/${id}`)
            .then(res => {
                setReport(res.data.report);
                setStage(1);
                // Auto-advance: skill gaps after 1.5s, questions after 3s
                setTimeout(() => setStage(2), 1500);
                setTimeout(() => setStage(3), 3000);
            })
            .catch(err => setError(err.response?.data?.message || 'Report not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Background />
            <Loader text="Decrypting Analysis" />
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
            <Background />
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</p>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>Couldn't load report</p>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{error}</p>
            <Link to="/dashboard" className="btn btn-ghost">← Back to dashboard</Link>
        </div>
    );

    const pillClass = (level) => `skill-pill ${level === 'hard' ? 'pill-hard' : level === 'medium' ? 'pill-medium' : 'pill-easy'}`;

    return (
        <div>
            <Background />
            <div className="page-wrap">
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* ── Top Row: Score, Gaps, PDF Preview ── */}
                    {stage >= 1 && (
                        <div className="stats-row">
                            {/* Score (Revolves and moves) */}
                            <div className={`stats-col-score ${stage === 1 ? 'score-center' : ''}`}>
                                <ScoreRing score={report.AtsScore || 0} />
                            </div>
                            
                            {/* Skill Gaps (Fades in) */}
                            <div className={`stats-col-gaps reveal-fade ${stage >= 2 ? 'visible' : ''}`}>
                                <p className="stats-label">Skill Gaps Identified</p>
                                <div className="skill-grid">
                                    {report.skillGap?.map((s, i) => (
                                        <span key={i} className={pillClass(s.level)}>
                                            {s.skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tailored Resume CTA (Fades in, placed to the right) */}
                            <div className={`stats-col-cta reveal-fade glass-card ${stage >= 2 ? 'visible' : ''}`} style={{ padding: '24px' }}>
                                <p className="stats-label" style={{ color: '#fff', fontSize: '0.95rem' }}>Tailored Resume</p>
                                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '16px', lineHeight: '1.4' }}>
                                    ATS-optimised PDF specifically generated for this role.
                                </p>
                                <Link to={`/resume-preview/${id}`} className="btn btn-solid" style={{ width: '100%', justifyContent: 'center' }}>
                                    Preview PDF →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── Stage 3: Job Description & Questions (Fades in) ── */}
                    <div className={`reveal-fade ${stage >= 3 ? 'visible' : ''}`} style={{ width: '100%' }}>
                        <div className="section-divider" />

                        <div className="glass-card" style={{ marginBottom: '48px', padding: '32px' }}>
                            <p className="stats-label" style={{ marginBottom: '16px' }}>Analyzed Job Description</p>
                            <div className="custom-scrollbar" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.7', maxHeight: '200px', overflowY: 'auto', paddingRight: '16px', whiteSpace: 'pre-wrap' }}>
                                {report.jobDescription || 'No job description provided.'}
                            </div>
                        </div>

                        <p className="stats-label" style={{ textAlign: 'center' }}>Technical Questions</p>
                        <div className="questions-list" style={{ marginBottom: '32px' }}>
                            {report.technicalQuestions?.map((q, i) => (
                                <QuestionItem key={i} q={q} index={i} />
                            ))}
                        </div>

                        <p className="stats-label" style={{ textAlign: 'center' }}>Behavioural Questions</p>
                        <div className="questions-list" style={{ marginBottom: '48px' }}>
                            {report.behavioralQuestions?.map((q, i) => (
                                <QuestionItem key={i} q={q} index={i} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
