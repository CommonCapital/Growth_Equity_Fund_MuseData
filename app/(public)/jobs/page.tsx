"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";

/* ─── Fade/Reveal via IntersectionObserver ─── */
function Fade({
  children,
  delay = 0,
  style,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade ${className}`} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

const JOBS = [
  {
    id: "senior-investment-analyst",
    title: "Senior Investment Analyst",
    department: "Investments",
    location: "New York / Remote",
    type: "Full-time",
    summary: "Lead proprietary diligence on enterprise software and AI companies. Build financial models, conduct customer interviews, and synthesize evidence into investment recommendations.",
    requirements: [
      "5+ years in growth equity, venture capital, or investment banking",
      "Deep understanding of SaaS metrics, unit economics, and enterprise software business models",
      "Exceptional financial modeling and analytical skills",
      "Strong written and verbal communication; ability to distill complex analysis into clear recommendations",
      "Bachelor's degree in Finance, Economics, or related field; MBA or CFA preferred",
    ],
    niceToHave: [
      "Operating experience at a high-growth enterprise software company",
      "Technical background or ability to evaluate AI/ML technologies",
      "Existing network in the enterprise software ecosystem",
    ],
  },
  {
    id: "portfolio-operations-lead",
    title: "Portfolio Operations Lead",
    department: "Strategic Resource Group",
    location: "Los Angeles / Remote",
    type: "Full-time",
    summary: "Embed directly with portfolio companies to build financial infrastructure, implement reporting cadence, and advise on GTM strategy. Be the operational backbone behind institutional-grade scaling.",
    requirements: [
      "7+ years in operational roles at high-growth startups or growth equity firms",
      "Experience building finance, data, or GTM infrastructure from 0→1 or 1→10",
      "Strong project management and cross-functional leadership skills",
      "Ability to work autonomously and adapt to different company cultures",
      "Bachelor's degree required; MBA or relevant advanced degree preferred",
    ],
    niceToHave: [
      "Former founder or early employee at a scaled enterprise software company",
      "Experience with institutional reporting, board preparation, or sponsor processes",
      "Background in data engineering, RevOps, or financial planning & analysis",
    ],
  },
  {
    id: "investor-relations-associate",
    title: "Investor Relations Associate",
    department: "Capital Formation",
    location: "London / Remote",
    type: "Full-time",
    summary: "Support LP communications, co-investment processes, and fund reporting. Help build the institutional relationships that power MUSEDATA's unique value proposition.",
    requirements: [
      "3+ years in investor relations, private capital fundraising, or institutional sales",
      "Understanding of private markets, fund structures, and LP expectations",
      "Exceptional attention to detail and ability to manage complex workflows",
      "Strong interpersonal skills and discretion with confidential information",
      "Bachelor's degree in Finance, Business, or related field",
    ],
    niceToHave: [
      "Experience at a growth equity firm, family office, or institutional LP",
      "Familiarity with CRM systems and investor reporting tools",
      "Multilingual capabilities or international experience",
    ],
  },
];

const LOGO_B64 = "data:image/png;base64,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";

export default function JobsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openJob, setOpenJob] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 15px; }
        :root {
          --nav-bg: #f6f8f8; --nav-text: #b5c9ce; --nav-active: #1c3342; --nav-border: #dce4e8;
          --hero-bg: #092e42; --hero-h1: #ffffff; --hero-body: rgba(255,255,255,0.55);
          --hero-label: #5997b0; --hero-line: #5997b0; --section-bg: #f1f7fa;
          --section-white: #ffffff; --card-border: #5e96aa; --label-color: #7a9daa;
          --h2-color: #0d2b3a; --body-color: #3a5a6a; --bullet-color: #5997b0;
          --list-text: #3a5464; --divider: #d4e4eb; --cta-bg: #092e42;
          --cta-accent: #39a2ca; --cta-body: rgba(255,255,255,0.65);
          --btn-bg: #39a2ca; --btn-text: #ffffff; --btn-fine: #4a6e7e;
          --footer-bg: #092e42; --footer-text: rgba(255,255,255,0.55);
          --footer-links: rgba(255,255,255,0.35);
          --ff: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        ::selection { background: rgba(57,162,202,0.2); }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: var(--hero-label); }
        body {
          background: var(--section-white); color: var(--h2-color);
          font-family: var(--ff); font-weight: 400; line-height: 1.65;
          -webkit-font-smoothing: antialiased; overflow-x: hidden; padding-bottom: 64px;
        }
        @media(max-width:768px){ body { padding-bottom: 120px; } }
        @media(max-width:480px){ body { padding-bottom: 140px; } }
        .w { max-width: 1200px; margin: 0 auto; padding: 0 56px; }
        @media(max-width:900px){ .w { padding: 0 32px; } }
        @media(max-width:640px){ .w { padding: 0 20px; } }
        .fade { opacity: 0; transform: translateY(22px); transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1); }
        .fade.in { opacity: 1; transform: none; }
        /* Header */
        #jobs-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
          transition: box-shadow 0.3s;
        }
        #jobs-header.scrolled { box-shadow: 0 2px 24px rgba(9,46,66,0.08); }
        .header-inner {
          display: flex; align-items: center; height: 82px;
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
        }
        @media(max-width:900px){ .header-inner { padding: 0 32px; } }
        .header-logo {
          display: flex; align-items: center; gap: 12px; text-decoration: none;
          flex-shrink: 0; margin-right: 52px; line-height: 1;
        }
        .header-mark { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .header-mark img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .header-word { font-size: 0.933rem; font-weight: 700; letter-spacing: 0.22em; color: var(--nav-active); text-transform: uppercase; line-height: 1; white-space: nowrap; }
        .header-tag {
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--label-color); background: var(--section-bg); padding: 6px 14px; border-radius: 999px;
        }
        /* Hero */
        #jobs-hero {
          min-height: 50vh; padding-top: 82px; background: var(--hero-bg);
          display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;
        }
        .hero-bg-img {
          position: absolute; inset: 0; background-image: url('/background.png');
          background-size: cover; background-position: center; opacity: 0.08; pointer-events: none;
        }
        .hero-inner { padding: 96px 56px 108px; position: relative; z-index: 1; text-align: left; max-width: 720px; }
        .hero-label-row { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; opacity: 0; animation: up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }
        .hero-label-line { width: 32px; height: 1px; background: var(--hero-line); }
        .hero-label-text { font-size: 0.667rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--hero-label); }
        .hero-h1 {
          font-family: var(--ff); font-size: clamp(2rem,3.8vw,3rem); font-weight: 300;
          line-height: 1.2; letter-spacing: -0.01em; color: var(--hero-h1); text-align: left;
          opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.22s forwards;
        }
        .hero-h1 .accent { color: var(--cta-accent); }
        .hero-body {
          margin-top: 2rem; max-width: 580px; font-size: 0.933rem; font-weight: 400;
          line-height: 1.75; color: var(--hero-body); opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.38s forwards;
        }
        @keyframes up { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: none; } }
        /* Job Listings */
        .jobs-section { padding: 72px 0; border-top: 1px solid var(--divider); background: var(--section-white); }
        .section-label {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
          font-size: 0.633rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--hero-label);
        }
        .section-label::before { content: ''; width: 28px; height: 1px; background: var(--hero-label); display: block; }
        .section-title {
          font-family: var(--ff); font-size: clamp(1.6rem,2.8vw,2.2rem); font-weight: 300;
          line-height: 1.15; letter-spacing: -0.01em; color: var(--h2-color); margin-bottom: 32px;
        }
        .job-card {
          background: var(--section-white); border: 1.5px solid var(--divider);
          border-radius: 14px; padding: 32px; margin-bottom: 24px;
          transition: border-color 0.25s, box-shadow 0.25s; cursor: pointer;
        }
        .job-card:hover { border-color: var(--hero-label); box-shadow: 0 4px 24px rgba(9,46,66,0.06); }
        .job-card.expanded { border-color: var(--hero-label); }
        .job-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
        .job-title { font-family: var(--ff); font-size: 1.2rem; font-weight: 500; color: var(--h2-color); margin-bottom: 8px; }
        .job-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
        .job-meta span {
          font-size: 0.733rem; font-weight: 500; color: var(--label-color);
          background: var(--section-bg); padding: 4px 12px; border-radius: 999px;
        }
        .job-summary { font-size: 0.867rem; color: var(--body-color); line-height: 1.7; margin-bottom: 16px; }
        .job-toggle {
          font-size: 0.667rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--hero-label); background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 8px; transition: gap 0.2s;
        }
        .job-toggle:hover { gap: 14px; }
        .job-details {
          margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--divider);
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
        }
        @media(max-width:768px){ .job-details { grid-template-columns: 1fr; } }
        .details-col h4 {
          font-size: 0.733rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--label-color); margin-bottom: 12px;
        }
        .details-col ul { list-style: none; }
        .details-col li {
          font-size: 0.867rem; color: var(--body-color); line-height: 1.7;
          padding: 6px 0; padding-left: 18px; position: relative;
        }
        .details-col li::before {
          content: '•'; color: var(--bullet-color); position: absolute; left: 0;
        }
        .apply-btn {
          display: inline-flex; align-items: center; gap: 12px;
          background: var(--btn-bg); color: var(--btn-text);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 14px 28px; border: none; border-radius: 10px; cursor: pointer;
          transition: background 0.25s, gap 0.25s; text-decoration: none;
        }
        .apply-btn:hover { background: #2b8fb5; gap: 18px; }
        /* Culture Section */
        .culture-section { padding: 72px 0; background: var(--section-bg); border-top: 1px solid var(--divider); }
        .culture-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media(max-width:900px){ .culture-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:640px){ .culture-grid { grid-template-columns: 1fr; } }
        .culture-card {
          background: var(--section-white); border-radius: 12px; padding: 28px;
          border-left: 3px solid var(--card-border);
        }
        .culture-card h3 {
          font-family: var(--ff); font-size: 1.067rem; font-weight: 500;
          color: var(--h2-color); margin-bottom: 12px;
        }
        .culture-card p { font-size: 0.867rem; color: var(--body-color); line-height: 1.7; }
        /* CTA */
        .jobs-cta {
          padding: 72px 0; background: var(--hero-bg); border-top: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }
        .cta-h2 {
          font-family: var(--ff); font-size: clamp(1.6rem,3vw,2.2rem); font-weight: 300;
          line-height: 1.2; color: #fff; margin-bottom: 16px;
        }
        .cta-sub { font-size: 0.867rem; color: rgba(255,255,255,0.6); max-width: 520px; margin: 0 auto 32px; line-height: 1.75; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 12px;
          background: var(--btn-bg); color: var(--btn-text);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 16px 36px; border: none; border-radius: 12px; cursor: pointer;
          transition: background 0.25s, gap 0.25s; text-decoration: none;
        }
        .cta-btn:hover { background: #2b8fb5; gap: 18px; }
        /* Footer */
         /* ── FOOTER (fixed slim) ── */
        footer {
          position: static;
          background: var(--footer-bg);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-slim { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; gap: 24px; flex-wrap: nowrap; }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .footer-mark { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-mark img { width: 28px; height: 28px; object-fit: contain; display: block; }
        .footer-word { font-size: 0.733rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.7); line-height: 1; white-space: nowrap; }
        .footer-right { display: flex; align-items: center; gap: 32px; flex-shrink: 0; }
        .footer-links-row { display: flex; align-items: center; gap: 24px; }
        .footer-links-row a { font-size: 0.633rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; white-space: nowrap; line-height: 1; }
        .footer-links-row a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 0.633rem; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; line-height: 1; white-space: nowrap; flex-shrink: 0; }

        @media(max-width:480px){
          .hero-inner { padding: 44px 18px 56px; }
          .jobs-section { padding: 36px 0; }
          .section-title { font-size: 1.4rem; }
          .job-header { flex-direction: column; align-items: flex-start; }
          .footer-slim { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px 0; }
        }
      `}</style>

      {/* Header */}
      <UnifiedNavbar />

      {/* Hero */}
      <section id="jobs-hero">
        <div className="hero-bg-img" />
        <div className="w">
          <div className="hero-inner">
            <Fade delay={0}>
              <div className="hero-label-row">
                <div className="hero-label-line" />
                <span className="hero-label-text">Join Our Team</span>
              </div>
            </Fade>
            <Fade delay={0.12}>
              <h1 className="hero-h1">
                Build the future of <span className="accent">institutional capital</span>
              </h1>
            </Fade>
            <Fade delay={0.24}>
              <p className="hero-body">
                MUSEDATA is a growth equity firm deploying minority capital into enterprise software and AI companies. We're looking for exceptional operators, investors, and builders who believe in evidence before conviction.
              </p>
            </Fade>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="jobs-section">
        <div className="w">
          <Fade delay={0}>
            <div className="section-label">Open Positions</div>
          </Fade>
          <Fade delay={0.08}>
            <h2 className="section-title">Where you can make an impact</h2>
          </Fade>

          {JOBS.map((job, index) => (
            <Fade key={job.id} delay={0.16 + index * 0.08}>
              <div className={`job-card ${openJob === job.id ? 'expanded' : ''}`} onClick={() => setOpenJob(openJob === job.id ? null : job.id)}>
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span>{job.department}</span>
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                    <p className="job-summary">{job.summary}</p>
                  </div>
                  <button className="job-toggle" onClick={(e) => { e.stopPropagation(); setOpenJob(openJob === job.id ? null : job.id); }}>
                    {openJob === job.id ? 'Show Less' : 'View Details'}
                    <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: openJob === job.id ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                  </button>
                </div>
                
                {openJob === job.id && (
                  <div className="job-details">
                    <div className="details-col">
                      <h4>Requirements</h4>
                      <ul>
                        {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                      </ul>
                    </div>
                    <div className="details-col">
                      <h4>Nice to Have</h4>
                      <ul>
                        {job.niceToHave.map((nice, i) => <li key={i}>{nice}</li>)}
                      </ul>
                      <Link href={`/apply`} className="apply-btn" style={{ marginTop: 24 }} onClick={(e) => e.stopPropagation()}>
                        Apply Now →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* Culture */}
      <section className="culture-section">
        <div className="w">
          <Fade delay={0}>
            <div className="section-label">Why Work Here</div>
          </Fade>
          <Fade delay={0.08}>
            <h2 className="section-title">More than a job. A partnership.</h2>
          </Fade>
          
          <div className="culture-grid" style={{ marginTop: 40 }}>
            <Fade delay={0.16}>
              <div className="culture-card">
                <h3>Evidence-Led Culture</h3>
                <p>We make decisions based on data, not hierarchy. Your analysis and insights directly shape investment outcomes.</p>
              </div>
            </Fade>
            <Fade delay={0.24}>
              <div className="culture-card">
                <h3>Global & Remote-First</h3>
                <p>Work from anywhere. We're distributed across New York, Los Angeles, and London—and beyond.</p>
              </div>
            </Fade>
            <Fade delay={0.32}>
              <div className="culture-card">
                <h3>Operator DNA</h3>
                <p>Our team includes former founders, CFOs, and GTM leaders. You'll learn from people who've built what we invest in.</p>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="jobs-cta">
        <div className="w">
          <Fade delay={0}>
            <h2 className="cta-h2">Don't see the right role?</h2>
          </Fade>
          <Fade delay={0.08}>
            <p className="cta-sub">
              We're always interested in exceptional talent. If you believe you'd add unique value to MUSEDATA, we'd love to hear from you.
            </p>
          </Fade>
          <Fade delay={0.16}>
            <a href="mailto:partners@musedata.ai" className="cta-btn">
              Send Your Profile →
            </a>
          </Fade>
        </div>
      </section>

      {/* Footer */}
     <footer>
        <div className="w">
          <div className="footer-slim">
            <a href="#" className="footer-logo">
              <div className="footer-mark">
                <img src={LOGO_B64} alt="MUSEDATA logo" />
              </div>
              <span className="footer-word">MUSEDATA</span>
            </a>
            <div className="footer-right">
              <div className="footer-links-row">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Disclosures</a>
                <a href="mailto:partners@musedata.ai">Contact</a>
              </div>
              <div className="footer-copy">© 2026 MUSEDATA Growth Equity. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}