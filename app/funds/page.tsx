"use client";

import { useState, useEffect, useRef } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import UnifiedNavbar, { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";

/* ── FadeUp via IntersectionObserver ── */
function FadeUp({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("visible"); io.disconnect(); }
      },
      { threshold: 0.07 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-up ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ── Data ── */
const MARQUEE_ITEMS = [
  "MUSEDATA","Sequoia","a16z","Benchmark","Enterprise AI","General Catalyst",
  "Deep Tech","Healthtech","Accel","Gradient Ventures","Seed & Series A","Alumni Networks",
  "MUSEDATA","Sequoia","a16z","Benchmark","Enterprise AI","General Catalyst",
  "Deep Tech","Healthtech","Accel","Gradient Ventures","Seed & Series A","Alumni Networks",
];

const ALUMNI = [
  { school:"Brown Alumni",               fund:"Waterman Ventures" },
  { school:"Carnegie Mellon Alumni",     fund:"The Fence Ventures" },
  { school:"Columbia Alumni",            fund:"116 Street Ventures" },
  { school:"Cornell Alumni",             fund:"Triphammer Ventures" },
  { school:"Dartmouth Alumni",           fund:"Green D Ventures" },
  { school:"Georgia Tech Alumni",        fund:"Fowler Street Ventures" },
  { school:"Harvard Alums",              fund:"Yard Ventures" },
  { school:"MIT Alumni",                 fund:"Castor Ventures" },
  { school:"Northwestern Alumni",        fund:"Purple Arch Ventures" },
  { school:"Notre Dame Alumni",          fund:"Two Lakes Ventures" },
  { school:"Penn Alumni",                fund:"Chestnut Street Ventures" },
  { school:"Princeton Alumni",           fund:"Nassau Street Ventures" },
  { school:"Stanford Alumni",            fund:"Spike Ventures" },
  { school:"Texas A&M Former Students",  fund:"Ring Ventures" },
  { school:"U Chicago Alumni",           fund:"Lakeshore Ventures" },
  { school:"UC Berkeley Alumni",         fund:"Strawberry Creek Ventures" },
  { school:"University of Michigan Alumni", fund:"Arbor Street Ventures" },
  { school:"University of Texas Alumni", fund:"Congress Avenue Ventures" },
  { school:"UVA Alumni",                 fund:"Emmet Street Ventures" },
  { school:"Wisconsin Alumni",           fund:"Bascom Ventures" },
  { school:"Yale Alumni",                fund:"Blue Ivy Ventures" },
];

const FOCUSED_FUNDS = [
  "AI & Robotics Fund",
  "AI First Fund",
  "Enterprise SaaS Fund",
  "Deep Tech & AI Infrastructure Fund",
  "Cybersecurity & Cloud Fund",
  "Enterprise Seed Fund",
  "U.S. Strategic Tech Fund",
  "Developer Tools & Platforms Fund",
];

const CONSTRUCTION_ITEMS = [
  { title:"Independent Investment Committee", desc:"Each fund supported by 5–10 experienced VCs & angels — independent oversight on every investment decision." },
  { title:"Office of Investing (OOI)", desc:"Portfolio construction supported by MUSEDATA's Office of Investing — institutional-grade framework applied to every fund." },
  { title:"18-Month Deployment Window", desc:"A structured, disciplined deployment timeline that times entries for optimal portfolio construction across the full window." },
  { title:"Four-Axis Diversification", desc:"Every portfolio balanced simultaneously by stage, sector, geography, and lead investor — true diversification by design." },
  { title:"20% Follow-On Capital Reserve", desc:"20% of capital is reserved for high-conviction follow-on investments in the top-performing portfolio companies." },
];

const INVESTOR_ITEMS = [
  { title:"Live Deal Discussions", desc:"Engage directly with MUSEDATA Investment Teams on live deal discussions — ask questions, stress-test the thesis, invest with clarity." },
  { title:"Regular Portfolio Updates", desc:"Regular updates on the performance of portfolio companies — board-level KPI dashboards delivered to your inbox." },
  { title:"MUSEDATA Investor App", desc:"The MUSEDATA Investor App gives you access to everything you need — portfolio, updates, documents — right on your phone." },
  { title:"Stress-Free Tax Documentation", desc:"K-1s and all tax documents delivered on time, every year. Our investors greatly appreciate this — no last-minute scrambles." },
  { title:"Personalized Investor Relations", desc:"Dedicated support through MUSEDATA Investor Relations — a real team available to answer your questions throughout your investment." },
  { title:"Automatic Syndicate Access", desc:"Fund investors automatically receive access to 1–2 select syndicate deals per month — at no additional cost.", last: true },
];

const STRUCT_ITEMS = [
  { label:"Investment Range",  val:<><strong>$10,000 – $3,000,000</strong><br/><span style={{fontSize:"0.8rem",color:"var(--muted)"}}>Typical investment: $50,000</span></> },
  { label:"Ways to Invest",    val:"Cash, trusts, entities, IRAs, or non-U.S. structures" },
  { label:"Management Fee",    val:<><strong>2%</strong> annual over 10 years, collected upon funding<br/><span style={{fontSize:"0.8rem",color:"var(--muted)"}}>Loyalty Rewards available to reduce fees</span></> },
  { label:"Profit Share",      val:<><strong>80/20</strong> split after full capital — including fees — is returned to investors<br/><span style={{fontSize:"0.8rem",color:"var(--muted)"}}>See fund subscription documents for Fund Carry vs. Deal Carry details</span></> },
  { label:"Capital Call",      val:"One-time only — no surprise fees or follow-ups" },
  { label:"Liquidity",         val:"Distributions start as companies exit — no fees beyond 10 years" },
];

export default function FundsPage() {
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Clear Sans'; font-weight: 300; font-style: normal; font-display: swap;
          src: url('https://cdn.jsdelivr.net/fontsource/fonts/clear-sans@latest/latin-300-normal.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Clear Sans'; font-weight: 400; font-style: normal; font-display: swap;
          src: url('https://cdn.jsdelivr.net/fontsource/fonts/clear-sans@latest/latin-400-normal.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Clear Sans'; font-weight: 500; font-style: normal; font-display: swap;
          src: url('https://cdn.jsdelivr.net/fontsource/fonts/clear-sans@latest/latin-500-normal.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Clear Sans'; font-weight: 700; font-style: normal; font-display: swap;
          src: url('https://cdn.jsdelivr.net/fontsource/fonts/clear-sans@latest/latin-700-normal.woff2') format('woff2');
        }

        :root {
          --bg: #ffffff;
          --teal: #1e5f7e;
          --teal-bright: #2a7fa8;
          --teal-3: #3a9fcb;
          --teal-dim: rgba(30,95,126,0.08);
          --teal-line: rgba(30,95,126,0.22);
          --dark: #0b1e28;
          --dark-bg: #0f3247;
          --dark-bg-2: #172e3e;
          --muted: #6a7a8a;
          --border: rgba(30,95,126,0.14);
          --border-mid: rgba(30,95,126,0.26);
          --border-strong: rgba(30,95,126,0.4);
          --ghost: rgba(30,95,126,0.04);
          --shadow: 0 6px 32px rgba(11,30,40,0.10), 0 2px 8px rgba(11,30,40,0.06);
          --shadow-sm: 0 2px 12px rgba(11,30,40,0.07);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--dark);
          font-family: 'Clear Sans', system-ui, sans-serif;
          font-weight: 300;
          overflow-x: hidden;
        }
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 9999;
        }

        /* ── TYPOGRAPHY ── */
        .eyebrow {
          font-size: 0.6875rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--teal); font-weight: 500;
          display: flex; align-items: center; gap: 14px;
        }
        .eyebrow::before { content: ''; width: 28px; height: 1px; background: linear-gradient(90deg, var(--teal), transparent); flex-shrink: 0; }
        .eyebrow.light { color: var(--teal-bright); }
        .eyebrow.light::before { background: linear-gradient(90deg, var(--teal-bright), transparent); }

        .section-h2 { font-size: clamp(2rem, 3vw, 3rem); font-weight: 400; color: var(--dark); line-height: 1.0; letter-spacing: -0.01em; margin-top: 20px; }
        .section-h2 .hl { color: var(--teal-bright); }
        .section-h2.on-dark { color: #ffffff; }


        /* ── BUTTONS ── */
        .btn-primary {
          font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
          color: #fff; background: var(--teal);
          padding: 16px 40px; border: none; cursor: pointer;
          transition: all 0.3s; text-decoration: none; display: inline-block; position: relative; overflow: hidden;
        }
        .btn-primary::after { content: ''; position: absolute; inset: 0; background: var(--dark-bg); transform: translateX(-101%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
        .btn-primary:hover::after { transform: translateX(0); }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-outline {
          font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
          color: var(--teal); background: transparent;
          padding: 15px 40px; border: 1px solid var(--border-strong);
          cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block;
        }
        .btn-outline:hover { border-color: var(--teal); background: var(--teal-dim); }

        .btn-outline-dark {
          font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
          color: rgba(255,255,255,0.65); background: transparent;
          padding: 15px 40px; border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block;
        }
        .btn-outline-dark:hover { border-color: rgba(255,255,255,0.55); color: #fff; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
          background: var(--dark-bg); position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 10% 50%, rgba(255,255,255,0.025) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 20%, rgba(42,127,168,0.1) 0%, transparent 55%);
          pointer-events: none;
        }
        .hero-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 80% at 100% 50%, black 0%, transparent 80%);
        }
        .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 72px 72px; position: relative; z-index: 2; }
        .hero-eyebrow { margin-bottom: 36px; }
        .hero-h1 { font-size: clamp(2.5rem, 4.5vw, 4rem); font-weight: 300; line-height: 1.1; letter-spacing: -0.01em; color: #fff; margin-bottom: 28px; max-width: 560px; }
        .hero-h1 .hl { color: var(--teal-bright); font-weight: 300; }
        .hero-sub { font-size: 0.9375rem; line-height: 1.8; color: rgba(255,255,255,0.5); max-width: 420px; margin-bottom: 48px; font-weight: 300; }
        .hero-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .hero-stats { display: flex; gap: 0; margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); }
        .hs-item { flex: 1; padding-right: 28px; border-right: 1px solid rgba(255,255,255,0.1); }
        .hs-item:last-child { border-right: none; padding-right: 0; padding-left: 28px; }
        .hs-item:not(:first-child) { padding-left: 28px; }
        .hs-num { font-size: 2.25rem; font-weight: 300; color: #fff; line-height: 1; margin-bottom: 8px; letter-spacing: -0.02em; }
        .hs-label { font-size: 0.6875rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.35); font-weight: 500; }

        /* Hero right */
        .hero-right { position: relative; display: flex; align-items: center; justify-content: center; padding: 120px 48px; z-index: 2; }
        .fund-preview-stack { position: relative; width: 100%; max-width: 400px; }
        .fpc-back2 { position: absolute; top: 40px; right: -40px; width: 100%; height: 100%; background: #fff; border: 1px solid rgba(30,95,126,0.08); z-index: 0; }
        .fpc-back  { position: absolute; top: 20px; right: -20px; width: 100%; height: 100%; background: #fff; border: 1px solid var(--border); z-index: 1; }
        .fpc-main  { background: #fff; border: 1px solid var(--border-mid); position: relative; z-index: 2; box-shadow: var(--shadow); }
        .fpc-main::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--teal), var(--teal-bright), transparent); }
        .fpc-header { padding: 24px 28px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .fpc-tag { font-size: 0.6875rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--teal); font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .fpc-pulse { width: 6px; height: 6px; background: #27ae60; border-radius: 50%; animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%,100%{ opacity:1; box-shadow: 0 0 0 0 rgba(39,174,96,0.5); } 50%{ opacity:0.7; box-shadow: 0 0 0 4px rgba(39,174,96,0); } }
        .fpc-type { font-size: 0.6875rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(106,122,138,0.5); }
        .fpc-body { padding: 28px; }
        .fpc-name { font-size: 2.25rem; font-weight: 700; color: var(--dark); line-height: 1; margin-bottom: 4px; letter-spacing: -0.02em; }
        .fpc-sub { font-size: 0.75rem; color: rgba(106,122,138,0.55); letter-spacing: 0.06em; margin-bottom: 28px; }
        .fpc-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-bottom: 24px; }
        .fpc-metric { background: #fff; padding: 16px 18px; }
        .fpc-metric-val { font-size: 1.25rem; font-weight: 700; color: var(--dark); line-height: 1; margin-bottom: 4px; }
        .fpc-metric-key { font-size: 0.6875rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(106,122,138,0.45); }
        .fpc-deploy-label { font-size: 0.6875rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: flex; justify-content: space-between; }
        .fpc-track { height: 2px; background: rgba(30,95,126,0.1); position: relative; overflow: hidden; margin-bottom: 20px; }
        .fpc-fill { position: absolute; inset: 0; background: linear-gradient(90deg, var(--dark-bg), var(--teal)); width: 55%; animation: barfill 2s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes barfill { from { width: 0; } to { width: 55%; } }
        .fpc-coinvestors { display: flex; align-items: center; gap: 10px; font-size: 0.6875rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(106,122,138,0.45); }
        .fpc-badge { border: 1px solid var(--border-mid); color: var(--teal); padding: 4px 12px; font-size: 0.6875rem; letter-spacing: 0.1em; text-transform: uppercase; }

        /* ── MARQUEE ── */
        .marquee-wrap { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 20px 0; overflow: hidden; background: #fff; position: relative; }
        .marquee-wrap::before, .marquee-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; }
        .marquee-wrap::before { left: 0; background: linear-gradient(90deg, #fff, transparent); }
        .marquee-wrap::after  { right: 0; background: linear-gradient(-90deg, #fff, transparent); }
        .marquee-track { display: flex; width: max-content; animation: marquee 34s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .m-item { font-size: 0.6875rem; letter-spacing: 0.26em; text-transform: uppercase; color: rgba(106,122,138,0.45); padding: 0 52px; white-space: nowrap; display: flex; align-items: center; font-weight: 400; }
        .m-sep  { width: 3px; height: 3px; background: var(--teal); border-radius: 50%; opacity: 0.35; margin: 0 52px; flex-shrink: 0; }

        /* ── SECTION SHARED ── */
        .section-pad { padding: 112px 72px; }
        .section-inner { max-width: 1320px; margin: 0 auto; }
        .section-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 72px; }
        .section-sub { font-size: 1rem; line-height: 1.9; color: var(--muted); font-weight: 300; }

        /* ── OVERVIEW SPLIT ── */
        .overview-split { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); }
        .overview-panel { padding: 72px; }
        .overview-panel-light { background: #fff; border-right: 1px solid var(--border); }
        .overview-panel-dark { background: var(--dark-bg); position: relative; overflow: hidden; }
        .overview-panel-dark::before { content: ''; position: absolute; bottom: -80px; right: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(42,127,168,0.07) 0%, transparent 70%); pointer-events: none; }
        .overview-panel-head { margin-bottom: 44px; }
        .overview-panel-h3 { font-size: clamp(1.5rem, 2.2vw, 2.25rem); font-weight: 400; line-height: 1.1; color: var(--dark); letter-spacing: -0.01em; margin-top: 16px; }
        .overview-panel-h3 .hl { color: var(--teal-bright); }
        .overview-panel-h3.on-dark { color: #fff; }
        .overview-panel-sub { font-size: 0.9375rem; line-height: 1.75; color: rgba(255,255,255,0.45); font-weight: 300; margin-top: 14px; max-width: 380px; }
        .overview-items { display: flex; flex-direction: column; }
        .overview-item { display: flex; gap: 18px; align-items: flex-start; padding: 22px 0; border-bottom: 1px solid var(--border); transition: background 0.2s; }
        .overview-item:first-child { padding-top: 0; }
        .overview-item-dark { border-bottom-color: rgba(255,255,255,0.07); }
        .oi-check { width: 22px; height: 22px; flex-shrink: 0; border: 1px solid var(--teal-line); background: var(--teal-dim); display: flex; align-items: center; justify-content: center; margin-top: 1px; }
        .oi-check::after { content: ''; width: 8px; height: 5px; border-left: 1.5px solid var(--teal); border-bottom: 1.5px solid var(--teal); transform: rotate(-45deg) translateY(-1px); }
        .oi-check-dark { border-color: rgba(42,127,168,0.35); background: rgba(42,127,168,0.1); }
        .oi-check-dark::after { border-left-color: var(--teal-bright); border-bottom-color: var(--teal-bright); }
        .oi-title { font-size: 0.9375rem; font-weight: 600; color: var(--dark); margin-bottom: 5px; }
        .oi-title-dark { color: #fff; }
        .oi-desc { font-size: 0.8125rem; line-height: 1.7; color: var(--muted); font-weight: 300; }
        .oi-desc-dark { color: rgba(255,255,255,0.45); }

        /* ── FUND CARDS ── */
        .funds-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; background: var(--border); border: 1px solid var(--border); }
        .fund-card { background: #fff; padding: 56px 48px; position: relative; overflow: hidden; transition: background 0.35s; cursor: default; }
        .fund-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--teal), transparent); transform: scaleX(0); transform-origin: left; transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); }
        .fund-card:hover { background: var(--ghost); }
        .fund-card:hover::after { transform: scaleX(1); }
        .card-num { font-size: 5rem; font-weight: 300; color: var(--teal); opacity: 0.08; position: absolute; top: 36px; right: 44px; line-height: 1; pointer-events: none; letter-spacing: -0.04em; }
        .card-type { font-size: 0.6875rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--teal); font-weight: 500; margin-bottom: 14px; }
        .card-h3 { font-size: 1.875rem; font-weight: 400; line-height: 1.2; color: var(--dark); margin-bottom: 16px; }
        .card-desc { font-size: 0.9375rem; line-height: 1.8; color: var(--muted); max-width: 440px; margin-bottom: 32px; }

        .alumni-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 8px; }
        .alumni-item { background: #fff; padding: 18px 20px; transition: background 0.2s; }
        .alumni-item:hover { background: var(--ghost); }
        .alumni-school { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
        .alumni-fund { font-size: 0.875rem; font-weight: 400; color: var(--dark); }
        .alumni-disclaimer { margin-top: 20px; padding: 18px 20px; background: var(--teal-dim); border-left: 2px solid var(--teal-line); font-size: 0.75rem; line-height: 1.75; color: var(--muted); font-weight: 300; }

        .focused-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 8px; }
        .focused-item { background: #fff; padding: 18px 22px; display: flex; align-items: center; gap: 16px; transition: background 0.2s; cursor: default; }
        .focused-item:hover { background: var(--ghost); }
        .focused-item:hover .fi-name { color: var(--teal); }
        .fi-num { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; color: var(--teal); opacity: 0.55; flex-shrink: 0; width: 18px; }
        .fi-name { font-size: 0.9375rem; font-weight: 500; color: var(--dark); transition: color 0.2s; line-height: 1.3; }

        .foundation-attrs { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 32px; }
        .fa-item { background: #fff; padding: 28px 24px; }
        .fa-val { font-size: 1.375rem; font-weight: 600; color: var(--teal); line-height: 1; margin-bottom: 6px; letter-spacing: -0.01em; }
        .fa-key { font-size: 0.6875rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 500; }

        .proven-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 32px; }
        .proven-item { background: #fff; padding: 28px 28px 24px; transition: background 0.25s; position: relative; }
        .proven-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--teal); opacity: 0; transition: opacity 0.25s; }
        .proven-item:hover { background: var(--ghost); }
        .proven-item:hover::before { opacity: 1; }
        .proven-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
        .proven-num { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; color: var(--teal); opacity: 0.55; flex-shrink: 0; }
        .proven-name { font-size: 1rem; font-weight: 600; color: var(--dark); flex: 1; }
        .proven-badge { font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; background: var(--teal); color: #fff; padding: 4px 10px; flex-shrink: 0; }
        .proven-desc { font-size: 0.875rem; line-height: 1.7; color: var(--muted); font-weight: 300; padding-left: 26px; }

        /* ── BONUS ── */
        .bonus-inner { max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; }
        .bonus-h3 { font-size: 1.875rem; font-weight: 400; color: #fff; line-height: 1.2; margin-bottom: 14px; }
        .bonus-desc { font-size: 0.9375rem; color: rgba(255,255,255,0.5); line-height: 1.8; margin-bottom: 28px; max-width: 520px; }
        .bonus-checks { display: flex; flex-direction: column; gap: 10px; }
        .bonus-check-item { display: flex; align-items: center; gap: 12px; font-size: 0.8125rem; color: rgba(255,255,255,0.55); font-weight: 300; }
        .bc-dot { width: 20px; height: 20px; border: 1px solid var(--teal-line); background: rgba(30,95,126,0.15); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .bc-dot::after { content: ''; width: 7px; height: 4px; border-left: 1.5px solid var(--teal-bright); border-bottom: 1.5px solid var(--teal-bright); transform: rotate(-45deg) translateY(-1px); }
        .bonus-right { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 40px; position: relative; }
        .bonus-right::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--teal), var(--teal-bright), transparent); }
        .bonus-right-label { font-size: 0.6875rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--teal-bright); font-weight: 500; margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .bonus-stat-row { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
        .bonus-stat-val { font-size: 1.625rem; font-weight: 400; color: #fff; line-height: 1; margin-bottom: 6px; letter-spacing: -0.01em; }
        .bonus-stat-key { font-size: 0.6875rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.3); }

        /* ── COMPARE ── */
        .cmp-col-heads { display: grid; grid-template-columns: 260px 1fr 1fr; background: var(--dark-bg); border: 1px solid var(--border); border-bottom: none; }
        .cmp-ch-spacer { padding: 40px 44px; border-right: 1px solid rgba(255,255,255,0.08); }
        .cmp-ch { padding: 40px 48px; border-right: 1px solid rgba(255,255,255,0.08); position: relative; }
        .cmp-ch:last-child { border-right: none; }
        .cmp-ch-type { font-size: 0.6875rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 500; margin-bottom: 10px; }
        .cmp-ch-title { font-size: 1.5rem; font-weight: 600; color: #fff; letter-spacing: -0.01em; margin-bottom: 10px; line-height: 1.1; }
        .cmp-ch-desc { font-size: 0.875rem; color: rgba(255,255,255,0.4); line-height: 1.7; font-weight: 300; }
        .cmp-table { border: 1px solid var(--border); border-top: none; }
        .cmp-row { display: grid; grid-template-columns: 260px 1fr 1fr; border-bottom: 1px solid rgba(30,95,126,0.07); transition: background 0.2s; }
        .cmp-row:last-child { border-bottom: none; }
        .cmp-row:hover { background: var(--ghost); }
        .cmp-row-label { padding: 24px 44px; border-right: 1px solid rgba(30,95,126,0.07); display: flex; align-items: center; }
        .cmp-row-label span { font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(106,122,138,0.5); }
        .cmp-cell { padding: 24px 48px; border-right: 1px solid rgba(30,95,126,0.07); display: flex; align-items: center; gap: 12px; }
        .cmp-cell:last-child { border-right: none; }
        .cmp-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(30,95,126,0.2); flex-shrink: 0; }
        .cmp-dot.on { background: var(--teal); width: 8px; height: 8px; }
        .cmp-val { font-size: 0.9375rem; color: var(--muted); line-height: 1.55; font-weight: 300; }
        .cmp-val strong { color: var(--dark); font-weight: 600; }
        .cmp-row.min-row .cmp-val { font-size: 1.5rem; font-weight: 600; color: var(--dark-bg); }
        .cmp-cta-row { display: grid; grid-template-columns: 260px 1fr 1fr; border: 1px solid var(--border); border-top: none; background: #fff; }
        .cmp-cta-spacer { padding: 36px 44px; border-right: 1px solid var(--border); }
        .cmp-cta-cell { padding: 36px 48px; border-right: 1px solid var(--border); display: flex; align-items: center; }
        .cmp-cta-cell:last-child { border-right: none; }

        .decide-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 32px; }
        .decide-card { background: #fff; padding: 44px 40px; transition: background 0.3s; }
        .decide-card:hover { background: var(--ghost); }
        .decide-head { font-size: 1rem; font-weight: 700; color: var(--dark); margin-bottom: 12px; }
        .decide-desc { font-size: 0.9375rem; line-height: 1.75; color: var(--muted); font-weight: 300; max-width: 400px; }

        .talk-strip { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 32px 40px; border: 1px solid var(--border); border-top: none; background: var(--ghost); }
        .talk-label { font-size: 0.6875rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--teal); font-weight: 600; margin-bottom: 6px; }
        .talk-desc { font-size: 0.9375rem; color: var(--muted); font-weight: 300; }

        /* ── APEX ── */
        .apex-inner { display: grid; grid-template-columns: 1fr 380px; gap: 80px; align-items: start; }
        .apex-sub { font-size: 1rem; color: rgba(255,255,255,0.5); font-weight: 300; margin: 14px 0 20px; font-style: italic; }
        .apex-desc { font-size: 0.9375rem; line-height: 1.85; color: rgba(255,255,255,0.5); font-weight: 300; max-width: 480px; margin-bottom: 28px; }
        .apex-checks { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .apex-check-item { display: flex; align-items: center; gap: 12px; font-size: 0.875rem; color: rgba(255,255,255,0.55); font-weight: 300; }
        .apex-contact { display: flex; align-items: center; gap: 12px; font-size: 0.875rem; color: rgba(255,255,255,0.35); padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
        .apex-contact a { color: var(--teal-bright); text-decoration: none; font-weight: 600; transition: color 0.2s; }
        .apex-contact a:hover { color: var(--teal-3); }
        .apex-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 36px; position: relative; }
        .apex-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--teal), var(--teal-bright), transparent); }
        .apex-card-label { font-size: 0.6875rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--teal-bright); font-weight: 600; margin-bottom: 28px; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .apex-card-stat { margin-bottom: 20px; }
        .apex-stat-val { font-size: 1.375rem; font-weight: 600; color: #fff; line-height: 1; margin-bottom: 5px; letter-spacing: -0.01em; }
        .apex-stat-key { font-size: 0.6875rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 500; }
        .apex-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 20px 0; }
        .apex-tag { font-size: 0.6875rem; letter-spacing: 0.1em; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); padding: 5px 12px; }

        /* ── STRUCTURE ── */
        .struct-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); }
        .struct-item { background: #fff; padding: 36px 32px; }
        .struct-item-wide { grid-column: 1 / -1; background: var(--ghost); border-top: 1px solid var(--border); }
        .struct-label { font-size: 0.6875rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; font-weight: 500; }
        .struct-val { font-size: 1rem; color: var(--dark); line-height: 1.55; }
        .struct-val strong { color: var(--teal); font-weight: 600; }

        /* ── SIGNUP ── */
        .signup-inner { display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; }
        .signup-left { background: var(--dark-bg); padding: 96px 80px 96px 72px; border-right: 1px solid rgba(255,255,255,0.07); position: relative; overflow: hidden; }
        .signup-left::before { content: ''; position: absolute; bottom: -80px; left: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(42,127,168,0.08) 0%, transparent 70%); pointer-events: none; }
        .signup-h2 { font-size: clamp(1.75rem, 2.5vw, 2.5rem); font-weight: 400; color: #fff; line-height: 1.1; margin: 20px 0 18px; letter-spacing: -0.01em; }
        .signup-h2 .hl { color: var(--teal-bright); }
        .signup-sub { font-size: 0.9375rem; line-height: 1.85; color: rgba(255,255,255,0.45); font-weight: 300; margin-bottom: 44px; max-width: 380px; }
        .signup-perks { display: flex; flex-direction: column; gap: 14px; }
        .signup-perk { display: flex; align-items: center; gap: 12px; font-size: 0.875rem; color: rgba(255,255,255,0.55); font-weight: 300; }
        .signup-perk::before { content: ''; width: 18px; height: 1px; background: var(--teal-bright); flex-shrink: 0; }
        .signup-right { background: #fff; padding: 96px 72px 96px 80px; }
        .signup-form { display: flex; flex-direction: column; gap: 18px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .form-field { display: flex; flex-direction: column; gap: 10px; }
        .form-label { font-size: 0.6875rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
        .form-input { background: #fff; border: 1px solid var(--border); color: var(--dark); padding: 15px 18px; font-family: 'Clear Sans', system-ui, sans-serif; font-size: 1rem; font-weight: 300; outline: none; transition: border-color 0.25s; width: 100%; -webkit-appearance: none; }
        .form-input:focus { border-color: var(--teal); }
        .form-input::placeholder { color: rgba(106,122,138,0.35); }
        .form-submit { background: var(--teal); color: #fff; border: none; padding: 17px 40px; font-family: 'Clear Sans', system-ui, sans-serif; font-size: 0.875rem; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all 0.3s; align-self: flex-start; position: relative; overflow: hidden; }
        .form-submit::after { content: ''; position: absolute; inset: 0; background: var(--dark-bg); transform: translateX(-101%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
        .form-submit:hover::after { transform: translateX(0); }
        .form-submit span { position: relative; z-index: 1; }
        .form-note { font-size: 0.6875rem; color: rgba(106,122,138,0.5); letter-spacing: 0.02em; line-height: 1.9; margin-top: 4px; }
        .signup-confirmed { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 40px; background: rgba(30,95,126,0.12); border: 1px solid var(--teal-line); min-height: 320px; }
        .confirmed-check { width: 56px; height: 56px; background: var(--teal); color: #fff; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .confirmed-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 10px; }
        .confirmed-desc { font-size: 0.9375rem; color: rgba(255,255,255,0.5); font-weight: 300; line-height: 1.7; }

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

        /* ── FADE UP ── */
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        /* ── RESPONSIVE ── */
        @media(max-width:1100px){
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          nav { padding: 0 32px; }
          .section-pad { padding: 80px 32px; }
          .section-intro { grid-template-columns: 1fr; gap: 20px; }
          .overview-split { grid-template-columns: 1fr; }
          .overview-panel-light { border-right: none; border-bottom: 1px solid var(--border); }
          .overview-panel { padding: 56px 32px; }
          .funds-grid { grid-template-columns: 1fr; }
          .bonus-inner { grid-template-columns: 1fr; gap: 40px; }
          .cmp-col-heads, .cmp-row, .cmp-cta-row { grid-template-columns: 1fr 1fr; }
          .cmp-ch-spacer, .cmp-row-label, .cmp-cta-spacer { display: none; }
          .struct-grid { grid-template-columns: repeat(2, 1fr); }
          .signup-inner { grid-template-columns: 1fr; }
          .signup-left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 64px 32px; }
          .signup-right { padding: 64px 32px; }
          footer { padding: 64px 32px 40px; }
          .footer-grid { grid-template-columns: 1fr 1fr; padding: 0; }
          .footer-bottom { flex-direction: column; gap: 16px; }
          .footer-legal { text-align: left; }
          .hero-left { padding: 72px 32px 80px; }
          .apex-inner { grid-template-columns: 1fr; }
        }
        @media(max-width:700px){
          .struct-grid { grid-template-columns: 1fr 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .hero-stats { flex-wrap: wrap; }
          .hs-item { flex: 0 0 calc(50% - 12px); }
          .footer-grid { grid-template-columns: 1fr; }
          .decide-split { grid-template-columns: 1fr; }
        }
      `}</style>

     <UnifiedNavbar />
      

      {/* ── HERO ── */}
      <section className="hero" id="home" style={{ paddingTop: 72 }}>
        <div className="hero-lines" />
        <div className="hero-left">
          <div className="hero-eyebrow eyebrow light">MUSEDATA • Diversified Funds • Accredited Investors</div>
          <h1 className="hero-h1">
            The simplest path to a <span className="hl">professional-grade</span> venture portfolio.
          </h1>
          <p className="hero-sub">For as little as $10,000, receive your own diversified portfolio of 20–30 venture investments — deployed alongside a16z, Sequoia, Benchmark, and more.</p>
          <div className="hero-actions">
            <a href="#funds" className="btn-primary"><span>Explore Active Funds</span></a>
            <a href="#bonus" className="btn-outline-dark">See Syndicate Deals</a>
          </div>
          <div className="hero-stats">
            {[
              { num:"Growing",  lbl:"Innovation Community" },
              { num:"Launching",lbl:"Investor Memberships" },
              { num:"20–30",    lbl:"Companies Per Fund" },
              { num:"$10K",     lbl:"Minimum Investment" },
              { num:"Early",    lbl:"Get In Now" },
            ].map(({ num, lbl }) => (
              <div key={lbl} className="hs-item">
                <div className="hs-num">{num}</div>
                <div className="hs-label">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero right — fund card stack */}
        <div className="hero-right">
          <div className="fund-preview-stack">
            <div className="fpc-back2" />
            <div className="fpc-back" />
            <div className="fpc-main">
              <div className="fpc-header">
                <div className="fpc-tag"><div className="fpc-pulse" /> Active Fund</div>
                <div className="fpc-type">MUSEDATA</div>
              </div>
              <div className="fpc-body">
                <div className="fpc-name">Castor</div>
                <div className="fpc-sub">MIT Alumni Fund • Series B–C Focus</div>
                <div className="fpc-metrics">
                  {[{v:"20–30",k:"Companies"},{v:"18mo",k:"Deploy Window"},{v:"80/20",k:"Profit Split"},{v:"2%",k:"Mgmt Fee / yr"}].map(({v,k}) => (
                    <div key={k} className="fpc-metric">
                      <div className="fpc-metric-val">{v}</div>
                      <div className="fpc-metric-key">{k}</div>
                    </div>
                  ))}
                </div>
                <div className="fpc-deploy-label"><span>Deployment Progress</span><span>55% Deployed</span></div>
                <div className="fpc-track"><div className="fpc-fill" /></div>
                <div className="fpc-coinvestors">
                  <span>Co-investing with</span>
                  <span className="fpc-badge">Sequoia</span>
                  <span className="fpc-badge">a16z</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="m-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── FUNDS OVERVIEW / ARCHITECTURE ── */}
      <section id="architecture">
        {/* Intro bar */}
        <div style={{ background:"#fff", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"80px 72px 72px" }}>
          <div className="section-inner">
            <FadeUp className="section-intro" style={{ marginBottom: 0 }}>
              <div>
                <div className="eyebrow">Funds Overview</div>
                <h2 className="section-h2">Smart Construction.<br /><span className="hl">Serious Diversification.</span></h2>
              </div>
              <div>
                <p className="section-sub">Typically, funds are led by a dedicated MUSEDATA team with deep sector expertise and supported by our entire team of 8+ full-time venture professionals. Every fund is built around the same institutional-grade framework.</p>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Two-panel split */}
        <div className="overview-split">
          {/* Left: Construction */}
          <div className="overview-panel overview-panel-light">
            <FadeUp className="overview-panel-head">
              <div className="eyebrow">Portfolio Construction</div>
              <h3 className="overview-panel-h3">Built to<br /><span className="hl">Institutional Standards</span></h3>
            </FadeUp>
            <FadeUp className="overview-items">
              {CONSTRUCTION_ITEMS.map(({ title, desc }) => (
                <div key={title} className="overview-item">
                  <div className="oi-check" />
                  <div>
                    <div className="oi-title">{title}</div>
                    <div className="oi-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </FadeUp>
          </div>

          {/* Right: Investor benefits */}
          <div className="overview-panel overview-panel-dark">
            <FadeUp className="overview-panel-head">
              <div className="eyebrow light">Individual Investors</div>
              <h3 className="overview-panel-h3 on-dark">Designed for<br /><span className="hl">Individual Investors</span></h3>
              <p className="overview-panel-sub">Join a Growing Innovation Community and Launching Investor Memberships — 20–30 Companies Per Fund, $10K Minimum Investment. Get In Early.</p>
            </FadeUp>
            <FadeUp className="overview-items">
              {INVESTOR_ITEMS.map(({ title, desc, last }) => (
                <div key={title} className={`overview-item overview-item-dark${last ? "" : ""}`} style={last ? { borderBottom:"none" } : {}}>
                  <div className="oi-check oi-check-dark" />
                  <div>
                    <div className="oi-title oi-title-dark">{title}</div>
                    <div className="oi-desc oi-desc-dark">{desc}</div>
                  </div>
                </div>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FOUR FUND TYPES ── */}
      <section id="funds" className="section-pad">
        <div className="section-inner">
          <FadeUp className="section-intro">
            <div>
              <div className="eyebrow">Fund Categories</div>
              <h2 className="section-h2">Four Ways to<br /><span className="hl">Build Your Portfolio</span></h2>
            </div>
            <div>
              <p className="section-sub">From community-driven alumni networks to sector-focused depth and algorithmic diversification — every path starts at $10,000 and is built around your investment conviction.</p>
            </div>
          </FadeUp>

          <FadeUp className="funds-grid">
            {/* 01: Alumni */}
            <div className="fund-card">
              <div className="card-num">01</div>
              <div className="card-type">Community Focus</div>
              <h3 className="card-h3">Invest With<br />Your People</h3>
              <p className="card-desc">These funds blend community focus with rigorous portfolio construction, leveraging MUSEDATA's globally recognized deal flow to ensure exceptional quality and diversification. These funds, our investors, and the alumni communities we've built are a key part in how we access the most competitive investments.</p>
              <div className="alumni-grid">
                {ALUMNI.map(({ school, fund }) => (
                  <div key={fund} className="alumni-item">
                    <div className="alumni-school">{school}</div>
                    <div className="alumni-fund">{fund}</div>
                  </div>
                ))}
              </div>
              <div className="alumni-disclaimer">
                Alumni Funds are for the community and friends of the corresponding schools. Each Fund endeavors to make investments in portfolio companies with relationships to the corresponding school, but there is no minimum number of school-related investments and Alumni Funds typically include portfolio companies without school relationships as well.
              </div>
            </div>

            {/* 02: Focused */}
            <div className="fund-card">
              <div className="card-num">02</div>
              <div className="card-type">Sector Expertise</div>
              <h3 className="card-h3">Invest In<br />What You Believe In</h3>
              <p className="card-desc">Our Focused Funds give you the power to concentrate on the sectors you care about most. Each is led by a team of full-time MUSEDATA investors with deep vertical knowledge.</p>
              <div className="focused-list">
                {FOCUSED_FUNDS.map((name, i) => (
                  <div key={name} className="focused-item">
                    <div className="fi-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="fi-name">{name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 03: Foundation */}
            <div className="fund-card">
              <div className="card-num">03</div>
              <div className="card-type">Maximum Diversification</div>
              <h3 className="card-h3">Invest for<br />Maximum Diversification</h3>
              <p className="card-desc">The Foundation Fund uses a rules-based, algorithmic process to build a portfolio of 20–30 companies that MUSEDATA is already investing in — layered with oversight from our Office of the CIO to ensure balance and quality.</p>
              <div className="foundation-attrs">
                {[{v:"20–30",k:"Portfolio Companies"},{v:"Rules-Based",k:"Algorithmic Selection"},{v:"CIO-Overseen",k:"Office of the CIO"},{v:"4-Axis",k:"Stage • Sector • Geo • Lead"}].map(({v,k}) => (
                  <div key={k} className="fa-item">
                    <div className="fa-val">{v}</div>
                    <div className="fa-key">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 04: Proven Performers */}
            <div className="fund-card">
              <div className="card-num">04</div>
              <div className="card-type">Returning Investors Only</div>
              <h3 className="card-h3">Invest in<br />Proven Performers</h3>
              <p className="card-desc">These funds are exclusively for returning investors who want to back proven performers.</p>
              <div className="proven-list">
                <div className="proven-item">
                  <div className="proven-header">
                    <div className="proven-num">01</div>
                    <div className="proven-name">CIO Select Fund</div>
                  </div>
                  <div className="proven-desc">Invests in ~15–25 of our most promising portfolio companies — curated and selected by the Office of the CIO.</div>
                </div>
                <div className="proven-item">
                  <div className="proven-header">
                    <div className="proven-num">02</div>
                    <div className="proven-name">Opportunity Fund</div>
                    <div className="proven-badge">Diamond Club Only</div>
                  </div>
                  <div className="proven-desc">A more concentrated bet on ~5–10 high-performing, existing portfolio companies. Available to Diamond Club members only.</div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── BONUS / SYNDICATE ── */}
      <section id="bonus" className="section-pad" style={{ background:"var(--dark-bg)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <FadeUp className="bonus-inner">
          <div>
            <div className="eyebrow light" style={{ marginBottom: 20 }}>Fund Investor Bonus</div>
            <h2 className="bonus-h3">Automatic Access to<br />Syndicate Deal Flow</h2>
            <p className="bonus-desc">When you invest in an MUSEDATA Fund, you automatically gain access to 1–2 select syndicate deals each month — at no additional cost. Build your diversified portfolio AND cherry-pick individual opportunities that match your investment thesis.</p>
            <div className="bonus-checks">
              {[
                "Full Financial Diligence & Cap Table Review",
                "Due Diligence and Investment Memos provided",
                "Live Deal discussions with our investment teams",
                "Co-invest with a16z, Sequoia, General Catalyst, Accel, and more",
                "Ongoing Board Reporting & on-time K-1s every tax season",
              ].map(item => (
                <div key={item} className="bonus-check-item"><div className="bc-dot" /> {item}</div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <a href="#signup" className="btn-primary"><span>View Active Syndicate Deals →</span></a>
            </div>
          </div>
          <div className="bonus-right">
            <div className="bonus-right-label">Syndicate At a Glance</div>
            <div className="bonus-stat-row">
              {[{v:"1–2 / month",k:"Deals per month"},{v:"$10,000",k:"Minimum per deal"},{v:"$0",k:"Membership fees"},{v:"Automatic",k:"Included with any fund"}].map(({v,k}) => (
                <div key={k}>
                  <div className="bonus-stat-val">{v}</div>
                  <div className="bonus-stat-key">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── FUND VS SYNDICATE ── */}
      <section id="compare" className="section-pad" style={{ background:"#fff", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div className="section-inner">
          <FadeUp className="section-intro">
            <div>
              <div className="eyebrow">Investment Approach</div>
              <h2 className="section-h2">Understanding Fund vs.<br /><span className="hl">Syndicate Investing</span></h2>
            </div>
            <div>
              <p className="section-sub">Two paths to institutional-grade venture exposure. Both start at $10,000. Neither has hidden fees. One decision: how involved do you want to be?</p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="cmp-col-heads">
              <div className="cmp-ch-spacer" />
              <div className="cmp-ch">
                <div className="cmp-ch-type">Portfolio Investment</div>
                <div className="cmp-ch-title">Invest in a Fund</div>
                <div className="cmp-ch-desc">Hands-off, diversified portfolio.</div>
              </div>
              <div className="cmp-ch">
                <div className="cmp-ch-type">Single Company Investment</div>
                <div className="cmp-ch-title">Syndicate Deals</div>
                <div className="cmp-ch-desc">Pick individual companies.</div>
              </div>
            </div>
            <div className="cmp-table">
              <div className="cmp-row">
                <div className="cmp-row-label"><span>Portfolio</span></div>
                <div className="cmp-cell"><div className="cmp-dot on" /><div className="cmp-val"><strong>20–30 companies</strong> selected by our team</div></div>
                <div className="cmp-cell"><div className="cmp-dot" /><div className="cmp-val"><strong>Deal-by-deal</strong> — 1–2 per month</div></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-row-label"><span>Control</span></div>
                <div className="cmp-cell"><div className="cmp-dot on" /><div className="cmp-val">Hands-off — we deploy your capital</div></div>
                <div className="cmp-cell"><div className="cmp-dot" /><div className="cmp-val">You decide which deals to join</div></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-row-label"><span>Diligence</span></div>
                <div className="cmp-cell"><div className="cmp-dot on" /><div className="cmp-val">Automatic syndicate access included</div></div>
                <div className="cmp-cell"><div className="cmp-dot" /><div className="cmp-val">Active participation with full diligence</div></div>
              </div>
              <div className="cmp-row min-row">
                <div className="cmp-row-label"><span>Minimum</span></div>
                <div className="cmp-cell"><div className="cmp-val">$10K <span style={{fontSize:"0.8rem",fontWeight:400,color:"var(--muted)"}}>one-time investment</span></div></div>
                <div className="cmp-cell"><div className="cmp-val">$10K <span style={{fontSize:"0.8rem",fontWeight:400,color:"var(--muted)"}}>per deal minimum</span></div></div>
              </div>
            </div>
            <div className="cmp-cta-row">
              <div className="cmp-cta-spacer" />
              <div className="cmp-cta-cell"><a href="#signup" className="btn-primary"><span>Explore Funds →</span></a></div>
              <div className="cmp-cta-cell"><a href="#signup" className="btn-outline">See Available Deals →</a></div>
            </div>
          </FadeUp>

          <FadeUp className="decide-split">
            <div className="decide-card">
              <div className="decide-head">Start With a Fund if You Want:</div>
              <div className="decide-desc">Instant diversification, professional management, and the ability to add individual deals later — since fund investors get syndicate access automatically.</div>
              <a href="#signup" className="btn-primary" style={{ marginTop: 28, display:"inline-block" }}><span>Explore Funds →</span></a>
            </div>
            <div className="decide-card">
              <div className="decide-head">Start Syndicate-Only if You:</div>
              <div className="decide-desc">Want to build your portfolio one deal at a time, already have diversification elsewhere, or prefer maximum control over every investment.</div>
              <a href="#signup" className="btn-outline" style={{ marginTop: 28, display:"inline-block" }}>See Available Deals →</a>
            </div>
          </FadeUp>

          <FadeUp className="talk-strip">
            <div>
              <div className="talk-label">Still not sure?</div>
              <div className="talk-desc">Our team is happy to walk you through which path makes the most sense for your goals.</div>
            </div>
            <a href="mailto:partners@musedata.ai" className="btn-outline">Talk to Our Team →</a>
          </FadeUp>
        </div>
      </section>

      {/* ── APEX ── */}
      <section id="apex" className="section-pad" style={{ background:"var(--dark-bg)", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="section-inner">
          <FadeUp className="apex-inner">
            <div>
              <div className="eyebrow light" style={{ marginBottom: 20 }}>For Institutions Only</div>
              <h2 className="section-h2 on-dark">The <span className="hl">Apex Strategy</span></h2>
              <p className="apex-sub">For institutions, endowments, family offices, and UHNW individuals.</p>
              <p className="apex-desc">A high-conviction portfolio of 15–20 companies, selected from across MUSEDATA's full investing platform. Each deal is rigorously sourced and underwritten by the Office of the CIO with an emphasis on return potential, ownership, and strategic alignment with top-tier co-investors.</p>
              <div className="apex-checks">
                {[
                  "Ideal for family offices, institutions, and UHNW individuals",
                  "Concentrated exposure to MUSEDATA's most compelling opportunities",
                  "Fund structure, economics, and governance aligned with institutional VC standards",
                  "Rigorously sourced and underwritten by the Office of the CIO",
                ].map(item => (
                  <div key={item} className="apex-check-item"><div className="bc-dot" /> {item}</div>
                ))}
              </div>
              <div className="apex-contact">
                <span>For more information, contact:</span>
                <a href="mailto:partners@musedata.ai">partners@musedata.ai</a>
              </div>
            </div>
            <div>
              <div className="apex-card">
                <div className="apex-card-label">Apex Strategy</div>
                {[{v:"15–20",k:"Portfolio Companies"},{v:"CIO-Selected",k:"Office of the CIO"},{v:"Institutional",k:"Fund Structure & Governance"}].map(({v,k},i) => (
                  <div key={k}>
                    <div className="apex-card-stat">
                      <div className="apex-stat-val">{v}</div>
                      <div className="apex-stat-key">{k}</div>
                    </div>
                    {i < 2 && <div className="apex-divider" />}
                  </div>
                ))}
                <div className="apex-divider" />
                <div>
                  <div className="apex-stat-key" style={{ marginBottom: 10 }}>Designed for</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap: 8 }}>
                    {["Institutions","Endowments","Family Offices","UHNW Individuals"].map(t => (
                      <span key={t} className="apex-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <a href="mailto:partners@musedata.ai" className="btn-primary" style={{ width:"100%", textAlign:"center", marginTop: 28, display:"block" }}>
                  <span>Contact partners@musedata.ai →</span>
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FUND STRUCTURE ── */}
      <section id="structure" className="section-pad" style={{ background:"#fff", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div className="section-inner">
          <FadeUp className="section-intro">
            <div>
              <div className="eyebrow">Fund Structure</div>
              <h2 className="section-h2">Fund Structure<br /><span className="hl">at a Glance</span></h2>
            </div>
            <div>
              <p className="section-sub">Transparent terms, one-time capital call, no surprises. MUSEDATA's structure is designed to align entirely with your interests over the full 10-year fund life.</p>
            </div>
          </FadeUp>
          <FadeUp className="struct-grid">
            {STRUCT_ITEMS.map(({ label, val }) => (
              <div key={label} className="struct-item">
                <div className="struct-label">{label}</div>
                <div className="struct-val">{val}</div>
              </div>
            ))}
            <div className="struct-item struct-item-wide">
              <div className="struct-label">Retirement Account Investing</div>
              <div className="struct-val">✓ <strong>Yes</strong> — IRA and other retirement accounts welcome</div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SIGNUP ── */}
      <section id="signup" style={{ background:"var(--bg)", borderTop:"1px solid var(--border)" }}>
        <div className="signup-inner">
          <div className="signup-left">
            <div className="eyebrow light">Get Started</div>
            <h2 className="signup-h2">Invest in the next<br /><span className="hl">generation of companies</span></h2>
            <p className="signup-sub">Join thousands of accredited investors already building institutional-grade venture portfolios through MUSEDATA.</p>
            <div className="signup-perks">
              {["$10,000 minimum investment","20–30 company diversification","Automatic syndicate deal access","Real-time portfolio updates","On-time K-1 delivery"].map(p => (
                <div key={p} className="signup-perk">{p}</div>
              ))}
            </div>
          </div>
          <div className="signup-right">
            {confirmed ? (
              <div className="signup-confirmed">
                <div className="confirmed-check">✓</div>
                <div className="confirmed-title">Application Received</div>
                <div className="confirmed-desc">Our investor relations team will be in touch within 1–2 business days.</div>
              </div>
            ) : (
              <div className="signup-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="fn">First Name</label>
                    <input id="fn" className="form-input" type="text" placeholder="Jane" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="ln">Last Name</label>
                    <input id="ln" className="form-input" type="text" placeholder="Smith" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input id="email" className="form-input" type="email" placeholder="jane@example.com" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="fund">Fund of Interest</label>
                  <select id="fund" className="form-input">
                    <option value="">Select a fund type…</option>
                    <option>Alumni Fund</option>
                    <option>Focused / Sector Fund</option>
                    <option>Foundation Fund</option>
                    <option>Apex Strategy (Institutions)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="amount">Investment Amount</label>
                  <input id="amount" className="form-input" type="text" placeholder="$50,000" />
                </div>
                <button className="form-submit" onClick={() => setConfirmed(true)}>
                  <span>Submit Application →</span>
                </button>
                <p className="form-note">For accredited investors only. All information is kept strictly confidential and used solely for investment evaluation purposes.</p>
              </div>
            )}
          </div>
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