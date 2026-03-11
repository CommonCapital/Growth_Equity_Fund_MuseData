"use client";

import { useState, useEffect, useRef } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

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
    <div
      ref={ref}
      className={`fade ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

const TICKER_ITEMS = [
  "Enterprise Software","Enterprise AI","Minority Equity","$5M–$25M Checks",
  "$3M–$25M ARR","New York","Los Angeles","London","Investing Globally","LP Co-Investment",
  "Proprietary Diligence","Sponsor Processes",
  "Enterprise Software","Enterprise AI","Minority Equity","$5M–$25M Checks",
  "$3M–$25M ARR","New York","Los Angeles","London","Investing Globally","LP Co-Investment",
  "Proprietary Diligence","Sponsor Processes",
];

const PILLARS = [
  { n:"01", title:"Companies",               href:"/companies",                body:"Our portfolio of enterprise software and AI businesses, each selected through proprietary diligence and backed with $5–25M minority equity.",                                                                      link:"View Portfolio" },
  { n:"02", title:"People",                  href:"/people",                   body:"The operators, investors, and advisors behind MUSEDATA: a team built for rigorous diligence, institutional relationships, and long-term value creation.",                                                          link:"Meet the Team" },
  { n:"03", title:"Strategic Resource Group",href:"/strategic-resource-group", body:"Operational infrastructure embedded within every portfolio company: governance, reporting cadence, and strategic advisory for founders scaling toward institutional capital.",                                   link:"Learn More" },

];

const PROCESS_STEPS = [
  { n:"01", days:"Days 1–7",  title:"Initial Screen",  text:"Quantitative review of ARR, growth rate, retention, and unit economics against our investment criteria." },
  { n:"02", days:"Days 7–21", title:"Deep Diligence",  text:"Customer interviews, competitive mapping, financial model stress-testing, and management assessment." },
  { n:"03", days:"Days 21–35",title:"Evidence Pack",   text:"Proprietary research compiled into our institutional evidence pack, reviewed by the full investment committee." },
  { n:"04", days:"Days 35–45",title:"Term Sheet",      text:"If the evidence supports conviction, we move to term sheet. No drawn-out processes. No wasted time." },
];

const LOGO_B64 = "data:image/png;base64,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";

export default function MuseDataLanding() {
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
          --nav-bg:        #f6f8f8;
          --nav-text:      #b5c9ce;
          --nav-active:    #1c3342;
          --nav-border:    #dce4e8;
          --connect-bg:    #f6f8f8;
          --connect-text:  #3a4e58;
          --connect-border:#8f9ba1;

          --hero-bg:       #092e42;
          --hero-h1:       #ffffff;
          --hero-body:     rgba(255,255,255,0.55);
          --hero-label:    #5997b0;
          --hero-line:     #5997b0;

          --section-bg:    #f1f7fa;
          --section-white: #ffffff;
          --card-border:   #5e96aa;

          --label-color:   #7a9daa;
          --h2-color:      #0d2b3a;
          --body-color:    #3a5a6a;
          --bullet-color:  #5997b0;
          --list-text:     #3a5464;
          --divider:       #d4e4eb;

          --cta-bg:        #092e42;
          --cta-accent:    #39a2ca;
          --cta-body:      rgba(255,255,255,0.65);
          --btn-bg:        #39a2ca;
          --btn-text:      #ffffff;
          --btn-fine:      #4a6e7e;

          --footer-bg:     #092e42;
          --footer-text:   rgba(255,255,255,0.55);
          --footer-links:  rgba(255,255,255,0.35);

          --ff: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        ::selection { background: rgba(57,162,202,0.2); }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: var(--hero-label); }

        body {
          background: var(--section-white);
          color: var(--h2-color);
          font-family: var(--ff);
          font-weight: 400;
          line-height: 1.65;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          padding-bottom: 64px;
        }
        @media(max-width:768px){ body { padding-bottom: 120px; } }
        @media(max-width:480px){ body { padding-bottom: 140px; } }

        .w { max-width: 1200px; margin: 0 auto; padding: 0 56px; }
        @media(max-width:900px){ .w { padding: 0 32px; } }
        @media(max-width:640px){ .w { padding: 0 20px; } }

        /* ── FADE ── */
        .fade { opacity: 0; transform: translateY(22px); transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1); }
        .fade.in { opacity: 1; transform: none; }

        /* ── NAV ── */
        #nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          transition: box-shadow 0.3s;
        }
        #nav.scrolled { box-shadow: 0 2px 24px rgba(9,46,66,0.08); }
        .nav-inner {
          display: flex; align-items: center; height: 82px;
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
        }
        @media(max-width:900px){ .nav-inner { padding: 0 32px; } }
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; flex-shrink: 0; margin-right: 52px; line-height: 1;
        }
        .nav-mark { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .nav-mark img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .nav-word { font-size: 0.933rem; font-weight: 700; letter-spacing: 0.22em; color: var(--nav-active); text-transform: uppercase; line-height: 1; white-space: nowrap; }
        .nav-links { display: flex; list-style: none; flex: 1; align-items: stretch; height: 82px; margin: 0; padding: 0; }
        .nav-links li { display: flex; align-items: center; }
        .nav-links a {
          display: flex; align-items: center;
          font-size: 0.733rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          color: #8fa8b2; text-decoration: none; white-space: nowrap;
          padding: 0 15px; height: 82px;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s; line-height: 1;
        }
        .nav-links a:hover { color: var(--nav-active); }
        .nav-links a.active { color: var(--nav-active); font-weight: 600; border-bottom-color: var(--hero-label); }
        .nav-connect {
          display: flex; align-items: center; align-self: center; flex-shrink: 0; margin-left: auto;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; line-height: 1;
          color: var(--connect-text); background: transparent;
          padding: 12px 26px; text-decoration: none; white-space: nowrap;
          border: 1.5px solid var(--connect-border);
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .nav-connect:hover { background: var(--hero-bg); color: #fff; border-color: var(--hero-bg); }
        .ham { display: none; flex-direction: column; justify-content: center; gap: 6px; cursor: pointer; margin-left: 16px; align-self: center; flex-shrink: 0; }
        .ham span { width: 22px; height: 1.5px; background: var(--nav-active); display: block; }
        @media(max-width:980px){ .nav-links a { padding: 0 11px; font-size: 0.667rem; } }
        @media(max-width:780px){ .nav-links { display: none; } .ham { display: flex; } .nav-connect { display: none; } }

        .mob-nav {
          display: none; position: fixed; top: 82px; left: 0; right: 0; z-index: 199;
          background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
          padding: 24px 20px 32px; flex-direction: column;
        }
        .mob-nav.open { display: flex; }
        .mob-nav a { font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #8fa8b2; text-decoration: none; padding: 14px 0; border-bottom: 1px solid var(--nav-border); transition: color 0.2s; }
        .mob-nav a:hover { color: var(--nav-active); }
        .mob-nav .mob-cta { margin-top: 20px; background: var(--btn-bg); color: #fff !important; text-align: center; padding: 14px !important; font-weight: 600; letter-spacing: 0.16em; border: none; }

        /* ── HERO ── */
        #hero {
          min-height: 100vh; padding-top: 82px;
          background: var(--hero-bg);
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
        }
        .hero-bg-img { position: absolute; inset: 0; background-image: url('/background.png'); background-size: cover; background-position: center; opacity: 0.1; pointer-events: none; }
        .hero-inner { padding: 96px 56px 108px; position: relative; z-index: 1; text-align: left; max-width: 580px; }

        .hero-label-row { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; opacity: 0; animation: up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }
        .hero-label-line { width: 32px; height: 1px; background: var(--hero-line); }
        .hero-label-text { font-size: 0.667rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--hero-label); }

        .hero-h1 { font-family: var(--ff); font-size: clamp(2rem,3.8vw,3rem); font-weight: 300; line-height: 1.2; letter-spacing: -0.01em; color: var(--hero-h1); text-align: left; opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.22s forwards; }
        .hero-h1 .accent { color: var(--cta-accent); }

        .hero-body { margin-top: 2rem; max-width: 520px; font-size: 0.933rem; font-weight: 400; line-height: 1.75; color: var(--hero-body); opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.38s forwards; }

        .hero-actions { margin-top: 48px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.5s forwards; }

        @keyframes up { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: none; } }

        /* ── BUTTONS ── */
        .btn-primary { display: inline-flex; align-items: center; gap: 14px; background: var(--btn-bg); color: var(--btn-text); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; padding: 15px 34px; text-decoration: none; transition: background 0.25s, gap 0.25s; border: none; cursor: pointer; }
        .btn-primary:hover { background: #2b8fb5; gap: 20px; }
        .btn-ghost { display: inline-flex; align-items: center; gap: 12px; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.7); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; padding: 15px 34px; text-decoration: none; transition: border-color 0.25s, color 0.25s; background: transparent; cursor: pointer; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
        .btn-outline-dark { display: inline-flex; align-items: center; gap: 12px; border: 1px solid #c4d8e2; color: var(--body-color); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; padding: 15px 34px; text-decoration: none; transition: border-color 0.25s, color 0.25s; background: transparent; cursor: pointer; }
        .btn-outline-dark:hover { border-color: var(--hero-label); color: var(--h2-color); }
        .arr { display: inline-block; width: 16px; height: 1px; background: currentColor; position: relative; flex-shrink: 0; }
        .arr::after { content: ''; position: absolute; right: -1px; top: -3px; border: 3px solid transparent; border-left: 5px solid currentColor; }

        /* ── TICKER ── */
        .ticker { border-top: 1px solid var(--divider); border-bottom: 1px solid var(--divider); overflow: hidden; padding: 15px 0; background: var(--section-bg); }
        .ticker-track { display: flex; animation: ticker 30s linear infinite; width: max-content; }
        .ticker-item { display: inline-flex; align-items: center; gap: 22px; padding: 0 32px; font-size: 0.633rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--label-color); white-space: nowrap; }
        .ticker-item::before { content: '•'; font-size: 0.5rem; color: var(--bullet-color); }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── METRICS ── */
        #metrics { display: grid; grid-template-columns: repeat(3,1fr); border-bottom: 1px solid var(--divider); background: var(--section-white); }
        .metric-cell { padding: 52px 48px; border-right: 1px solid var(--divider); position: relative; overflow: hidden; transition: background 0.3s; }
        .metric-cell:last-child { border-right: none; }
        .metric-cell:hover { background: var(--section-bg); }
        .metric-cell::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--hero-label); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
        .metric-cell:hover::after { transform: scaleX(1); }
        .metric-n { font-family: var(--ff); font-size: clamp(2rem,3.5vw,3.2rem); font-weight: 300; line-height: 1; color: var(--h2-color); letter-spacing: -0.02em; margin-bottom: 10px; }
        .metric-n span { color: var(--hero-label); font-weight: 300; font-size: 0.68em; }
        .metric-l { font-size: 0.633rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--label-color); }

        /* ── SECTION SHARED ── */
        .sec { padding: 120px 0; border-top: 1px solid var(--divider); position: relative; overflow: hidden; }
        .sec-bg { background: var(--section-bg); }
        .sec-dark { background: var(--hero-bg); }

        .sec-label { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; font-size: 0.633rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--hero-label); }
        .sec-label::before { content: ''; width: 28px; height: 1px; background: var(--hero-label); display: block; }

        .sec-h2 { font-family: var(--ff); font-size: clamp(1.6rem,2.8vw,2.6rem); font-weight: 300; line-height: 1.15; letter-spacing: -0.01em; color: var(--h2-color); margin-bottom: 0; }
        .sec-h2 em { font-style: normal; color: var(--cta-accent); }
        .sec-dark .sec-h2 { color: #fff; }

        .sec-head-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; flex-wrap: wrap; margin-bottom: 64px; }
        .sec-sub { font-size: 0.867rem; font-weight: 400; line-height: 1.75; color: var(--body-color); max-width: 380px; }
        .sec-dark .sec-sub { color: rgba(255,255,255,0.5); }

        /* ── PILLARS ── */
        .pillars { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--divider); }
        .pillar { background: var(--section-white); padding: 42px 32px; text-decoration: none; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: background 0.3s; }
        .pillar::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--card-border); transform: scaleY(0); transform-origin: bottom; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .pillar:hover { background: var(--section-bg); }
        .pillar:hover::before { transform: scaleY(1); }
        .pillar-n { font-size: 0.633rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--hero-label); margin-bottom: 20px; }
        .pillar-title { font-family: var(--ff); font-size: 1.133rem; font-weight: 500; color: var(--h2-color); margin-bottom: 12px; line-height: 1.2; }
        .pillar-body { font-size: 0.867rem; font-weight: 400; color: var(--body-color); line-height: 1.75; flex: 1; margin-bottom: 24px; }
        .pillar-link { display: inline-flex; align-items: center; gap: 9px; font-size: 0.633rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--hero-label); transition: gap 0.2s; }
        .pillar:hover .pillar-link { gap: 14px; }

        /* ── WHY MUSEDATA ── */
        .why-card { background: var(--section-bg); border-left: 3px solid var(--card-border); padding: 60px 64px; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
        .why-h3 { font-family: var(--ff); font-size: 1.267rem; font-weight: 500; color: var(--h2-color); margin-bottom: 16px; line-height: 1.2; }
        .why-body { font-size: 0.867rem; font-weight: 400; color: var(--body-color); line-height: 1.8; }
        .why-list { list-style: none; display: flex; flex-direction: column; }
        .why-list li { display: flex; align-items: baseline; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--divider); font-size: 0.867rem; font-weight: 400; color: var(--list-text); line-height: 1.5; }
        .why-list li:first-child { border-top: 1px solid var(--divider); }
        .why-list li::before { content: '•'; color: var(--bullet-color); font-size: 0.6rem; flex-shrink: 0; margin-top: 2px; }

        /* ── PARTNERSHIP ── */
        .partner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--divider); }
        .partner-cell { background: var(--section-white); padding: 60px 52px; position: relative; }
        .partner-cell.featured { background: var(--hero-bg); border-left: 3px solid var(--hero-label); }
        .partner-cell.featured .pc-label { color: var(--hero-label); }
        .partner-cell.featured .pc-title { color: #fff; }
        .partner-cell.featured .pc-body { color: rgba(255,255,255,0.6); }
        .pc-label { font-size: 0.633rem; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--hero-label); margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
        .pc-label::before { content: ''; width: 24px; height: 1px; background: currentColor; display: block; }
        .pc-title { font-family: var(--ff); font-size: 1.467rem; font-weight: 400; line-height: 1.2; color: var(--h2-color); margin-bottom: 18px; }
        .pc-body { font-size: 0.867rem; font-weight: 400; line-height: 1.8; color: var(--body-color); margin-bottom: 32px; }
        .pc-cta { display: inline-flex; align-items: center; gap: 10px; font-size: 0.633rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--hero-label); text-decoration: none; transition: gap 0.2s; }
        .partner-cell.featured .pc-cta { color: rgba(255,255,255,0.7); }
        .pc-cta:hover { gap: 16px; }

        /* ── PHILOSOPHY ── */
        .phil-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 96px; align-items: start; }
        .phil-quote { font-family: var(--ff); font-size: clamp(1rem,1.8vw,1.467rem); font-weight: 300; font-style: italic; line-height: 1.55; color: var(--h2-color); margin-bottom: 28px; padding-left: 24px; border-left: 3px solid var(--card-border); }
        .phil-quote em { color: var(--cta-accent); font-style: normal; font-weight: 600; }
        .phil-attr { font-size: 0.633rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--hero-label); padding-left: 24px; }
        .phil-principles { display: flex; flex-direction: column; }
        .principle { display: grid; grid-template-columns: 40px 1fr; padding: 24px 0; border-bottom: 1px solid var(--divider); }
        .principle:first-child { border-top: 1px solid var(--divider); }
        .p-n { font-size: 0.633rem; font-weight: 700; color: var(--hero-label); padding-top: 2px; }
        .p-title { font-family: var(--ff); font-size: 1rem; font-weight: 500; color: var(--h2-color); margin-bottom: 5px; }
        .p-text { font-size: 0.867rem; font-weight: 400; color: var(--body-color); line-height: 1.7; }

        /* ── PROCESS (dark) ── */
        .process-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.08); }
        .process-cell { background: rgba(255,255,255,0.04); padding: 40px 32px; position: relative; transition: background 0.3s; }
        .process-cell:hover { background: rgba(255,255,255,0.08); }
        .process-cell::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--cta-accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s; }
        .process-cell:hover::after { transform: scaleX(1); }
        .proc-n { font-size: 2.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.02em; color: rgba(255,255,255,0.07); margin-bottom: 18px; }
        .proc-title { font-family: var(--ff); font-size: 1rem; font-weight: 500; color: #fff; margin-bottom: 6px; }
        .proc-day { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--cta-accent); margin-bottom: 12px; }
        .proc-text { font-size: 0.867rem; font-weight: 400; color: rgba(255,255,255,0.5); line-height: 1.7; }

        /* ── CTA ── */
        #cta-section { background: var(--hero-bg); padding: 120px 0; border-top: 1px solid rgba(255,255,255,0.06); }
        .cta-inner { max-width: 720px; }
        .cta-h2 { font-family: var(--ff); font-size: clamp(1.8rem,3.5vw,3rem); font-weight: 300; line-height: 1.2; letter-spacing: -0.01em; color: #fff; margin-bottom: 20px; }
        .cta-h2 em { color: var(--cta-accent); font-style: normal; }
        .cta-sub { font-size: 0.867rem; font-weight: 400; color: rgba(255,255,255,0.6); max-width: 500px; margin-bottom: 40px; line-height: 1.75; }
        .cta-check { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 32px; max-width: 480px; }
        .cta-check input[type="checkbox"] { width: 14px; height: 14px; margin-top: 3px; flex-shrink: 0; accent-color: var(--btn-bg); cursor: pointer; }
        .cta-check label { font-size: 0.733rem; color: rgba(255,255,255,0.45); line-height: 1.6; cursor: pointer; }
        .cta-check label a { color: var(--cta-accent); text-decoration: none; }
        .cta-fine { margin-top: 18px; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--btn-fine); }
        .cta-fine span { color: rgba(255,255,255,0.25); margin: 0 10px; }

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
        @media(max-width:1024px){
          .pillars { grid-template-columns: repeat(2,1fr); }
          .partner-grid { grid-template-columns: 1fr; }
          .phil-layout { grid-template-columns: 1fr; gap: 48px; }
          .process-row { grid-template-columns: repeat(2,1fr); }
          .why-card { grid-template-columns: 1fr; gap: 40px; padding: 48px 48px; }
        }
        @media(max-width:768px){
          .sec { padding: 72px 0; }
          .sec-head-row { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 40px; }
          .sec-sub { max-width: 100%; font-size: 0.8rem; }
          #metrics { grid-template-columns: 1fr 1fr; }
          .metric-cell { padding: 36px 28px; }
          .metric-cell:nth-child(3) { grid-column: span 2; border-right: none; }
          .hero-inner { padding: 56px 24px 72px; }
          .hero-h1 { font-size: clamp(1.7rem,5vw,2.4rem); }
          .hero-body { font-size: 0.867rem; margin-top: 1.5rem; }
          .hero-actions { margin-top: 2rem; gap: 12px; }
          .why-card { padding: 36px 28px; }
          .partner-cell { padding: 40px 28px; }
          #cta-section { padding: 80px 0; }
          .footer-slim { flex-wrap: wrap; gap: 14px; }
          .footer-right { flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer-links-row { flex-wrap: wrap; gap: 14px; }
        }
        @media(max-width:480px){
          .sec { padding: 56px 0; }
          #metrics { grid-template-columns: 1fr; }
          .metric-cell { border-right: none; border-bottom: 1px solid var(--divider); padding: 28px 18px; }
          .metric-cell:last-child { border-bottom: none; }
          .metric-cell:nth-child(3) { grid-column: span 1; }
          .hero-inner { padding: 44px 18px 56px; }
          .hero-actions { flex-direction: column; align-items: stretch; margin-top: 1.6rem; gap: 10px; }
          .btn-primary, .btn-ghost { justify-content: center; width: 100%; }
          .pillars { grid-template-columns: 1fr; }
          .why-card { padding: 28px 20px; gap: 32px; }
          .partner-cell { padding: 32px 20px; }
          .phil-quote { padding-left: 18px; }
          .phil-attr { padding-left: 18px; }
          .process-row { grid-template-columns: 1fr; }
          #cta-section { padding: 64px 0; }
          .footer-slim { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px 0; }
        }
      `}</style>

      {/* ── NAV ── */}
     

      {/* ── HERO ── */}
      <section id="hero">
        <div className="hero-bg-img" />
        <div className="w">
          <div className="hero-inner">
            <div className="hero-label-row">
              <div className="hero-label-line" />
              <span className="hero-label-text">Growth Equity</span>
            </div>
            <h1 className="hero-h1">
              Conviction
              <span style={{ display: "block", marginTop: "0.04em" }}>Capital for</span>
              <span style={{ display: "block", marginTop: "0.04em" }}>the <span className="accent">Exceptional</span></span>
            </h1>
            <p className="hero-body">
              MUSEDATA is a growth equity firm deploying minority capital into enterprise software and AI companies, selected through proprietary diligence, and partnered with founders who are building something permanent.
            </p>
            <div className="hero-actions">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/funding">
                  <button className="btn-primary">Apply for Capital <span className="arr" /></button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Link href="/funding" className="btn-primary">Apply for Capital <span className="arr" /></Link>
              </Authenticated>
         
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── METRICS ── */}
      <section id="metrics">
        {[
          { num: "$3–25", unit: "M",  lbl: "ARR at Entry" },
          { num: "$5–25", unit: "M",  lbl: "Check Size" },
          { num: "$100",  unit: "M+", lbl: "Portfolio Scale" },
        ].map(({ num, unit, lbl }, i) => (
          <Fade key={lbl} delay={i * 0.08} className="metric-cell">
            <div className="metric-n">{num}<span>{unit}</span></div>
            <div className="metric-l">{lbl}</div>
          </Fade>
        ))}
      </section>

      {/* ── PILLARS ── */}
      <section className="sec">
        <div className="w">
          <div className="sec-head-row">
            <div>
              <Fade delay={0}><div className="sec-label">What We Do</div></Fade>
              <Fade delay={0.08}><h2 className="sec-h2">One firm. <em>Four pillars.</em></h2></Fade>
            </div>
            <Fade delay={0.16}>
              <p className="sec-sub">Every part of MUSEDATA is built around the same principle: evidence before deployment, and partnership before capital.</p>
            </Fade>
          </div>
          <div className="pillars">
            {PILLARS.map(({ n, title, href, body, link }, i) => (
              <Fade key={n} delay={i * 0.08}>
                <Link href={href} className="pillar">
                  <div className="pillar-n">{n}</div>
                  <div className="pillar-title">{title}</div>
                  <div className="pillar-body">{body}</div>
                  <div className="pillar-link">{link} <span className="arr" /></div>
                </Link>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MUSEDATA ── */}
      <section className="sec sec-bg">
        <div className="w">
          <div className="sec-head-row" style={{ marginBottom: 48 }}>
            <div>
              <Fade delay={0}><div className="sec-label">Why MUSEDATA</div></Fade>
              <Fade delay={0.08}><h2 className="sec-h2">More than capital.</h2></Fade>
            </div>
          </div>
          <Fade delay={0.16}>
            <div className="why-card">
              <div>
                <h3 className="why-h3">More than capital.</h3>
                <p className="why-body">MUSEDATA embeds seasoned operators directly inside portfolio companies to build the financial, data, and GTM infrastructure that earns institutional trust.</p>
              </div>
              <div>
                <h3 className="why-h3" style={{ marginBottom: 0 }}>What you get.</h3>
                <ul className="why-list">
                  <li>CFO &amp; finance infrastructure layer</li>
                  <li>Private deal flow and co-investment</li>
                  <li>Vetted peer founder network</li>
                  <li>Direct advisory from leadership</li>
                  <li>Exclusive events &amp; off-record briefings</li>
                </ul>
                <h3 className="why-h3" style={{ marginTop: 36, marginBottom: 0 }}>Who we back.</h3>
                <ul className="why-list">
                  <li>Enterprise software founders</li>
                  <li>Series A to pre-exit stage</li>
                  <li>Global. Remote-first.</li>
                  <li>Selective. Application-based.</li>
                </ul>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── PARTNERSHIP ── */}
      <section className="sec">
        <div className="w">
          <div className="sec-head-row">
            <div>
              <Fade delay={0}><div className="sec-label">How We Partner</div></Fade>
              <Fade delay={0.08}><h2 className="sec-h2">Capital with <em>operational depth.</em></h2></Fade>
            </div>
          </div>
          <div className="partner-grid">
            <Fade delay={0} className="partner-cell featured">
              <div className="pc-label">Primary Path</div>
              <div className="pc-title">Minority Growth Equity</div>
              <p className="pc-body">We deploy $5–25M minority equity into enterprise software and AI businesses at $3–25M ARR. We operate alongside management as the business scales. The firm's capabilities, the SRG, the institutional network, the operational infrastructure, are integral to the investment, not supplementary to it.</p>
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/funding">
                  <button className="pc-cta">Apply for Capital <span className="arr" /></button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Link href="/funding" className="pc-cta">Apply for Capital <span className="arr" /></Link>
              </Authenticated>
            </Fade>
            <Fade delay={0.1} className="partner-cell">
              <div className="pc-label">Secondary Path</div>
              <div className="pc-title">Capital + Advisory</div>
              <p className="pc-body">For founders who require more than capital, MUSEDATA structures bespoke arrangements combining equity deployment with direct strategic advisory, institutional introductions, and access to the full SRG platform from day one.</p>
              <Link href="/strategic-resource-group" className="pc-cta">Learn More <span className="arr" /></Link>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="sec sec-bg">
        <div className="w">
          <div className="sec-head-row">
            <div>
              <Fade delay={0}><div className="sec-label">Investment Philosophy</div></Fade>
              <Fade delay={0.08}><h2 className="sec-h2">Built on <em>evidence, not instinct.</em></h2></Fade>
            </div>
          </div>
          <div className="phil-layout">
            <Fade delay={0}>
              <p className="phil-quote">
                Institutional capital is not simply patient. It is <em>precise.</em> Deployed when the evidence is clear, the moment is right, and the company is built to last.
              </p>
              <div className="phil-attr">MUSEDATA Investment Thesis</div>
              <div style={{ marginTop: 40 }}>
                <Link href="/about" className="btn-outline-dark">Read Our Full Thesis <span className="arr" /></Link>
              </div>
            </Fade>
            <div className="phil-principles">
              {[
                { n:"01", title:"Evidence before deployment", text:"Every investment begins with proprietary diligence. We do not move on instinct or relationships alone." },
                { n:"02", title:"Minority by design",         text:"We take minority positions. Founders retain control. Alignment comes from shared outcomes, not governance leverage." },
                { n:"03", title:"Capital as a signal",        text:"When MUSEDATA invests, it signals institutional readiness. Our capital opens doors beyond the cheque." },
                { n:"04", title:"Global mandate",             text:"We invest across geographies. The best enterprise software companies are not confined to a single market." },
              ].map(({ n, title, text }, i) => (
                <Fade key={n} delay={i * 0.08} className="principle">
                  <div className="p-n">{n}</div>
                  <div>
                    <div className="p-title">{title}</div>
                    <div className="p-text">{text}</div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="sec sec-dark">
        <div className="w">
          <div className="sec-head-row">
            <div>
              <Fade delay={0}><div className="sec-label">Diligence Process</div></Fade>
              <Fade delay={0.08}><h2 className="sec-h2">How we evaluate every opportunity.</h2></Fade>
            </div>
            <Fade delay={0.16}><p className="sec-sub">A structured, evidence-led process. No exceptions.</p></Fade>
          </div>
          <div className="process-row">
            {PROCESS_STEPS.map(({ n, days, title, text }, i) => (
              <Fade key={n} delay={i * 0.08} className="process-cell">
                <div className="proc-n">{n}</div>
                <div className="proc-day">{days}</div>
                <div className="proc-title">{title}</div>
                <div className="proc-text">{text}</div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta-section">
        <div className="w">
          <div className="cta-inner">
            <Fade delay={0}><div className="sec-label" style={{ marginBottom: 24 }}>Founders</div></Fade>
            <Fade delay={0.08}><h2 className="cta-h2">Ready to build something <em>extraordinary?</em></h2></Fade>
            <Fade delay={0.16}>
              <p className="cta-sub">Join a curated network of founders who don't just raise capital. They build institutions. Selective by design. Transformative by intent.</p>
            </Fade>
            <Fade delay={0.24}>
              <div className="cta-check">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. All information is kept strictly confidential and used solely for investment evaluation.
                </label>
              </div>
            </Fade>
            <Fade delay={0.32}>
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/funding">
                  <button className="btn-primary">Apply Your Startup <span className="arr" /></button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Link href="/funding" className="btn-primary">Apply Your Startup <span className="arr" /></Link>
              </Authenticated>
            </Fade>
            <Fade delay={0.4}>
              <div className="cta-fine">
                Reviewed within 14 business days <span>•</span> No obligation
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── FOOTER (fixed slim) ── */}
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