"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import UnifiedNavbar, { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar"
/* ─── Data ─── */
const CARDS = [
  {
    tag: "Strategy",
    title: "Go-to-Market + Operator Coaching",
    desc: (<>We work directly with your <span className="hl">CEO and executive team</span> on the hardest questions in growth — how to position, how to scale, and when to push harder.</>),
    list: ["Revenue architecture & GTM design","Pricing strategy & packaging","Sales motion engineering","Executive coaching & OKR frameworks"],
  },
  {
    tag: "People",
    title: "Talent + Recruiting",
    desc: (<>The right people change everything. We support <span className="hl">hiring decisions at every level</span> with a rigorous approach to fit, structure, and compensation.</>),
    list: ["C-suite & VP-level executive search","Compensation & equity benchmarking","Culture design & onboarding systems","Organizational design & team structuring"],
  },
  {
    tag: "Growth",
    title: "Business Development",
    desc: (<>We connect your executives to <span className="hl">strategic partners and enterprise customers</span> who can change the trajectory of your business.</>),
    list: ["Strategic partnership facilitation","Enterprise customer introductions","Channel & reseller development","Market entry & expansion planning"],
  },
  {
    tag: "Brand",
    title: "Marketing + Communications",
    desc: (<>From first product launch to category positioning, we work on the <span className="hl">story and the signal</span> — narratives that resonate, brands that endure.</>),
    list: ["Brand strategy & narrative systems","PR, media relations, thought leadership","Product launch & go-live support","Communications & repositioning"],
  },
  {
    tag: "Operations",
    title: "Finance + Analytics",
    desc: (<>From diligence-grade evidence sprints and board-layer KPI governance to CFO advisory and M&amp;A support, we deliver the <span className="hl">full financial stack from $5M to $100M ARR</span>.</>),
    list: ["Evidence sprints & diligence support","Board-layer KPI governance & cadence","CFO advisory & fundraising preparation","M&A advisory, deal structuring & integration","Financial operations & strategic planning"],
  },
  {
    tag: "Intelligence",
    title: "Data Intelligence",
    desc: (<>Data is MUSEDATA's core competency. We help teams <span className="hl">instrument products, build pipelines</span>, and surface the signals that drive sustainable advantage.</>),
    list: ["Data architecture & infrastructure","Product analytics & instrumentation","Competitive & market intelligence","AI/ML strategy & implementation"],
  },
];

const TICKER_ITEMS = [
  "Go-to-Market Strategy","Talent & Recruiting","Business Development",
  "Marketing & Communications","Finance & Analytics","Data Intelligence",
  "Operator Coaching","Boardroom Intelligence",
];

const NET_CARDS = [
  { title: "Operator Advisors",  desc: "Former founders and operators with deep experience building and scaling companies, available for targeted strategic counsel at the moments that matter most.",  lnk: "Meet the advisors" },
  { title: "Domain Specialists", desc: "Deep functional experts across legal, finance, engineering, product, and marketing who provide targeted counsel exactly when your companies need it most.",    lnk: "Explore specialisms" },
  { title: "Growth Partners",    desc: "Revenue-focused partners who open doors to enterprise customers, distribution channels, and strategic alliances that accelerate commercial momentum.",         lnk: "See growth resources" },
];

/* ─── Logo mark ─── */
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ background: "#fff", padding: 4 }}>
      <rect x="0"  y="0"  width="6" height="6" fill="#1a4e66"/>
      <rect x="8"  y="0"  width="6" height="6" fill="#0a2433"/>
      <rect x="16" y="0"  width="6" height="6" fill="#1a4e66"/>
      <rect x="0"  y="8"  width="6" height="6" fill="#1a4e66"/>
      <rect x="8"  y="8"  width="6" height="6" fill="#1a4e66"/>
      <rect x="16" y="8"  width="6" height="6" fill="#0a2433"/>
      <rect x="0"  y="16" width="6" height="6" fill="#1a4e66"/>
      <rect x="8"  y="16" width="6" height="6" fill="#1a4e66"/>
      <rect x="16" y="16" width="6" height="6" rx="3" fill="#000"/>
    </svg>
  );
}

/* ─── Reveal wrapper ─── */
function Rv({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("on"); io.disconnect(); }
    }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Counter ─── */
function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        let t0: number | null = null;
        const step = (ts: number) => {
          if (!t0) t0 = ts;
          const p    = Math.min((ts - t0) / 1400, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val}</span>;
}

/* ─── Page ─── */
export default function SRGPage() {
  const [mobOpen,  setMobOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-x: hidden; font-size: 15px; }

        :root {
          --deep:   #0A2F42;
          --mid:    #1B5E7B;
          --bright: #3BA3CB;
          --main:   #2A7FA0;
          --white:  #FFFFFF;
          --ghost:  #F0F9FC;
          --muted:  #6B7E8A;
          --border: rgba(42,127,160,0.12);
          --line:   rgba(42,127,160,0.22);
          --nh:     68px;
          --ff:     'Inter', sans-serif;
        }

        body {
          background: var(--white);
          color: var(--deep);
          font-family: var(--ff);
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.75;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .hl { color: var(--bright); font-weight: 500; }

        /* REVEAL */
        .rv { opacity: 0; transform: translateY(32px); transition: opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1); }
        .rv.on { opacity: 1; transform: translateY(0); }

        /* KEYFRAMES */
        @keyframes fu     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }


        /* ── HERO ── */
        .hero { background:var(--deep); display:flex; flex-direction:column; }
        .hero-body { max-width:1600px; margin:0 auto; width:100%; padding:calc(var(--nh) + 7rem) 4rem 5rem; }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:1rem; font-size:.75rem; letter-spacing:.3em; text-transform:uppercase; color:var(--white); margin-bottom:3rem; opacity:0; animation:fu .8s .1s ease forwards; }
        .hero-eyebrow::before { content:''; width:28px; height:1px; background:rgba(255,255,255,.6); }
        .hero-h1 { font-size:clamp(2.4rem,4.8vw,5rem); font-weight:200; line-height:1.1; letter-spacing:.01em; color:rgba(255,255,255,.88); max-width:900px; opacity:0; animation:fu .9s .2s ease forwards; }
        .hero-sub { margin-top:2.5rem; font-size:.95rem; line-height:1.85; color:var(--white); max-width:480px; opacity:0; animation:fu .9s .35s ease forwards; }

        .hero-foot { max-width:1600px; margin:0 auto; width:100%; display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid rgba(255,255,255,.1); opacity:0; animation:fu 1s .5s ease forwards; }
        .hf-cell { padding:2.2rem 4rem; border-right:1px solid rgba(255,255,255,.1); }
        .hf-cell:last-child { border-right:none; }
        .hf-label { font-size:.68rem; letter-spacing:.22em; text-transform:uppercase; color:var(--white); margin-bottom:.7rem; opacity:.6; }
        .hf-val { font-size:2.2rem; font-weight:300; line-height:1; color:var(--white); }
        .hf-val sup { color:var(--bright); font-size:.85rem; vertical-align:super; }

        /* ── TICKER ── */
        .ticker { background:var(--deep); overflow:hidden; padding:.9rem 0; border-top:1px solid rgba(255,255,255,.08); }
        .ticker-track { display:flex; animation:ticker 40s linear infinite; width:max-content; }
        .ticker-item { display:flex; align-items:center; gap:2.5rem; padding:0 3rem; font-size:.72rem; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.35); white-space:nowrap; }
        .ticker-sep { color:var(--bright); }

        /* ── INTRO ── */
        .intro { background:var(--white); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
        .intro-in { max-width:1600px; margin:0 auto; padding:10rem 4rem 9rem; display:grid; grid-template-columns:1fr 1fr; gap:14rem; align-items:start; }
        .section-label { display:inline-flex; align-items:center; gap:.9rem; font-size:.73rem; letter-spacing:.28em; text-transform:uppercase; color:var(--bright); margin-bottom:2rem; }
        .section-label::before { content:''; width:24px; height:1px; background:var(--bright); }
        .intro-h { font-size:clamp(2.2rem,3.2vw,4rem); font-weight:300; line-height:1.06; letter-spacing:-.02em; color:var(--deep); }
        .intro-body { font-size:.95rem; line-height:1.9; color:var(--muted); }
        .intro-body p+p { margin-top:1.4rem; }

        /* ── CARDS ── */
        .cards-section { background:var(--white); }
        .cards-grid { max-width:1600px; margin:0 auto; padding:0 4rem 10rem; display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
        .card { background:var(--white); padding:4.5rem; position:relative; overflow:hidden; transition:background .5s; }
        .card:hover { background:var(--ghost); }
        .card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--bright),transparent); transform:scaleX(0); transform-origin:left; transition:transform .6s cubic-bezier(.25,1,.5,1); }
        .card:hover::before { transform:scaleX(1); }
        .card-tag { font-size:.72rem; letter-spacing:.24em; text-transform:uppercase; color:var(--bright); margin-bottom:1.2rem; display:flex; align-items:center; gap:.7rem; }
        .card-tag::before { content:''; width:14px; height:1px; background:var(--bright); }
        .card-title { font-size:clamp(1.15rem,1.4vw,1.5rem); font-weight:400; line-height:1.15; color:var(--deep); margin-bottom:1.4rem; }
        .card-desc { font-size:.92rem; line-height:1.85; color:var(--muted); margin-bottom:2.5rem; }
        .card-list { list-style:none; display:flex; flex-direction:column; gap:.55rem; margin-bottom:3rem; }
        .card-list li { display:flex; align-items:flex-start; gap:.8rem; font-size:.875rem; color:var(--muted); }
        .card-list li::before { content:''; display:block; width:12px; height:1px; background:var(--bright); margin-top:.58rem; flex-shrink:0; }
        .card-lnk { display:inline-flex; align-items:center; gap:.6rem; font-size:.73rem; letter-spacing:.2em; text-transform:uppercase; color:var(--bright); text-decoration:none; position:relative; padding-bottom:2px; }
        .card-lnk::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:var(--bright); transition:width .4s cubic-bezier(.25,1,.5,1); }
        .card:hover .card-lnk::after { width:100%; }
        .card-arr { transition:transform .35s; }
        .card:hover .card-arr { transform:translateX(5px); }

        /* ── STATEMENT ── */
        .stmt { background:var(--deep); position:relative; overflow:hidden; }
        .stmt-in { max-width:1600px; margin:0 auto; padding:10rem 4rem; display:grid; grid-template-columns:3fr 2fr; gap:10rem; align-items:center; }
        .stmt-q { font-size:clamp(1.6rem,2.6vw,3rem); font-weight:300; line-height:1.25; color:var(--white); }
        .stmt-q .hl { color:var(--bright); font-weight:400; }
        .stmt-attr { margin-top:3rem; font-size:.73rem; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.45); display:flex; align-items:center; gap:1rem; }
        .stmt-attr::before { content:''; width:24px; height:1px; background:var(--bright); }
        .stmt-stats { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid rgba(255,255,255,.1); }
        .ss { padding:2.5rem 3rem; border-right:1px solid rgba(255,255,255,.1); border-bottom:1px solid rgba(255,255,255,.1); transition:background .3s; }
        .ss:hover { background:rgba(42,127,160,.1); }
        .ss-n { font-size:2.2rem; font-weight:300; line-height:1; color:var(--white); }
        .ss-n sup { color:var(--bright); font-size:.85rem; vertical-align:super; }
        .ss-l { font-size:.68rem; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.7rem; }

        /* ── NETWORK ── */
        .net { background:var(--white); }
        .net-in { max-width:1600px; margin:0 auto; padding:10rem 4rem; }
        .net-head { display:grid; grid-template-columns:5fr 4fr; gap:12rem; align-items:end; padding-bottom:6rem; border-bottom:1px solid var(--border); margin-bottom:6rem; }
        .net-eyebrow { font-size:.73rem; letter-spacing:.28em; text-transform:uppercase; color:var(--bright); margin-bottom:1.8rem; display:flex; align-items:center; gap:.9rem; }
        .net-eyebrow::before { content:''; width:24px; height:1px; background:var(--bright); }
        .net-title { font-size:clamp(2rem,3.6vw,4.2rem); font-weight:300; line-height:1.05; color:var(--deep); }
        .net-body { font-size:.95rem; line-height:1.85; color:var(--muted); margin-bottom:3rem; }
        .net-btns { display:flex; gap:1.2rem; flex-wrap:wrap; }
        .btn-dark { display:inline-flex; align-items:center; gap:.8rem; padding:1rem 2.4rem; background:var(--main); color:var(--white); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:background .3s; font-family:var(--ff); }
        .btn-dark:hover { background:var(--deep); }
        .btn-line { display:inline-flex; align-items:center; gap:.8rem; padding:1rem 2.4rem; border:1px solid var(--line); color:var(--deep); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:border-color .3s,color .3s; font-family:var(--ff); }
        .btn-line:hover { border-color:var(--bright); color:var(--bright); }
        .net-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
        .nc { background:var(--white); padding:3.8rem; position:relative; overflow:hidden; transition:background .4s; }
        .nc:hover { background:var(--ghost); }
        .nc::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:var(--bright); transform:scaleX(0); transform-origin:left; transition:transform .5s cubic-bezier(.25,1,.5,1); }
        .nc:hover::after { transform:scaleX(1); }
        .nc-title { font-size:1.45rem; font-weight:400; line-height:1.2; color:var(--deep); margin-bottom:1.2rem; }
        .nc-desc  { font-size:.92rem; line-height:1.85; color:var(--muted); margin-bottom:2rem; }
        .nc-lnk   { font-size:.73rem; letter-spacing:.18em; text-transform:uppercase; color:var(--bright); text-decoration:none; }
        .nc-lnk:hover { opacity:.7; }

        /* ── FOOTER ── */
         /* ── FOOTER (fixed slim) ── */
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
        @media(max-width:1100px){
          .hero-foot { grid-template-columns:1fr 1fr; }
          .intro-in { grid-template-columns:1fr; gap:3rem; }
          .cards-grid { grid-template-columns:1fr 1fr; }
          .stmt-in { grid-template-columns:1fr; gap:5rem; }
          .net-head { grid-template-columns:1fr; gap:3rem; }
          .net-cards { grid-template-columns:1fr 1fr; }
        }
        @media(max-width:768px){
          .hero-body { padding-left:1.5rem; padding-right:1.5rem; padding-top:calc(var(--nh) + 4rem); }
          .hero-foot { grid-template-columns:1fr; }
          .hf-cell { border-right:none; border-bottom:1px solid rgba(255,255,255,.1); padding-left:1.5rem; padding-right:1.5rem; }
          .intro-in { padding:5rem 1.5rem; gap:2rem; }
          .cards-grid { grid-template-columns:1fr; padding:0 1.5rem 5rem; }
          .stmt-in { padding:5rem 1.5rem; }
          .net-in { padding:5rem 1.5rem; }
          .net-cards { grid-template-columns:1fr; }
          .ft { flex-direction:column; text-align:center; padding:2rem 1.5rem; }
          .ft-links { justify-content:center; }
          .nav-in { padding:0 1.5rem; }
        }
      `}</style>

      <UnifiedNavbar currentPage="strategic-resource-group" />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-body">
          <div className="hero-eyebrow">Strategic Resource Group</div>
          <h1 className="hero-h1">
            We build <span className="hl">alongside</span> you, always.
          </h1>
          <p className="hero-sub">
            Minority checks alongside aligned capital into VC-backed enterprise software and
            enterprise AI. A full strategic resource layer from day one.
          </p>
        </div>
        <div className="hero-foot">
          <div className="hf-cell">
            <div className="hf-label">Check Size</div>
            <div className="hf-val">$5–25<sup>M</sup></div>
          </div>
          <div className="hf-cell">
            <div className="hf-label">Target ARR</div>
            <div className="hf-val">$5–100<sup>M</sup></div>
          </div>
          <div className="hf-cell">
            <div className="hf-label">Disciplines</div>
            <div className="hf-val">6</div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item">
              <span>{item}</span>
              <span className="ticker-sep">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="intro" id="disciplines">
        <Rv>
          <div className="intro-in">
            <div>
              <div className="section-label">Strategic Resource Group</div>
              <h2 className="intro-h">Six pillars of exceptional<br />portfolio support</h2>
            </div>
            <div className="intro-body">
              <p>
                Our strategic resource group doesn't advise from a distance. We{" "}
                <span className="hl">embed directly into your growth story</span>,
                working across every critical function alongside your team.
              </p>
              <p>
                Each discipline is led by{" "}
                <span className="hl">operators and domain experts</span>{" "}
                with deep functional experience, built to move at the speed your business demands.
              </p>
            </div>
          </div>
        </Rv>
      </section>

      {/* ── CARDS ── */}
      <section className="cards-section">
        <div className="cards-grid">
          {CARDS.map((c, i) => (
            <Rv key={c.tag} delay={[0, 0.08, 0.16, 0.24, 0.32, 0.40][i] ?? 0}>
              <div className="card">
                <div className="card-tag">{c.tag}</div>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-desc">{c.desc}</p>
                <ul className="card-list">
                  {c.list.map(item => <li key={item}>{item}</li>)}
                </ul>
                <a href="#" className="card-lnk">
                  Learn more <span className="card-arr">→</span>
                </a>
              </div>
            </Rv>
          ))}
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <Rv>
        <div className="stmt">
          <div className="stmt-in">
            <div>
              <p className="stmt-q">
                We don't just back companies. We{" "}
                <span className="hl">build alongside them</span>,
                embedded in the work from the{" "}
                <span className="hl">very first check</span>.
              </p>
              <p className="stmt-attr">MUSEDATA Growth Equity</p>
            </div>
            <div className="stmt-stats">
              <div className="ss">
                <div className="ss-n"><Counter target={6} /></div>
                <div className="ss-l">Disciplines</div>
              </div>
              <div className="ss">
                <div className="ss-n">$5<sup>–25M</sup></div>
                <div className="ss-l">Check Size</div>
              </div>
              <div className="ss">
                <div className="ss-n">$5<sup>–100M</sup></div>
                <div className="ss-l">Target ARR</div>
              </div>
              <div className="ss">
                <div className="ss-n" style={{ fontSize: "1.25rem", lineHeight: 1.3 }}>
                  Enterprise<br />Software + AI
                </div>
                <div className="ss-l">Stage Focus</div>
              </div>
            </div>
          </div>
        </div>
      </Rv>

      {/* ── NETWORK ── */}
      <section className="net">
        <div className="net-in">
          <Rv>
            <div className="net-head">
              <div>
                <div className="net-eyebrow">Catalyst Network</div>
                <h2 className="net-title">The MUSEDATA<br />Catalyst Network</h2>
              </div>
              <div>
                <p className="net-body">
                  Alongside our core disciplines, MUSEDATA is building an{" "}
                  <span className="hl">extended advisory network</span> of senior operators,
                  domain experts, and functional specialists ready to be deployed into portfolio
                  companies as the need arises.
                </p>
                <div className="net-btns">
                  <a href="/jobs" className="btn-dark">Join the Network</a>
                  <a href="mailto:partners@musedata.ai" className="btn-line">Speak to Our Team</a>
                </div>
              </div>
            </div>
          </Rv>

          <Rv>
            <div className="net-cards">
              {NET_CARDS.map((nc, i) => (
                <div key={nc.title} className="nc" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="nc-title">{nc.title}</div>
                  <p className="nc-desc">{nc.desc}</p>
                  <a href="#" className="nc-lnk">{nc.lnk} →</a>
                </div>
              ))}
            </div>
          </Rv>
        </div>
      </section>

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