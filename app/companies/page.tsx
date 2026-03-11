"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";

/* ─── Types ─── */
interface Company {
  id: number;
  name: string;
  tagline: string;
  logoColor: string;
  logoInitials: string;
  badges: { label: string; type: "default" | "ai" | "yc" }[];
  stats: { n: string; sup?: string; l: string }[];
  featured?: boolean;
  animDelay: string;
}

/* ─── Portfolio data ─── */
const COMPANIES: Company[] = [
  {
    id: 1,
    name: "Archetype AI",
    tagline: "Foundation model platform for industrial IoT — turning sensor streams into enterprise-grade operational intelligence at scale.",
    logoColor: "#1B5E7B",
    logoInitials: "AA",
    badges: [{ label: "AI", type: "ai" }, { label: "YC W23", type: "yc" }],
    stats: [{ n: "$18", sup: "M", l: "ARR" }, { n: "3.1×", l: "NRR" }],
    featured: true,
    animDelay: "0s",
  },
  {
    id: 2,
    name: "Clarifai",
    tagline: "Full-lifecycle AI platform for vision, language, and multimodal models — trusted by regulated enterprise verticals.",
    logoColor: "#0A2F42",
    logoInitials: "CL",
    badges: [{ label: "AI", type: "ai" }],
    stats: [{ n: "$12", sup: "M", l: "ARR" }, { n: "2.4×", l: "Growth" }],
    animDelay: "0.08s",
  },
  {
    id: 3,
    name: "Synch",
    tagline: "Real-time financial data mesh for mid-market CFO teams — eliminating the spreadsheet layer between ERP and board.",
    logoColor: "#2A7FA0",
    logoInitials: "SY",
    badges: [{ label: "SaaS", type: "default" }, { label: "YC S22", type: "yc" }],
    stats: [{ n: "$7", sup: "M", l: "ARR" }, { n: "140%", l: "NRR" }],
    animDelay: "0.16s",
  },
  {
    id: 4,
    name: "Tactic",
    tagline: "AI-native procurement intelligence that surfaces supplier risk and spend opportunities across enterprise supply chains.",
    logoColor: "#1B5E7B",
    logoInitials: "TC",
    badges: [{ label: "AI", type: "ai" }, { label: "YC W22", type: "yc" }],
    stats: [{ n: "$9", sup: "M", l: "ARR" }, { n: "2.8×", l: "Growth" }],
    animDelay: "0.24s",
  },
  {
    id: 5,
    name: "Cohere",
    tagline: "Enterprise language AI — secure, private deployment of large language models for search, generation, and classification.",
    logoColor: "#3BA3CB",
    logoInitials: "CO",
    badges: [{ label: "AI", type: "ai" }],
    stats: [{ n: "$22", sup: "M", l: "ARR" }, { n: "Series B", l: "Stage" }],
    animDelay: "0.32s",
  },
  {
    id: 6,
    name: "Runway",
    tagline: "Modern financial planning platform for high-growth SaaS teams — replacing legacy FP&A with real-time scenario modeling.",
    logoColor: "#4A6B7C",
    logoInitials: "RW",
    badges: [{ label: "SaaS", type: "default" }, { label: "YC S21", type: "yc" }],
    stats: [{ n: "$6", sup: "M", l: "ARR" }, { n: "3.0×", l: "NRR" }],
    animDelay: "0.40s",
  },
  {
    id: 7,
    name: "Baseten",
    tagline: "ML model deployment infrastructure for engineering teams — sub-100ms inference, auto-scaling, and full observability.",
    logoColor: "#0A2F42",
    logoInitials: "BT",
    badges: [{ label: "AI", type: "ai" }, { label: "YC S20", type: "yc" }],
    stats: [{ n: "$11", sup: "M", l: "ARR" }, { n: "2.6×", l: "Growth" }],
    animDelay: "0.08s",
  },
  {
    id: 8,
    name: "Numeric",
    tagline: "Close management and financial reporting platform purpose-built for scaling finance teams at Series B and beyond.",
    logoColor: "#2A7FA0",
    logoInitials: "NM",
    badges: [{ label: "SaaS", type: "default" }, { label: "YC W21", type: "yc" }],
    stats: [{ n: "$5", sup: "M", l: "ARR" }, { n: "4.0×", l: "Growth" }],
    animDelay: "0.16s",
  },
];

const STATS = [
  { n: "$3–25", sup: "M", l: "ARR at Entry"      },
  { n: "$5–25", sup: "M", l: "Minority Checks"   },
  { n: "$100",  sup: "M+",l: "Portfolio Scale"   },
  { n: "YC",   sup: "",   l: "Backed Founders"   },
];

/* ─── Custom cursor ─── */
function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", move);
    let raf: number;
    const tick = () => {
      if (dotRef.current)  { dotRef.current.style.left  = mx + "px"; dotRef.current.style.top  = my + "px"; }
      rx += (mx - rx) * 0.09; ry += (my - ry) * 0.09;
      if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  id="cur" />
      <div ref={ringRef} id="cur-r" />
    </>
  );
}

/* ─── Logo mark ─── */
function LogoMark({ size = 32 }: { size?: number }) {
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

/* ─── Portfolio card ─── */
function PortfolioCard({ company }: { company: Company }) {
  const [hovered, setHovered] = useState(false);

  const badgeStyle = (type: "default" | "ai" | "yc"): React.CSSProperties => {
    if (type === "ai")  return { border: "1px solid rgba(59,163,203,.25)", color: "var(--main)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", padding: ".28rem .7rem", alignSelf: "flex-start", background: "transparent" };
    if (type === "yc")  return { border: "1px solid rgba(255,102,0,.2)", color: "#c85a00", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", padding: ".28rem .7rem", alignSelf: "flex-start", background: "transparent" };
    return { border: "1px solid var(--border)", color: "var(--slate)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", padding: ".28rem .7rem", alignSelf: "flex-start", background: "transparent" };
  };

  const featuredBadgeStyle = (type: "default" | "ai" | "yc"): React.CSSProperties => {
    if (type === "ai")  return { ...badgeStyle(type), border: "1px solid rgba(59,163,203,.3)", color: "var(--bright)" };
    return { ...badgeStyle(type), border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.45)" };
  };

  if (company.featured) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          gridColumn: "span 2",
          background: hovered ? "#0d3650" : "var(--deep)",
          padding: "2.8rem",
          display: "flex",
          flexDirection: "row",
          gap: "3rem",
          alignItems: "flex-start",
          position: "relative",
          cursor: "default",
          transition: "background .25s",
          opacity: 0,
          animation: `rise .6s ${company.animDelay} ease forwards`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem", flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#fff" }}>
            {company.logoInitials}
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {company.badges.map(b => (
              <span key={b.label} style={featuredBadgeStyle(b.type)}>{b.label}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "1.6rem" }}>
            <h3 style={{ fontFamily: "var(--ff-d)", fontSize: "1.55rem", fontWeight: 400, color: "#fff", marginBottom: ".5rem", letterSpacing: "-.01em" }}>
              {company.name}
            </h3>
            <p style={{ fontSize: ".82rem", lineHeight: 1.6, color: "rgba(255,255,255,.5)" }}>
              {company.tagline}
            </p>
          </div>
          <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "1.6rem" }}>
              {company.stats.map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: ".85rem", fontWeight: 500, color: "#fff" }}>
                    {s.n}{s.sup && <sup style={{ fontSize: ".55rem", color: "var(--bright)" }}>{s.sup}</sup>}
                  </div>
                  <div style={{ fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.25)", marginTop: ".15rem" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <span style={{ fontSize: ".9rem", color: "var(--bright)", opacity: hovered ? 1 : 0, transform: hovered ? "translate(0,0)" : "translate(-4px,4px)", transition: "opacity .2s, transform .2s" }}>↗</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--ghost)" : "#fff",
        padding: "2.8rem",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "default",
        transition: "background .25s",
        opacity: 0,
        animation: `rise .6s ${company.animDelay} ease forwards`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#fff", flexShrink: 0 }}>
          {company.logoInitials}
        </div>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {company.badges.map(b => (
            <span key={b.label} style={badgeStyle(b.type)}>{b.label}</span>
          ))}
        </div>
      </div>

      <h3 style={{ fontFamily: "var(--ff-d)", fontSize: "1.35rem", fontWeight: 400, color: "var(--deep)", marginBottom: ".5rem", letterSpacing: "-.01em" }}>
        {company.name}
      </h3>
      <p style={{ fontSize: ".82rem", lineHeight: 1.6, color: "var(--slate)", flex: 1 }}>
        {company.tagline}
      </p>

      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "1.6rem" }}>
          {company.stats.map(s => (
            <div key={s.l}>
              <div style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--deep)" }}>
                {s.n}{s.sup && <sup style={{ fontSize: ".55rem", color: "var(--bright)" }}>{s.sup}</sup>}
              </div>
              <div style={{ fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(10,47,66,.32)", marginTop: ".15rem" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <span style={{ fontSize: ".9rem", color: "var(--bright)", opacity: hovered ? 1 : 0, transform: hovered ? "translate(0,0)" : "translate(-4px,4px)", transition: "opacity .2s, transform .2s" }}>↗</span>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function CompaniesPage() {
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }

        :root {
          --deep:   #0A2F42;
          --mid:    #1B5E7B;
          --slate:  #4A6B7C;
          --bright: #3BA3CB;
          --main:   #2A7FA0;
          --white:  #fff;
          --ghost:  #F2F8FB;
          --border: rgba(42,127,160,.13);
          --nav-h:  68px;
          --ff:     'Montserrat', sans-serif;
          --ff-d:   'Cormorant Garamond', Georgia, serif;
        }

        body {
          font-family: var(--ff);
          font-size: 1rem;
          line-height: 1.6;
          background: var(--white);
          color: var(--deep);
          cursor: none;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        @media(max-width:768px){
          body { cursor: auto; }
          #cur, #cur-r { display: none; }
        }

        /* CURSOR */
        #cur   { position:fixed; z-index:9999; width:7px; height:7px; border-radius:50%; background:var(--bright); pointer-events:none; transform:translate(-50%,-50%); }
        #cur-r { position:fixed; z-index:9998; width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(42,127,160,.28); pointer-events:none; transform:translate(-50%,-50%); transition:width .3s,height .3s; }
        body:has(a:hover) #cur-r, body:has(button:hover) #cur-r { width:52px; height:52px; }

        /* ANIMATION */
        @keyframes rise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }


        /* HERO */
        .hero { background:var(--deep); padding:calc(var(--nav-h) + 6rem) 3rem 5rem; position:relative; overflow:hidden; }
        .hero::after { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 50% at 85% 10%,rgba(59,163,203,.12),transparent 55%),radial-gradient(ellipse 40% 55% at 8% 90%,rgba(42,127,160,.08),transparent 55%); }
        .hero-inner { max-width:1440px; margin:0 auto; position:relative; z-index:1; }
        .hero-tag { font-size:.68rem; letter-spacing:.34em; text-transform:uppercase; color:var(--bright); display:inline-flex; align-items:center; gap:.7rem; margin-bottom:2rem; opacity:0; animation:rise .6s .1s ease forwards; }
        .hero-tag::before { content:''; width:22px; height:1px; background:var(--bright); }
        .hero-h { font-family:var(--ff-d); font-size:clamp(2.4rem,4.5vw,5.2rem); font-weight:300; line-height:1.1; color:var(--white); letter-spacing:-.01em; max-width:700px; opacity:0; animation:rise .8s .2s ease forwards; }
        .hero-h em { font-style:italic; color:var(--bright); }
        .hero-sub { margin-top:2rem; font-size:1rem; line-height:1.8; color:rgba(255,255,255,.42); max-width:520px; opacity:0; animation:rise .8s .35s ease forwards; font-weight:300; }
        .hero-bar { max-width:1440px; margin:3.5rem auto 0; border-top:1px solid rgba(255,255,255,.08); padding:1.4rem 0; display:flex; align-items:center; gap:3rem; position:relative; z-index:1; opacity:0; animation:rise .6s .5s ease forwards; flex-wrap:wrap; }
        .hbar-item { display:flex; align-items:center; gap:.8rem; }
        .hbar-n { font-family:var(--ff-d); font-size:1.8rem; font-weight:300; color:var(--white); }
        .hbar-n sup { font-size:.85rem; color:var(--bright); }
        .hbar-l { font-size:.75rem; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,.28); }
        .hbar-div { width:1px; height:28px; background:rgba(255,255,255,.1); }

        /* OUR FOCUS */
        .focus { background:var(--white); padding:5rem 3rem; border-bottom:1px solid var(--border); }
        .focus-inner { max-width:1440px; margin:0 auto; display:grid; grid-template-columns:220px 1fr; gap:4rem; align-items:start; }
        .focus-label { font-size:.68rem; letter-spacing:.3em; text-transform:uppercase; color:var(--bright); display:flex; align-items:center; gap:.6rem; padding-top:.3rem; }
        .focus-label::before { content:''; width:18px; height:1px; background:var(--bright); }
        .focus-body { font-family:var(--ff-d); font-size:clamp(1.1rem,1.6vw,1.5rem); font-weight:400; line-height:1.7; color:var(--deep); margin-bottom:1.4rem; }
        .focus-note { font-size:.78rem; line-height:1.5; color:var(--slate); display:inline-block; border-bottom:1px solid var(--border); padding-bottom:.2rem; }
        .hl { color:var(--bright); font-weight:500; }

        /* PORTFOLIO */
        .portfolio { background:var(--white); padding:3rem 3rem 8rem; }
        .portfolio-inner { max-width:1440px; margin:0 auto; }
        .p-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); }

        /* STATEMENT STRIP */
        .strip { background:var(--deep); padding:5rem 3rem; }
        .strip-inner { max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 2fr; gap:6rem; align-items:center; }
        .strip-label { font-size:.68rem; letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.3); display:flex; align-items:center; gap:.6rem; }
        .strip-label::before { content:''; width:18px; height:1px; background:rgba(255,255,255,.2); }
        .strip-quote { font-family:var(--ff-d); font-size:clamp(1.2rem,1.8vw,2rem); font-weight:400; line-height:1.6; color:var(--white); }
        .strip-quote em { font-style:italic; color:var(--bright); }

        /* CTA */
        .cta { background:var(--white); padding:9rem 3rem; text-align:center; position:relative; overflow:hidden; }
        .cta::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 50% 70% at 50% 50%,rgba(42,127,160,.04),transparent 60%); }
        .cta-h { font-family:var(--ff-d); font-size:clamp(1.8rem,3vw,3.6rem); font-weight:300; color:var(--deep); margin-bottom:2.6rem; letter-spacing:-.01em; }
        .cta-btn { display:inline-flex; align-items:center; gap:.8rem; padding:1rem 3rem; background:var(--deep); color:var(--white); font-family:var(--ff); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:background .22s,transform .18s; }
        .cta-btn:hover { background:var(--main); transform:translateY(-2px); }

        /* FOOTER */
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

        /* RESPONSIVE */
        @media(max-width:1100px) {
          .p-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:960px) {
          .strip-inner { grid-template-columns:1fr; gap:2rem; }
        }
        @media(max-width:768px) {
          .hero { padding:calc(var(--nav-h) + 3.5rem) 1.5rem 3.5rem; }
          .hero-bar { gap:1.5rem; }
          .hbar-div { display:none; }
          .focus { padding:3rem 1.5rem; }
          .focus-inner { grid-template-columns:1fr; gap:1.5rem; }
          .portfolio { padding:2rem 1.5rem 5rem; }
          .p-grid { grid-template-columns:1fr; }
          .strip { padding:4rem 1.5rem; }
          .cta { padding:5rem 1.5rem; }
          .ft { flex-direction:column; text-align:center; padding:2rem 1.5rem; }
          .ft-links { justify-content:center; }
          .nav-in { padding:0 1.5rem; }
        }

        /* Featured card full-width on mobile */
        @media(max-width:1100px) {
          .p-card-featured-wrap { grid-column: span 2 !important; }
        }
        @media(max-width:768px) {
          .p-card-featured-wrap { grid-column: span 1 !important; flex-direction: column !important; gap: 0 !important; }
        }
      `}</style>

      <Cursor />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">Portfolio Companies</div>
          <h1 className="hero-h">
            Enterprise software<br />and AI, built to<br /><em>last.</em>
          </h1>
          <p className="hero-sub">
            Each company selected through proprietary diligence. Each partnership built around founders ready for their next chapter.
          </p>
        </div>
        <div className="hero-bar">
          {STATS.map((s, i) => (
            <div key={s.l} style={{ display: "contents" }}>
              <div className="hbar-item">
                <div>
                  <div className="hbar-n">
                    {s.n}{s.sup && <sup>{s.sup}</sup>}
                  </div>
                  <div className="hbar-l">{s.l}</div>
                </div>
              </div>
              {i < STATS.length - 1 && <div className="hbar-div" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR FOCUS ── */}
      <section className="focus">
        <div className="focus-inner">
          <div className="focus-label">Our Focus</div>
          <div>
            <p className="focus-body">
              We partner with <span className="hl">VC-backed enterprise software and enterprise AI companies</span> at the moment institutional infrastructure changes everything — the{" "}
              <span className="hl">$3–25M ARR stage</span> — writing{" "}
              <span className="hl">$5–25M minority checks</span> and building the boardroom-ready finance operations that carry companies from{" "}
              <span className="hl">$5M to $100M ARR</span>.
            </p>
            <p className="focus-note">
              Portfolio companies backed by leading venture platforms including{" "}
              <span className="hl">Y Combinator</span> and other top-tier early-stage investors.
            </p>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ── */}
      <section className="portfolio">
        <div className="portfolio-inner">
          <div className="p-grid">
            {COMPANIES.map(c => (
              <PortfolioCard key={c.id} company={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATEMENT STRIP ── */}
      <section className="strip">
        <div className="strip-inner">
          <div className="strip-label">Investment Philosophy</div>
          <p className="strip-quote">
            "Evidence before conviction. Every company in the portfolio passed the same test — not a checklist, but a{" "}
            <em>deep conviction</em> built on{" "}
            <em>proprietary diligence</em> that no deck can shortcut."
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta">
        <h2 className="cta-h">We'd love to hear from you.</h2>
        <Link href="mailto:partners@musedata.ai" className="cta-btn">Connect →</Link>
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