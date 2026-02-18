import "./MainPage.css";

function MainPage({ onEnterLab2 }) {
    return (
        <div className="main-page">
            {/* ── NAVBAR ── */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <span className="brand-name">Quantize</span>
                </div>

                <div className="navbar-member">
                    <img
                        src="/member-photo.jpg"
                        alt="M. Sanjana"
                        className="member-photo"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="member-info">
                        <span className="member-name">M. Sanjana</span>
                        <span className="member-roll">CB.SC.U4CSE23528</span>
                    </div>
                </div>

                <div className="navbar-labs">
                    <a
                        href="https://msanjana041.github.io/yes_or_no_decision_maker/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lab-btn lab-btn--outline"
                    >
                        Lab 1
                    </a>
                    <button className="lab-btn lab-btn--filled" onClick={onEnterLab2}>
                        Lab 2
                    </button>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Quantize
                        <span className="hero-subtitle"> — Math, Reimagined for Every Mind</span>
                    </h1>
                    <p className="hero-desc">
                        A number-puzzle game designed to make arithmetic intuitive, engaging,
                        and accessible — especially for children on the autism spectrum.
                    </p>
                    <button className="cta-btn" onClick={onEnterLab2}>
                        Play Now →
                    </button>
                </div>
                <div className="hero-visual">
                    <div className="puzzle-preview">
                        <div className="preview-target">Target: <strong>24</strong></div>
                        <div className="preview-tiles">
                            {[4, 6, 1].map((n) => (
                                <span key={n} className="preview-tile">{n}</span>
                            ))}
                        </div>
                        <div className="preview-ops">
                            {["+", "×", "−"].map((op) => (
                                <span key={op} className="preview-op">{op}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section className="section about-section">
                <h2 className="section-title">Empowering Kids with Autism</h2>
                <div className="about-grid">
                    <div className="about-card">
                        <div className="about-icon">🧩</div>
                        <h3>Structured Play</h3>
                        <p>
                            Quantize uses clear, predictable rules that align with the
                            preference for routine and structure common in autistic learners.
                        </p>
                    </div>
                    <div className="about-card">
                        <div className="about-icon">🎯</div>
                        <h3>Goal-Oriented</h3>
                        <p>
                            Every puzzle has a single, well-defined target — reducing
                            ambiguity and giving children a clear sense of achievement.
                        </p>
                    </div>
                    <div className="about-card">
                        <div className="about-icon">🔢</div>
                        <h3>Number Fluency</h3>
                        <p>
                            By combining numbers with operators to reach a target, children
                            naturally build arithmetic confidence at their own pace.
                        </p>
                    </div>
                    <div className="about-card">
                        <div className="about-icon">💡</div>
                        <h3>Immediate Feedback</h3>
                        <p>
                            Instant, non-judgmental feedback helps children learn from
                            mistakes without frustration, reinforcing positive engagement.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── WHAT IS QUANTIZE ── */}
            <section className="section product-section">
                <h2 className="section-title">What is Quantize?</h2>
                <div className="product-body">
                    <p>
                        <strong>Quantize</strong> is a browser-based arithmetic puzzle game
                        where players are given three numbers and two operators to combine
                        them in order to reach a randomly generated target number.
                    </p>
                    <p>
                        The game is built with a <strong>React</strong> frontend and an
                        <strong> Express</strong> backend. The server generates solvable
                        puzzles and validates player solutions, ensuring every challenge is
                        fair and achievable.
                    </p>
                    <p>
                        Our aim is to create a low-pressure, high-reward environment that
                        makes mathematics feel like play — particularly beneficial for
                        children with Autism Spectrum Disorder (ASD) who thrive with
                        structured, repetitive, and goal-focused activities.
                    </p>
                </div>
            </section>

            {/* ── COURSE DETAILS ── */}
            <section className="section course-section">
                <h2 className="section-title">Course Details</h2>
                <div className="course-card">
                    <div className="course-row">
                        <span className="course-label">Course Code</span>
                        <span className="course-value">23CSE461</span>
                    </div>
                    <div className="course-row">
                        <span className="course-label">Course Name</span>
                        <span className="course-value">Full Stack Frameworks</span>
                    </div>
                    <div className="course-divider" />
                    <div className="course-teacher">
                        <div className="teacher-name">Dr. T. Senthil Kumar</div>
                        <div className="teacher-title">Professor</div>
                        <div className="teacher-inst">Amrita School of Computing</div>
                        <div className="teacher-inst">Amrita Vishwa Vidyapeetham</div>
                        <div className="teacher-inst">Coimbatore – 641 112</div>
                        <a
                            href="mailto:t_senthilkumar@cb.amrita.edu"
                            className="teacher-email"
                        >
                            t_senthilkumar@cb.amrita.edu
                        </a>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="footer">
                <p>© 2025 Quantize · M. Sanjana · CB.SC.U4CSE23528</p>
            </footer>
        </div>
    );
}

export default MainPage;
