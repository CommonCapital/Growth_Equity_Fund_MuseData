"use client";

import { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";

export default function CompaniesPage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --deep:    #0A2F42;
          --mid:     #1B5E7B;
          --slate:   #4A6B7C;
          --bright:  #3BA3CB;
          --main:    #2A7FA0;
          --white:   #fff;
          --ghost:   #F2F8FB;
          --border:  rgba(42,127,160,.13);
          --fs-base: 16px;
          --nav-h:   68px;
        }
        em { font-style: normal; }
        .hl { color: var(--bright); font-weight: 500; }
        html { scroll-behavior: smooth; font-size: var(--fs-base); }
        body { font-family: 'Inter', -apple-system, sans-serif; font-size: 1rem; line-height: 1.6; background: var(--white); color: var(--deep); overflow-x: hidden; }

        /* ── HERO ── */
        .hero { background: var(--deep); padding: calc(var(--nav-h) + 6rem) 3rem 5rem; position: relative; overflow: hidden; }
        .hero::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 60% 50% at 85% 10%, rgba(59,163,203,.12), transparent 55%), radial-gradient(ellipse 40% 55% at 8% 90%, rgba(42,127,160,.08), transparent 55%); }
        .hero-inner { max-width: 1440px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-tag { font-size: .68rem; letter-spacing: .34em; text-transform: uppercase; color: var(--bright); display: inline-flex; align-items: center; gap: .7rem; margin-bottom: 2rem; opacity: 0; animation: rise .6s .1s ease forwards; }
        .hero-tag::before { content: ''; width: 22px; height: 1px; background: var(--bright); }
        .hero-h { font-family: 'Inter', sans-serif; font-size: clamp(2.4rem, 4.5vw, 5.2rem); font-weight: 300; line-height: 1.1; color: var(--white); letter-spacing: -.01em; max-width: 700px; opacity: 0; animation: rise .8s .2s ease forwards; }
        .hero-h em { color: var(--bright); }
        .hero-sub { margin-top: 2rem; font-size: 1rem; line-height: 1.8; color: rgba(255,255,255,.42); max-width: 520px; opacity: 0; animation: rise .8s .35s ease forwards; }
        .hero-bar { max-width: 1440px; margin: 3.5rem auto 0; border-top: 1px solid rgba(255,255,255,.08); padding: 1.4rem 0; display: flex; align-items: center; gap: 3rem; position: relative; z-index: 1; opacity: 0; animation: rise .6s .5s ease forwards; flex-wrap: wrap; }
        .hbar-item { display: flex; align-items: center; gap: .8rem; }
        .hbar-n { font-size: 1.8rem; font-weight: 300; color: var(--white); }
        .hbar-n sup { font-size: .85rem; color: var(--bright); }
        .hbar-l { font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.28); }
        .hbar-div { width: 1px; height: 28px; background: rgba(255,255,255,.1); }

        /* ── OUR FOCUS ── */
        .focus { background: var(--white); padding: 5rem 3rem; border-bottom: 1px solid var(--border); }
        .focus-inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 220px 1fr; gap: 4rem; align-items: start; }
        .focus-label { font-size: .68rem; letter-spacing: .3em; text-transform: uppercase; color: var(--bright); display: flex; align-items: center; gap: .6rem; padding-top: .3rem; }
        .focus-label::before { content: ''; width: 18px; height: 1px; background: var(--bright); }
        .focus-body { font-family: 'Inter', sans-serif; font-size: clamp(1.1rem, 1.6vw, 1.5rem); font-weight: 400; line-height: 1.7; color: var(--deep); margin-bottom: 1.4rem; }
        .focus-note { font-size: .78rem; line-height: 1.5; color: var(--slate); display: inline-block; border-bottom: 1px solid var(--border); padding-bottom: .2rem; }

        /* ── PORTFOLIO GRID ── */
        .portfolio { background: var(--white); padding: 3rem 3rem 8rem; }
        .portfolio-inner { max-width: 1440px; margin: 0 auto; }
        .p-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); }

        /* ── CARD ── */
        .p-card { background: var(--white); padding: 2.8rem; display: flex; flex-direction: column; position: relative; transition: background .25s; cursor: default; opacity: 0; animation: rise .6s ease forwards; }
        .p-card:hover { background: var(--ghost); }
        .p-card:hover .card-arrow { opacity: 1; transform: translate(0,0); }
        .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
        .card-logo { width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--white); flex-shrink: 0; }
        .card-badge { font-size: .58rem; letter-spacing: .2em; text-transform: uppercase; padding: .28rem .7rem; border: 1px solid var(--border); color: var(--slate); align-self: flex-start; }
        .card-badge.ai { border-color: rgba(59,163,203,.25); color: var(--main); }
        .card-badge.yc { border-color: rgba(255,102,0,.2); color: #c85a00; }
        .card-name { font-family: 'Inter', sans-serif; font-size: 1.35rem; font-weight: 400; color: var(--deep); margin-bottom: .5rem; letter-spacing: -.01em; }
        .card-tagline { font-size: .82rem; line-height: 1.6; color: var(--slate); flex: 1; }
        .card-meta { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .card-stats { display: flex; gap: 1.6rem; }
        .c-stat-n { font-size: .85rem; font-weight: 500; color: var(--deep); }
        .c-stat-n sup { font-size: .55rem; color: var(--bright); }
        .c-stat-l { font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(10,47,66,.32); margin-top: .15rem; }
        .card-arrow { font-size: .9rem; color: var(--bright); opacity: 0; transform: translate(-4px,4px); transition: opacity .2s, transform .2s; }

        /* ── FEATURED CARD ── */
        .p-card.featured { grid-column: span 2; flex-direction: row; gap: 3rem; align-items: flex-start; background: var(--deep); }
        .p-card.featured:hover { background: #0d3650; }
        .p-card.featured .card-name { color: var(--white); }
        .p-card.featured .card-tagline { color: rgba(255,255,255,.5); }
        .p-card.featured .card-meta { border-top-color: rgba(255,255,255,.1); }
        .p-card.featured .c-stat-n { color: var(--white); }
        .p-card.featured .c-stat-l { color: rgba(255,255,255,.25); }
        .p-card.featured .card-badge { border-color: rgba(255,255,255,.15); color: rgba(255,255,255,.45); }
        .p-card.featured .card-badge.ai { border-color: rgba(59,163,203,.3); color: var(--bright); }
        .p-card.featured-body { flex: 1; }
        .p-card.featured .card-top { margin-bottom: 1.6rem; }

        /* ── STATEMENT STRIP ── */
        .strip { background: var(--deep); padding: 5rem 3rem; }
        .strip-inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2fr; gap: 6rem; align-items: center; }
        .strip-label { font-size: .68rem; letter-spacing: .3em; text-transform: uppercase; color: rgba(255,255,255,.3); display: flex; align-items: center; gap: .6rem; }
        .strip-label::before { content: ''; width: 18px; height: 1px; background: rgba(255,255,255,.2); }
        .strip-quote { font-family: 'Inter', sans-serif; font-size: clamp(1.2rem, 1.8vw, 2rem); font-weight: 400; line-height: 1.6; color: var(--white); }
        .strip-quote em { color: var(--bright); }

        /* ── CTA ── */
        .cta { background: var(--white); padding: 9rem 3rem; text-align: center; position: relative; overflow: hidden; }
        .cta::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 50% 70% at 50% 50%, rgba(42,127,160,.04), transparent 60%); }
        .cta-h { font-family: 'Inter', sans-serif; font-size: clamp(1.8rem, 3vw, 3.6rem); font-weight: 400; color: var(--deep); margin-bottom: 2.6rem; letter-spacing: -.01em; }
        .cta-h em { color: var(--main); }
        .cta-actions { display: flex; align-items: center; justify-content: center; gap: 1.2rem; flex-wrap: wrap; }
        .cta-btn { display: inline-flex; align-items: center; gap: .8rem; padding: 1rem 3rem; background: var(--deep); color: var(--white); font-size: .75rem; letter-spacing: .18em; text-transform: uppercase; text-decoration: none; transition: background .22s, transform .18s; }
        .cta-btn:hover { background: var(--main); transform: translateY(-2px); }

        /* ── ANIMATION ── */
        @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        /* ── FOOTER — static flow ── */
        footer {
          position: static;
          background: var(--deep);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .w { max-width: 1440px; margin: 0 auto; padding: 0 3rem; }
        .footer-slim { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; gap: 24px; flex-wrap: wrap; }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .footer-mark { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-mark img { width: 28px; height: 28px; object-fit: contain; display: block; }
        .footer-word { font-size: 0.733rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.7); line-height: 1; white-space: nowrap; }
        .footer-right { display: flex; align-items: center; gap: 32px; flex-shrink: 0; flex-wrap: wrap; }
        .footer-links-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .footer-links-row a { font-size: 0.633rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; white-space: nowrap; line-height: 1; }
        .footer-links-row a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 0.633rem; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; line-height: 1; white-space: nowrap; flex-shrink: 0; }

        /* ── RESPONSIVE ── */
        @media(max-width:1100px) {
          .p-grid { grid-template-columns: repeat(2, 1fr); }
          .p-card.featured { grid-column: span 2; flex-direction: column; gap: 0; }
        }
        @media(max-width:768px) {
          .hero { padding: calc(var(--nav-h) + 3.5rem) 1.25rem 4rem; }
          .focus { padding: 3rem 1.25rem; }
          .focus-inner { grid-template-columns: 1fr; gap: 1.5rem; }
          .portfolio { padding: 3rem 1.25rem 5rem; }
          .p-grid { grid-template-columns: 1fr; }
          .p-card { padding: 1.75rem 1.25rem; }
          .p-card.featured { grid-column: span 1; flex-direction: column; gap: 0; }
          .strip { padding: 4rem 1.25rem; }
          .strip-inner { grid-template-columns: 1fr; gap: 2rem; }
          .cta { padding: 5rem 1.25rem; }
          .hbar-div { display: none; }
          .hero-bar { gap: 1.5rem; }
          .w { padding: 0 1.25rem; }
          .footer-slim { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px 0; }
          .footer-right { flex-direction: column; align-items: flex-start; gap: 12px; }
          .footer-links-row { gap: 12px; }
          /* Prevent text overflow */
          * { word-break: break-word; overflow-wrap: break-word; }
          h1, h2, h3, p { max-width: 100%; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">Portfolio Companies</div>
          <h1 className="hero-h">
            Enterprise software<br />and AI, built to<br /><em><span className="hl">last.</span></em>
          </h1>
          <p className="hero-sub">
            Each company selected through proprietary diligence. Each partnership built around founders ready for their next chapter.
          </p>
        </div>
        <div className="hero-bar">
          <div className="hbar-item">
            <div>
              <div className="hbar-n">$3–25<sup>M</sup></div>
              <div className="hbar-l">ARR at Entry</div>
            </div>
          </div>
          <div className="hbar-div" />
          <div className="hbar-item">
            <div>
              <div className="hbar-n">$5–25<sup>M</sup></div>
              <div className="hbar-l">Minority Checks</div>
            </div>
          </div>
          <div className="hbar-div" />
          <div className="hbar-item">
            <div>
              <div className="hbar-n">$100<sup>M+</sup></div>
              <div className="hbar-l">Portfolio Scale</div>
            </div>
          </div>
          <div className="hbar-div" />
          <div className="hbar-item">
            <div>
              <div className="hbar-n">YC</div>
              <div className="hbar-l">Backed Founders</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR FOCUS ── */}
      <section className="focus">
        <div className="focus-inner">
          <div className="focus-label">Our Focus</div>
          <div>
            <p className="focus-body">
              We partner with <span className="hl">VC-backed enterprise software and enterprise AI companies</span> at the moment institutional infrastructure changes everything the{" "}
              <span className="hl">$3–25M ARR stage</span> writing{" "}
              <span className="hl">$5–25M minority checks</span> and building the boardroom-ready finance operations that carry companies from{" "}
              <span className="hl">$5M to $100M ARR</span>.
            </p>
            <p className="focus-note">
              Portfolio companies backed by leading venture platforms including{" "}
              <span className="hl">Top-tier</span> early-stage investors.
            </p>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ── */}
      <section className="portfolio">
        <div className="portfolio-inner">
          <div className="p-grid" id="grid">
            {/* Portfolio companies will be populated here as investments are made */}
          </div>
        </div>
      </section>

      {/* ── STATEMENT STRIP ── */}
      <section className="strip">
        <div className="strip-inner">
          <div className="strip-label">Investment Philosophy</div>
          <p className="strip-quote">
            "Evidence before conviction. Every company in the portfolio passed the same test not a checklist, but a{" "}
            <span className="hl">deep conviction</span> built on{" "}
            <span className="hl">proprietary diligence</span> that no deck can shortcut."
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta">
        <h2 className="cta-h">We'd love to hear from you.</h2>
        <div className="cta-actions">
          <a href="mailto:partners@musedata.ai" className="cta-btn">Connect →</a>
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