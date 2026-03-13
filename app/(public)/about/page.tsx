"use client";

import Link from "next/link";
import { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";

export default function AboutPage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        :root {
          --deep:   #0A2F42;
          --mid:    #1B5E7B;
          --slate:  #4A6B7C;
          --bright: #3BA3CB;
          --main:   #2A7FA0;
          --white:  #fff;
          --ghost:  #F2F8FB;
          --wash:   #E3F1F8;
          --border: rgba(42,127,160,.13);
          --nav-h:  68px;
        }
        html { font-size: 16px; scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background: var(--white); color: var(--deep); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
        h1,h2,h3,h4,h5,h6,p,span,a,li,blockquote,div { font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .ab-hero { position: relative; overflow: hidden; padding: calc(var(--nav-h) + 5rem) 3rem 6rem; background: var(--deep); }
        .ab-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 85% 20%, rgba(59,163,203,.1), transparent 55%), radial-gradient(ellipse 50% 70% at 10% 80%, rgba(42,127,160,.07), transparent 55%); pointer-events: none; }
        .ab-hero-inner { max-width: 1440px; margin: 0 auto; position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: end; }
        .ab-tag { font-size: .6875rem; font-weight: 500; letter-spacing: .22em; text-transform: uppercase; color: var(--bright); display: inline-flex; align-items: center; gap: .75rem; margin-bottom: 1.6rem; }
        .ab-tag::before { content: ''; width: 28px; height: 1px; background: var(--bright); }
        .ab-h1 { font-size: clamp(2rem, 4.5vw, 3.8rem); font-weight: 200; color: var(--white); line-height: 1.1; letter-spacing: -.02em; margin-bottom: 1.8rem; }
        .ab-h1 em { font-style: normal; font-weight: 700; color: var(--bright); }
        .ab-intro { font-size: .875rem; font-weight: 400; line-height: 1.8; color: rgba(255,255,255,.45); max-width: 460px; }
        .ab-quote-wrap { padding-left: 3rem; border-left: 1px solid rgba(59,163,203,.2); }
        .ab-quote { font-size: clamp(1rem, 1.5vw, 1.2rem); font-weight: 400; font-style: normal; color: var(--white); line-height: 1.75; letter-spacing: -.01em; margin-bottom: 1.6rem; }
        .ab-quote em { font-style: normal; color: var(--bright); }
        .ab-quote-attr { font-size: .6875rem; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.25); }

        /* ── STATS ── */
        .ab-stats { background: var(--deep); border-top: 1px solid rgba(255,255,255,.07); border-bottom: 1px solid rgba(255,255,255,.07); }
        .ab-stats-inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); }
        .ab-stat { padding: 2.5rem 3rem; border-right: 1px solid rgba(255,255,255,.07); }
        .ab-stat:last-child { border-right: none; }
        .ab-stat-val { font-size: 1.75rem; font-weight: 300; color: var(--white); letter-spacing: -.03em; line-height: 1; margin-bottom: .5rem; }
        .ab-stat-val sup { font-size: .75rem; font-weight: 600; color: var(--bright); vertical-align: super; letter-spacing: .02em; }
        .ab-stat-label { font-size: .625rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.3); }

        /* ── PILLARS ── */
        .ab-pillars-section { background: var(--white); border-top: 1px solid var(--border); }
        .ab-pillars-wrap { max-width: 1440px; margin: 0 auto; padding: 6rem 3rem; }
        .ab-section-label { font-size: .7rem; font-weight: 500; letter-spacing: .25em; text-transform: uppercase; color: var(--main); display: inline-flex; align-items: center; gap: .75rem; margin-bottom: 3rem; }
        .ab-section-label::before { content: ''; width: 24px; height: 1px; background: var(--main); }
        .ab-pillars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5px; background: var(--border); }
        .ab-pillar { background: var(--white); padding: 2.8rem 2.4rem; position: relative; transition: background .3s; }
        .ab-pillar:hover { background: var(--ghost); }
        .ab-pillar::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--main), var(--bright)); transform: scaleX(0); transform-origin: left; transition: transform .5s cubic-bezier(.22,1,.36,1); }
        .ab-pillar:hover::before { transform: scaleX(1); }
        .ab-pillar-num { font-size: .68rem; font-weight: 600; letter-spacing: .2em; color: var(--bright); margin-bottom: 1.2rem; opacity: .7; }
        .ab-pillar-title { font-size: 1rem; font-weight: 600; color: var(--deep); margin-bottom: .8rem; letter-spacing: -.01em; line-height: 1.3; }
        .ab-pillar-desc { font-size: .8125rem; font-weight: 400; line-height: 1.75; color: var(--slate); }

        /* ── HOW WE PARTNER ── */
        .ab-partner { background: var(--ghost); border-top: 1px solid var(--border); }
        .ab-partner-inner { max-width: 1440px; margin: 0 auto; padding: 6rem 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start; }
        .ab-partner-h { font-size: clamp(1.8rem, 2.8vw, 2.6rem); font-weight: 700; color: var(--deep); line-height: 1.12; letter-spacing: -.03em; margin-bottom: 1.4rem; }
        .ab-partner-h em { font-style: normal; font-weight: 300; color: var(--main); }
        .ab-partner-body { font-size: .9375rem; font-weight: 400; line-height: 1.8; color: var(--slate); margin-bottom: 1.2rem; }
        .ab-partner-cta { display: inline-flex; align-items: center; gap: .75rem; height: 44px; padding: 0 2rem; background: var(--deep); color: var(--white); font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; margin-top: 1.2rem; transition: background .2s, transform .15s; }
        .ab-partner-cta:hover { background: var(--main); transform: translateY(-2px); }
        .ab-checklist { list-style: none; display: flex; flex-direction: column; gap: 1.2rem; padding-top: .5rem; }
        .ab-checklist li { display: flex; align-items: flex-start; gap: 1rem; font-size: .9rem; font-weight: 400; line-height: 1.6; color: var(--slate); }
        .ab-checklist li::before { content: ''; width: 20px; height: 20px; flex-shrink: 0; border: 1px solid rgba(42,127,160,.3); border-radius: 50%; background: var(--wash); margin-top: 1px; background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='%232A7FA0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; }

        /* ── CTA BAND ── */
        .ab-cta { background: var(--deep); border-top: 1px solid rgba(255,255,255,.07); text-align: center; padding: 7rem 3rem; position: relative; overflow: hidden; }
        .ab-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 50% 60% at 50% 50%, rgba(59,163,203,.06), transparent 60%); pointer-events: none; }
        .ab-cta-h { font-size: clamp(1.8rem, 3vw, 3rem); font-weight: 300; color: var(--white); letter-spacing: -.03em; line-height: 1.12; margin-bottom: .8rem; }
        .ab-cta-h em { font-style: normal; font-weight: 200; color: var(--bright); }
        .ab-cta-sub { font-size: .9375rem; color: rgba(255,255,255,.4); margin-bottom: 2.4rem; line-height: 1.7; }
        .ab-cta-btns { display: flex; align-items: center; justify-content: center; gap: 1.2rem; flex-wrap: wrap; }
        .ab-btn-primary { display: inline-flex; align-items: center; gap: .75rem; height: 48px; padding: 0 2.4rem; background: var(--bright); color: var(--white); font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; transition: background .2s, transform .15s; }
        .ab-btn-primary:hover { background: var(--main); transform: translateY(-2px); }
        .ab-btn-ghost { display: inline-flex; align-items: center; gap: .75rem; height: 48px; padding: 0 2.4rem; border: 1px solid rgba(255,255,255,.2); color: rgba(255,255,255,.7); font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; transition: border-color .2s, color .2s; }
        .ab-btn-ghost:hover { border-color: var(--bright); color: var(--bright); }

        /* ── FOOTER ── */
        footer {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
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

        /* ── RESPONSIVE ── */
        @media(max-width:1100px) {
          .ab-hero-inner { grid-template-columns: 1fr; gap: 3rem; }
          .ab-quote-wrap { padding-left: 0; border-left: none; border-top: 1px solid rgba(59,163,203,.15); padding-top: 2.5rem; }
          .ab-pillars { grid-template-columns: repeat(2, 1fr); }
          .ab-partner-inner { grid-template-columns: 1fr; gap: 3rem; }
        }
        @media(max-width:768px) {
          .ab-hero { padding: calc(var(--nav-h) + 3rem) 1.5rem 4rem; }
          .ab-stats-inner { grid-template-columns: 1fr; }
          .ab-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,.07); }
          .ab-pillars { grid-template-columns: 1fr; }
          .ab-pillars-wrap { padding: 4rem 1.5rem; }
          .ab-partner-inner { padding: 4rem 1.5rem; }
          .ab-cta { padding: 5rem 1.5rem; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-inner">
          <div>
            <div className="ab-tag">Investment Philosophy</div>
            <h1 className="ab-h1">
              Evidence before<br /><em>conviction.</em>
            </h1>
            <p className="ab-intro">
              MUSEDATA is a growth equity firm deploying minority capital into enterprise software and AI companies: backed by proprietary diligence, built around founders ready for their next chapter.
            </p>
          </div>
          <div className="ab-quote-wrap">
            <blockquote className="ab-quote">
              "The finest capital is not merely patient. It is <em>precise</em>: deployed at the moment when a company is ready to be something permanent."
            </blockquote>
            <div className="ab-quote-attr">MUSEDATA Investment Thesis</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="ab-stats">
        <div className="ab-stats-inner">
          <div className="ab-stat">
            <div className="ab-stat-val">$3–25<sup>M</sup></div>
            <div className="ab-stat-label">ARR at Entry</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-val">$5–25<sup>M</sup></div>
            <div className="ab-stat-label">Check Size</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-val">$100<sup>M+</sup></div>
            <div className="ab-stat-label">Portfolio Scale</div>
          </div>
        </div>
      </div>

      {/* ── PILLARS ── */}
      <div className="ab-pillars-section">
        <div className="ab-pillars-wrap">
          <div className="ab-section-label">Our Principles</div>
          <div className="ab-pillars">
            <div className="ab-pillar">
              <div className="ab-pillar-num">01</div>
              <div className="ab-pillar-title">Evidence before conviction</div>
              <div className="ab-pillar-desc">Every investment begins with proprietary diligence: financial, operational, and strategic: before capital is ever committed.</div>
            </div>
            <div className="ab-pillar">
              <div className="ab-pillar-num">02</div>
              <div className="ab-pillar-title">Minority by design</div>
              <div className="ab-pillar-desc">We take minority positions intentionally. Founders retain control. We provide the infrastructure, relationships, and capital to scale.</div>
            </div>
            <div className="ab-pillar">
              <div className="ab-pillar-num">03</div>
              <div className="ab-pillar-title">Capital as a signal</div>
              <div className="ab-pillar-desc">MUSEDATA capital signals institutional readiness: opening doors to LP co-investment, sponsor processes, and strategic partnerships.</div>
            </div>
            <div className="ab-pillar">
              <div className="ab-pillar-num">04</div>
              <div className="ab-pillar-title">Global mandate</div>
              <div className="ab-pillar-desc">Operating from New York, Los Angeles, and London: investing globally into enterprise software and AI companies at the inflection point.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW WE PARTNER ── */}
      <div className="ab-partner">
        <div className="ab-partner-inner">
          <div>
            <div className="ab-section-label">How We Partner</div>
            <h2 className="ab-partner-h">
              Capital with <em>operational depth.</em>
            </h2>
            <p className="ab-partner-body">
              We deploy minority growth equity and work alongside founders as the company scales. The firm's operational capabilities: the SRG, the network, the institutional relationships: are part of how we invest, not an add-on to it.
            </p>
            <p className="ab-partner-body">
              The best partnerships are built on conviction, not checklists.
            </p>
            <a href="/funding" className="ab-partner-cta">
              Apply for Capital &rarr;
            </a>
          </div>
          <ul className="ab-checklist">
            <li>Proprietary diligence across financial, operational, and strategic dimensions</li>
            <li>Strategic Resource Group embedded inside every portfolio company</li>
            <li>Governance, reporting cadence, and institutional infrastructure from day one</li>
            <li>LP co-investment access and sponsor process facilitation</li>
            <li>Global network across New York, Los Angeles, and London</li>
          </ul>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="ab-cta">
        <h2 className="ab-cta-h">
          Your next chapter deserves<br /><em>the right capital.</em>
        </h2>
        <p className="ab-cta-sub">
          Apply directly: the process begins with evidence, not introductions.
        </p>
        <div className="ab-cta-btns">
          <a href="/funding" className="ab-btn-primary">Apply for Capital &rarr;</a>
          <a href="mailto:partners@musedata.ai" className="ab-btn-ghost">Contact the Team</a>
        </div>
      </div>

      {/* ── FOOTER ── */}
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