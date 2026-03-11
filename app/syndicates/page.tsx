'use client'
import UnifiedNavbar, { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState, useEffect, useRef } from "react";

// ── Global styles (keyframes + utility classes only) ─────────────────────────
const globalStyles = `
@import url('https://cdn.jsdelivr.net/fontsource/fonts/clear-sans@latest/index.css');

:root {
  --obsidian: #ffffff;
  --gold: #1e5f7e;
  --gold-2: #2a7fa8;
  --gold-dim: rgba(30,95,126,0.08);
  --gold-line: rgba(30,95,126,0.22);
  --teal: #1e5f7e;
  --teal-bright: #2a7fa8;
  --white: #0b1e28;
  --white-dim: #6a7a8a;
  --white-ghost: rgba(30,95,126,0.04);
  --border: rgba(30,95,126,0.14);
  --border-mid: rgba(30,95,126,0.26);
  --shadow-card: 0 6px 32px rgba(11,30,40,0.10), 0 2px 8px rgba(11,30,40,0.06);
  --dark-bg: #0f3247;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: #fff;
  color: var(--white);
  font-family: 'Clear Sans', sans-serif;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.028;
  pointer-events: none;
  z-index: 9999;
}

@keyframes livepulse {
  0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(39,174,96,0.5); }
  50%      { opacity:0.7; box-shadow: 0 0 0 4px rgba(39,174,96,0); }
}
@keyframes dcfill  { from { width: 0; } to { width: 73%; } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes pdot    { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
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

.fade-up {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1),
              transform  0.8s cubic-bezier(0.4,0,0.2,1);
}
.fade-up.visible { opacity: 1; transform: translateY(0); }

section, footer, nav { max-width: 100vw; }
`;

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn);
    fn();
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return mobile;
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function Eyebrow({ children, hero }: { children: React.ReactNode; hero?: boolean }) {
  return (
    <div style={{
      fontFamily: "'Clear Sans', sans-serif",
      fontSize: "0.6875rem",
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: hero ? "var(--teal-bright)" : "var(--teal)",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}>
      <span style={{
        width: 28, height: 1, flexShrink: 0, display: "block",
        background: `linear-gradient(90deg, ${hero ? "var(--teal-bright)" : "var(--teal)"}, transparent)`,
      }} />
      {children}
    </div>
  );
}

function BtnGold({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <a href={href} style={{
      fontFamily: "'Clear Sans', sans-serif",
      fontSize: "0.875rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      fontWeight: 600,
      color: "#fff",
      background: "var(--teal)",
      padding: "16px 40px",
      border: "none",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
      touchAction: "manipulation",
      ...style,
    }}>
      {children}
    </a>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const mobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 500,
        padding: mobile ? "0 20px" : "0 64px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px) saturate(1.5)",
        borderBottom: "1px solid var(--border)",
      }}>
        <a href="#home" style={{
          fontFamily: "'Clear Sans', sans-serif", fontWeight: 600, fontSize: "1rem",
          letterSpacing: "0.22em", color: "var(--white)", textDecoration: "none",
        }}>
          MUSE<span style={{ color: "var(--gold)" }}>DATA</span>
        </a>

        {!mobile && (
          <ul style={{ display: "flex", gap: 40, listStyle: "none" }}>
            {["How It Works", "Syndicates", "Deals", "Compare"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/ /g, "")}`} style={{
                  fontFamily: "'Clear Sans', sans-serif", fontSize: "0.8125rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--white-dim)", textDecoration: "none",
                }}>{item}</a>
              </li>
            ))}
          </ul>
        )}

        {mobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, touchAction: "manipulation" }}
            aria-label="Toggle menu"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: 24, height: 1.5, background: "var(--white)", borderRadius: 1 }} />
            ))}
          </button>
        ) : (
          <button style={{
            fontFamily: "'Clear Sans', sans-serif", fontSize: "0.8125rem",
            letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
            color: "#fff", background: "var(--teal)", padding: "10px 24px",
            border: "none", cursor: "pointer",
          }}>Join Network</button>
        )}
      </nav>

      {mobile && menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 499,
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "16px 20px 24px", display: "flex", flexDirection: "column",
        }}>
          {["How It Works", "Syndicates", "Deals", "Compare"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--white)", textDecoration: "none",
                padding: "16px 0", borderBottom: "1px solid var(--border)",
              }}>{item}</a>
          ))}
          <a href="#signup" onClick={() => setMenuOpen(false)} style={{
            marginTop: 20, display: "block", textAlign: "center",
            background: "var(--teal)", color: "#fff", padding: "14px 24px",
            fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem",
            letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
            textDecoration: "none",
          }}>Join Network</a>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function DealCard() {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border-mid)",
      width: "100%", maxWidth: 400, boxShadow: "var(--shadow-card)", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--teal), var(--teal-bright), transparent)" }} />
      <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--teal)", fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, background: "#27ae60", borderRadius: "50%", animation: "livepulse 2s ease infinite", display: "inline-block" }} />
          Live Syndication
        </div>
        <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)" }}>AI Infrastructure</div>
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "2.25rem", fontWeight: 600, color: "#0b1e28", lineHeight: 1, marginBottom: 6 }}>Lambda</div>
        <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.75rem", color: "rgba(107,122,138,0.5)", marginBottom: 24 }}>AI Infrastructure &amp; Tools • Series C</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", marginBottom: 20, border: "1px solid var(--border)" }}>
          {[["$120M","Series C"],["3.2×","Revenue Growth"],["72h","QoE Sprint"],["A+","Diligence Score"]].map(([v,k]) => (
            <div key={k} style={{ background: "#fff", padding: "14px 18px" }}>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#0b1e28", lineHeight: 1, marginBottom: 4 }}>{v}</div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)" }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", color: "rgba(107,122,138,0.5)" }}>
            <span>73% Allocated</span><span>$2.7M remaining</span>
          </div>
          <div style={{ height: 2, background: "rgba(30,95,126,0.12)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0f3247, var(--teal))", width: "73%", animation: "dcfill 2.2s cubic-bezier(0.4,0,0.2,1) forwards" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)" }}>
          <span>Co-investor</span>
          <span style={{ border: "1px solid var(--border-mid)", color: "var(--teal)", padding: "4px 12px" }}>Gradient Ventures</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const mobile = useIsMobile();
  return (
    <section id="home" style={{
      minHeight: "100svh",
      display: "grid",
      gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
      position: "relative",
      overflow: "hidden",
      background: "#0f3247",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 100% 50%, black 0%, transparent 80%)",
        maskImage: "radial-gradient(ellipse 70% 80% at 100% 50%, black 0%, transparent 80%)",
        pointerEvents: "none",
      }} />

      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: mobile ? "96px 20px 56px" : "100px 72px 80px",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow hero>Syndicates &amp; Co-Investment · Accredited Investors Only</Eyebrow>
        </div>
        <h1 style={{
          fontFamily: "'Clear Sans', sans-serif",
          fontSize: mobile ? "1.875rem" : "clamp(2.5rem,4.5vw,4rem)",
          fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.01em",
          color: "#fff", marginBottom: 20, maxWidth: 560,
        }}>
          Access{" "}
          <span style={{ color: "var(--teal-bright)" }}>institutional-grade</span>
          {" "}deal flow in enterprise software and AI.
        </h1>
        <p style={{
          fontFamily: "'Clear Sans', sans-serif",
          fontSize: mobile ? "0.9375rem" : "0.9375rem",
          lineHeight: 1.75, color: "rgba(255,255,255,0.5)",
          maxWidth: 420, marginBottom: 32, fontWeight: 300,
        }}>
          We partner with the world's top-tier venture funds to bring co-investment opportunities in enterprise software and AI to accredited investors at the $10,000 per deal minimum.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <BtnGold href="#signup" style={{ padding: mobile ? "14px 28px" : "16px 40px" }}>See Live Deals</BtnGold>
          <a href="#howitworks" style={{
            fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem",
            letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
            color: "rgba(255,255,255,0.55)", background: "transparent",
            padding: mobile ? "13px 24px" : "15px 36px",
            border: "1px solid rgba(255,255,255,0.18)",
            textDecoration: "none", display: "inline-block",
          }}>How It Works</a>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 0,
          marginTop: 44, paddingTop: 32,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          {[
            { num: "$10K", label: "Minimum Per Deal" },
            { num: "$25M", label: "Max Check Size" },
            { num: "$0",   label: "Membership Fees" },
          ].map((s, i) => (
            <div key={i} style={{
              paddingRight: i < 2 ? 16 : 0,
              paddingLeft: i > 0 ? 16 : 0,
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}>
              <div style={{
                fontFamily: "'Clear Sans', sans-serif",
                fontSize: mobile ? "1.625rem" : "2rem",
                fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 6,
              }}>{s.num}</div>
              <div style={{
                fontFamily: "'Clear Sans', sans-serif",
                fontSize: mobile ? "0.5625rem" : "0.625rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)", fontWeight: 500,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Deal card shown inline on mobile */}
        {mobile && (
          <div style={{ marginTop: 40 }}>
            <DealCard />
          </div>
        )}
      </div>

      {!mobile && (
        <div style={{
          position: "relative", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "120px 48px", zIndex: 2,
        }}>
          <div style={{ position: "absolute", top: 20, right: "calc(50% - 220px)", width: 400, height: 480, background: "#fff", border: "1px solid var(--border)", zIndex: -1 }} />
          <div style={{ position: "absolute", top: 40, right: "calc(50% - 240px)", width: 400, height: 480, background: "#fff", border: "1px solid rgba(30,95,126,0.08)", zIndex: -2 }} />
          <DealCard />
        </div>
      )}
    </section>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
const marqueeItems = ["Enterprise Software","Enterprise AI","Sequoia","a16z","Benchmark","Infrastructure Software","General Catalyst","SaaS & Platforms","NVIDIA","AI Workflows","Accel","Gradient Ventures"];

function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div style={{
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      padding: "18px 0", overflow: "hidden", background: "#fff", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 60, background: "linear-gradient(90deg, #fff, transparent)", zIndex: 2 }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 60, background: "linear-gradient(-90deg, #fff, transparent)", zIndex: 2 }} />
      <div style={{ display: "flex", width: "max-content", animation: "marquee 32s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span style={{
              fontFamily: "'Clear Sans', sans-serif", fontSize: "0.625rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(107,122,138,0.45)", padding: "0 36px", whiteSpace: "nowrap",
            }}>{item}</span>
            <span style={{ width: 3, height: 3, background: "var(--teal)", borderRadius: "50%", opacity: 0.35 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const steps = [
  { num: "01", title: "Join the Network",         desc: "Sign up in seconds. No fees, no obligations. Confirm your accredited investor status and gain immediate access to the MUSEDATA deal feed.",                day: "Day 1"   },
  { num: "02", title: "Receive the Evidence Pack", desc: "Every deal ships with a full QoE evidence pack — financials, cap table, market analysis, IC call recording, and our proprietary investment memo.",      day: "Day 2–3" },
  { num: "03", title: "Join the IC Call",          desc: "Live access to the MUSEDATA investment committee. Ask questions, stress-test the thesis, and invest with complete clarity — not in the dark.",           day: "Day 4–5" },
  { num: "04", title: "Commit & Close",            desc: "Choose your allocation. Wire funds through our secure platform. Receive ongoing board-level reporting and K-1s every tax season.",                       day: "Day 6–7" },
];

function HowItWorks() {
  const mobile = useIsMobile();
  const ref = useFadeUp();
  return (
    <section id="howitworks" style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: mobile ? "0 20px" : "0 72px" }}>
        <div style={{
          padding: mobile ? "56px 0 40px" : "96px 0 72px",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 16 : 80,
          alignItems: "end",
          borderBottom: "1px solid var(--border)",
        }}>
          <div ref={ref} className="fade-up">
            <Eyebrow>The Process</Eyebrow>
            <h2 style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.875rem" : "clamp(2rem,3vw,3rem)", fontWeight: 400, color: "var(--white)", lineHeight: 1, marginTop: 16 }}>
              From Deal Sourcing<br />to <span style={{ color: "var(--gold-2)" }}>Closing Day</span>
            </h2>
          </div>
          <p style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--white-dim)", fontWeight: 300 }}>
            Every syndication follows a rigorous institutional process. You're never just wiring money — you're investing with the same depth of analysis used by the world's top enterprise software and AI investors.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(4,1fr)",
          borderRight: mobile ? "none" : "1px solid var(--border)",
        }}>
          {steps.map((s, i) => <HowStep key={i} step={s} delay={i * 0.1} mobile={mobile} />)}
        </div>
      </div>
    </section>
  );
}

function HowStep({ step, delay, mobile }: { step: typeof steps[0]; delay: number; mobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => el.classList.add("visible"), delay * 1000);
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="fade-up" style={{
      padding: mobile ? "32px 0" : "52px 40px 56px",
      borderLeft: mobile ? "none" : "1px solid var(--border)",
      borderBottom: mobile ? "1px solid var(--border)" : "none",
    }}>
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "2.75rem", fontWeight: 300, color: "rgba(201,168,76,0.1)", lineHeight: 1, marginBottom: 18, letterSpacing: "-0.04em" }}>{step.num}</div>
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", fontWeight: 600, color: "var(--white)", marginBottom: 10 }}>{step.title}</div>
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.75, color: "var(--white-dim)", fontWeight: 300 }}>{step.desc}</div>
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)", fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500 }}>{step.day}</div>
    </div>
  );
}

// ── Syndicates ────────────────────────────────────────────────────────────────
const sectorCards = [
  { num: "01", name: "Enterprise AI Platforms",      desc: "AI-native SaaS and workflow platforms replacing legacy enterprise software across every business function." },
  { num: "02", name: "AI Infrastructure & Tools",    desc: "The compute, orchestration, and developer tooling layer powering the enterprise AI stack." },
  { num: "03", name: "Vertical SaaS",                desc: "Category-defining software built for specific industries — healthcare, finance, legal, logistics, and beyond." },
  { num: "04", name: "Data & Analytics",             desc: "Enterprise data infrastructure, business intelligence, and AI-driven analytics platforms at scale." },
  { num: "05", name: "Cybersecurity & Trust",        desc: "Zero-trust architecture, AI-native threat defense, and identity infrastructure for the enterprise." },
  { num: "06", name: "Developer & DevOps Platforms", desc: "Next-generation development platforms, MLOps tooling, and the infrastructure software teams run on." },
  { num: "07", name: "AI-Enabled Fintech",           desc: "Enterprise financial software, AI-driven risk platforms, and next-generation treasury and compliance tools." },
  { num: "08", name: "Supply Chain & Operations",    desc: "AI-powered logistics, procurement, and operations software transforming enterprise efficiency at scale." },
  { num: "09", name: "Enterprise Collaboration",     desc: "Intelligent communication, knowledge management, and productivity platforms built for the modern workforce." },
];

const alumniCards = [
  { num: "01", name: "Operator Network Syndicate",     desc: "Co-invest alongside seasoned operators and founders building category-defining companies." },
  { num: "02", name: "West Coast Innovation Network",  desc: "The most active investor network in Silicon Valley, backing the next generation of high-conviction founders." },
  { num: "03", name: "Deep Tech Founders Circle",      desc: "Deep tech, AI, and frontier science from the most rigorous research and entrepreneurship ecosystems." },
  { num: "04", name: "Global Capital Network",         desc: "Precision-focused investments backed by a global network of founders, operators, and capital allocators." },
  { num: "05", name: "Emerging Markets Syndicate",     desc: "High-growth opportunities in emerging markets with outsized potential and proven operator networks." },
  { num: "06", name: "Institutional Founders Network", desc: "A tight-knit investor network with outsized conviction in early-stage opportunities across all sectors." },
];

type SynTab = "sector" | "full" | "alumni";

function Syndicates() {
  const [tab, setTab] = useState<SynTab>("sector");
  const mobile = useIsMobile();
  const ref = useFadeUp();
  const cards = tab === "sector" ? sectorCards : tab === "alumni" ? alumniCards : [];

  return (
    <section id="syndicates" style={{ background: "var(--obsidian)", padding: mobile ? "56px 20px" : "112px 72px" }}>
      <div ref={ref} className="fade-up" style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
        gap: mobile ? 16 : 80,
        alignItems: "end",
        marginBottom: 40,
        maxWidth: 1320, marginLeft: "auto", marginRight: "auto",
      }}>
        <div>
          <Eyebrow>Syndicates</Eyebrow>
          <h2 style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.875rem" : "clamp(2rem,3vw,3rem)", fontWeight: 400, color: "var(--white)", lineHeight: 1, marginTop: 16 }}>
            Invest With<br /><span style={{ color: "var(--gold-2)" }}>Conviction</span>
          </h2>
        </div>
        <p style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", lineHeight: 1.9, color: "var(--white-dim)", fontWeight: 300 }}>
          From broad market exposure to deep sector focus — every syndicate backed by full-time domain specialists co-investing in enterprise software and AI.
        </p>
      </div>

      <div style={{
        display: "flex", border: "1px solid var(--border)",
        width: "100%", maxWidth: 1320,
        marginBottom: 32, marginLeft: "auto", marginRight: "auto",
      }}>
        {(["sector","full","alumni"] as SynTab[]).map((t, i) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1,
            fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem",
            letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500,
            padding: mobile ? "13px 8px" : "14px 28px",
            border: "none", borderRight: i < 2 ? "1px solid var(--border)" : "none",
            background: tab === t ? "var(--gold)" : "transparent",
            color: tab === t ? "#fff" : "rgba(245,240,232,0.4)",
            cursor: "pointer", whiteSpace: "nowrap", touchAction: "manipulation",
          }}>
            {t === "sector" ? "By Sector" : t === "full" ? "Full Access" : "Networks"}
          </button>
        ))}
      </div>

      {tab === "full" ? (
        <div style={{ border: "1px solid var(--border)", background: "var(--border)", maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ background: "#fff", padding: mobile ? "32px 20px" : 52 }}>
            <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "var(--white)", marginBottom: 12 }}>Full MUSEDATA Access</div>
            <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", color: "var(--white-dim)", lineHeight: 1.75, maxWidth: 680, marginBottom: 24, fontWeight: 300 }}>
              Tap into the complete MUSEDATA deal flow. All enterprise software and AI sectors, sourced and vetted by our 8+ full-time investing professionals.
            </div>
            <BtnGold href="#signup">Join Full Syndicate →</BtnGold>
          </div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)",
          gap: 1, background: "var(--border)",
          border: "1px solid var(--border)",
          maxWidth: 1320, margin: "0 auto",
        }}>
          {cards.map((c) => <SynCard key={c.num} card={c} />)}
        </div>
      )}
    </section>
  );
}

function SynCard({ card }: { card: typeof sectorCards[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "#f5f0e8" : "#fff", padding: "32px 24px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "background 0.3s" }}
    >
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--gold), transparent)", transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", fontWeight: 300, color: "rgba(201,168,76,0.3)", marginBottom: 14 }}>{card.num}</div>
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", fontWeight: 600, color: "var(--white)", marginBottom: 10 }}>{card.name}</div>
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--white-dim)", fontWeight: 300 }}>{card.desc}</div>
      <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginTop: 14, fontWeight: 500, opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)", transition: "all 0.3s" }}>View Deals →</div>
    </div>
  );
}

// ── Deals / Pipeline ──────────────────────────────────────────────────────────
const pipeline = [
  { num: "01", sector: "Enterprise AI Platform",  round: "Series B", size: "$45–60M",  co: "Tier-I Co-Lead",      status: "QoE Sprint Active", progress: 78, delay: 0    },
  { num: "02", sector: "Infrastructure Software", round: "Series C", size: "$80–100M", co: "Top-Quartile Growth", status: "IC Memo In Review", progress: 52, delay: 0.07 },
  { num: "03", sector: "Vertical SaaS",           round: "Series B", size: "$30–40M",  co: "Category Leader",     status: "Financial Review",  progress: 31, delay: 0.14 },
];

function Deals() {
  const mobile = useIsMobile();
  const ref = useFadeUp();
  return (
    <section id="deals" style={{ background: "#fff", padding: mobile ? "56px 20px" : "112px 72px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 420px", gap: mobile ? 44 : 64, alignItems: "start" }}>
        <div>
          <div ref={ref} className="fade-up"><Eyebrow>Active Pipeline</Eyebrow></div>
          <h2 className="fade-up" style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.875rem" : "clamp(2rem,3vw,3rem)", fontWeight: 400, color: "var(--white)", lineHeight: 1, margin: "16px 0 12px" }}>
            Deals Under<br /><span style={{ color: "var(--gold-2)" }}>Diligence</span>
          </h2>
          <p className="fade-up" style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--white-dim)", fontWeight: 300, marginBottom: 32, maxWidth: 480 }}>
            Our investment team is conducting deep QoE analysis on a curated set of enterprise software and AI opportunities.
          </p>

          {/* Pipeline stages */}
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--border)", marginBottom: 28 }}>
            {[
              { label: "Sourced",      val: "12",  active: false },
              { label: "Screened",     val: "6",   active: false },
              { label: "In Diligence", val: "3",   active: true  },
              { label: "Opening Soon", val: "TBD", active: false },
            ].map((s) => (
              <div key={s.label} style={{
                padding: mobile ? "12px 8px" : "18px 16px",
                borderRight: "1px solid var(--border)",
                position: "relative",
                background: s.active ? "rgba(30,95,126,0.04)" : undefined,
              }}>
                {s.active && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--teal)" }} />}
                <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "0.5rem" : "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(107,122,138,0.4)", marginBottom: 5, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1rem" : "1.25rem", fontWeight: 600, color: s.active ? "var(--teal)" : s.val === "TBD" ? "rgba(107,122,138,0.25)" : "#0b1e28", lineHeight: 1 }}>{s.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {pipeline.map((p) => <PipelineCard key={p.num} item={p} mobile={mobile} />)}
          </div>

          <div className="fade-up" style={{
            border: "1px solid var(--border)", background: "linear-gradient(135deg, rgba(30,95,126,0.03) 0%, rgba(30,95,126,0.06) 100%)",
            padding: mobile ? "20px 16px" : "28px 32px",
            display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr auto",
            gap: 16, alignItems: "center", marginTop: 24,
          }}>
            <div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--teal)", fontWeight: 600, marginBottom: 6 }}>Member-First Notification</div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.75, color: "var(--white-dim)", fontWeight: 300 }}>Members receive deal materials and allocation access the moment a syndication clears our QoE threshold.</div>
            </div>
            <BtnGold href="#signup" style={{ whiteSpace: "nowrap", marginTop: mobile ? 12 : 0 }}>Join the Network →</BtnGold>
          </div>
        </div>

        {/* Diligence panel */}
        <div className="fade-up" style={{
          background: "#f8f4ef", border: "1px solid var(--border-mid)",
          padding: mobile ? "24px 20px" : "40px 40px",
          position: mobile ? "static" : "sticky", top: 80,
        }}>
          <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)", fontWeight: 500 }}>What Every Deal Includes</div>
          {[
            { title: "Full Financial Diligence",    desc: "Reconciled income statements, cap table, burn, and runway analysis from our CFO team." },
            { title: "72-Hour QoE Evidence Sprint",  desc: "Quality of Earnings review delivered before you need to decide." },
            { title: "IC Call Recording",            desc: "Full investment committee discussion, unedited, for your own analysis." },
            { title: "Proprietary Investment Memo",  desc: "Our team's thesis, risk factors, and comp set analysis." },
            { title: "Live Deal Discussion",         desc: "Direct access to the MUSEDATA deal lead and team for Q&A." },
            { title: "Ongoing Board Reporting",      desc: "Monthly KPI dashboards, financial reporting, and on-time K-1s at tax season." },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, border: "1px solid var(--gold-line)", background: "var(--gold-dim)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                <span style={{ display: "block", width: 7, height: 4.5, borderLeft: "1.5px solid var(--gold)", borderBottom: "1.5px solid var(--gold)", transform: "rotate(-45deg) translateY(-1px)" }} />
              </div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.65, color: "var(--white-dim)", fontWeight: 300 }}>
                <strong style={{ color: "var(--white)", fontWeight: 600 }}>{item.title}</strong> {item.desc}
              </div>
            </div>
          ))}
          <BtnGold href="#signup" style={{ marginTop: 18, display: "inline-block" }}>Access Deal Flow →</BtnGold>
        </div>
      </div>
    </section>
  );
}

function PipelineCard({ item, mobile }: { item: typeof pipeline[0]; mobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => el.classList.add("visible"), item.delay * 1000);
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [item.delay]);

  return (
    <div ref={ref} className="fade-up" style={{ background: "#fff", border: "1px solid var(--border-mid)", position: "relative", overflow: "hidden", marginBottom: 1 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, var(--teal), var(--teal-bright))" }} />
      <div style={{ padding: mobile ? "18px 16px 18px 20px" : "22px 24px 22px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 }}>
          <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", fontWeight: 600, color: "#0b1e28" }}>{item.sector}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8a838", animation: "pdot 2.4s ease infinite", display: "inline-block" }} />
            <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.5625rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#b07a20", fontWeight: 500 }}>{item.status}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[item.round, item.size, item.co].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--white-dim)" }}>{t}</span>
              {i < 2 && <span style={{ color: "var(--border-mid)" }}>·</span>}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: mobile ? "10px 20px 14px" : "12px 28px 16px", borderTop: "1px solid rgba(30,95,126,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,122,138,0.5)", whiteSpace: "nowrap", flexShrink: 0 }}>Diligence</span>
        <div style={{ flex: 1, height: 1, background: "rgba(30,95,126,0.1)", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, background: "linear-gradient(90deg, var(--teal), var(--teal-bright))", width: `${item.progress}%` }} />
        </div>
        <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,122,138,0.5)", flexShrink: 0 }}>{item.progress}%</span>
      </div>
    </div>
  );
}

// ── Voices ────────────────────────────────────────────────────────────────────
const voices = [
  { num: "01", quote: "The deal quality is unlike anything I've accessed outside of a top-tier fund. Every opportunity arrives with the depth of analysis I'd expect from an institutional IC — not a syndicate.", name: "Sarah Chen",     role: "Angel Investor · MUSEDATA Syndicate Member" },
  { num: "02", quote: "Two deals in and I already feel like I'm operating at a different level. You're never just wiring money — you understand exactly what you're investing in and why.",                     name: "Marcus O'Brien", role: "Family Office Principal · MUSEDATA Fund Investor" },
];

function Voices() {
  const mobile = useIsMobile();
  const ref = useFadeUp();
  return (
    <section id="voices" style={{ background: "#fff", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: mobile ? "0 20px" : "0 72px" }}>
        <div ref={ref} className="fade-up" style={{ padding: mobile ? "48px 0 28px" : "72px 0 48px", borderBottom: "1px solid var(--border)" }}>
          <Eyebrow>Investor Voices</Eyebrow>
          <h2 style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.625rem" : "1.75rem", fontWeight: 400, color: "var(--white)", lineHeight: 1.2, marginTop: 12 }}>
            Heard from the <span style={{ color: "var(--gold-2)" }}>Inside</span>
          </h2>
        </div>
        {voices.map((v) => (
          <div key={v.num} style={{
            padding: mobile ? "28px 0" : "40px 0",
            borderBottom: "1px solid rgba(201,168,76,0.08)",
            display: "flex", gap: mobile ? 16 : 32,
            alignItems: "flex-start",
          }}>
            <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", fontWeight: 300, color: "rgba(11,30,40,0.18)", flexShrink: 0, marginTop: 3 }}>{v.num}</div>
            <div>
              <p style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "0.9375rem" : "0.9375rem", fontWeight: 300, color: "#0f3247", lineHeight: 1.7, marginBottom: 14 }}>
                "{v.quote}"
              </p>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.8125rem", fontWeight: 600, color: "#0f3247", marginBottom: 2 }}>{v.name}</div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(11,30,40,0.4)", lineHeight: 1.7 }}>{v.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Compare ───────────────────────────────────────────────────────────────────
const compareRows = [
  { label: "Portfolio",        fund: { strong: "20–30 companies", rest: " selected by our team" },          syn: { strong: "1–2 deals/month", rest: " you choose each one" } },
  { label: "Control",          fund: { strong: "",                rest: "Hands-off — we deploy your capital" }, syn: { strong: "", rest: "Full control — invest only in what you believe" } },
  { label: "Diligence",        fund: { strong: "",                rest: "Board-layer KPI reporting & K-1s" },   syn: { strong: "", rest: "Full diligence pack + IC call access per deal" } },
  { label: "Syndicate Access", fund: { strong: "",                rest: "Automatically included at no extra cost" }, syn: { strong: "", rest: "Direct deal-by-deal, no obligation" } },
  { label: "Participation",    fund: { strong: "",                rest: "Passive — we handle everything" },       syn: { strong: "", rest: "Active — live team Q&A on every deal" } },
];

function Compare() {
  const mobile = useIsMobile();
  const ref = useFadeUp();
  return (
    <section id="compare" style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div ref={ref} className="fade-up" style={{
          padding: mobile ? "48px 20px 36px" : "96px 72px 72px",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 480px",
          gap: mobile ? 20 : 80,
          alignItems: "end",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <Eyebrow>Investing Options</Eyebrow>
            <h2 style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.875rem" : "clamp(2rem,3vw,3rem)", fontWeight: 400, color: "var(--white)", lineHeight: 1, marginTop: 16 }}>
              Fund vs. <span style={{ color: "var(--gold-2)" }}>Syndicate</span>
            </h2>
          </div>
          <div>
            <p style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--white-dim)", fontWeight: 300, marginBottom: 18 }}>
              Two paths to institutional-grade venture exposure. Both start at $10,000. Neither has hidden fees.
            </p>
            <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ flex: 1, height: 1, background: "var(--border-mid)", maxWidth: 40, display: "block" }} />
              Both paths. Zero hidden fees.
              <span style={{ flex: 1, height: 1, background: "var(--border-mid)", maxWidth: 40, display: "block" }} />
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr 1fr" : "280px 1fr 1fr",
          background: "#0f3247",
          borderBottom: "1px solid var(--border)",
        }}>
          {!mobile && <div style={{ padding: "40px 48px", borderRight: "1px solid var(--border)" }} />}
          {[
            { type: "Portfolio Investment",      title: "Invest in a Fund", desc: "Hands-off, diversified exposure across 20–30 companies.",  rec: false },
            { type: "Single Company Investment", title: "Syndicate Deals",  desc: "Maximum conviction. Pick every company you back.",          rec: true  },
          ].map((col, i) => (
            <div key={col.title} style={{ padding: mobile ? "24px 16px" : "40px 52px", borderRight: i === 0 ? "1px solid var(--border)" : "none", position: "relative" }}>
              {col.rec && <div style={{ position: "absolute", top: 0, right: 0, fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "0.5625rem" : "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, background: "var(--gold)", color: "#fff", padding: "5px 10px" }}>Recommended</div>}
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.5625rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", fontWeight: 500, marginBottom: 8 }}>{col.type}</div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.125rem" : "1.375rem", fontWeight: 600, color: "#fff", marginBottom: 8, lineHeight: 1.1 }}>{col.title}</div>
              <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "0.75rem" : "0.8125rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, fontWeight: 300 }}>{col.desc}</div>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {compareRows.map((row) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "280px 1fr 1fr", borderBottom: "1px solid rgba(30,95,126,0.07)" }}>
            {!mobile && (
              <div style={{ padding: "22px 48px", borderRight: "1px solid rgba(30,95,126,0.07)", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)" }}>{row.label}</span>
              </div>
            )}
            {[row.fund, row.syn].map((cell, i) => (
              <div key={i} style={{ padding: mobile ? "18px 14px" : "22px 52px", borderRight: i === 0 ? "1px solid rgba(30,95,126,0.07)" : "none", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: i === 1 ? 7 : 5, height: i === 1 ? 7 : 5, minWidth: i === 1 ? 7 : 5, borderRadius: "50%", background: i === 1 ? "var(--teal)" : "rgba(30,95,126,0.25)", marginTop: 5, flexShrink: 0 }} />
                <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "0.8125rem" : "0.9375rem", color: "#6a7a8a", lineHeight: 1.55, fontWeight: 300 }}>
                  {mobile && <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)", marginBottom: 3, fontWeight: 600 }}>{row.label}</div>}
                  {cell.strong && <strong style={{ color: "#0b1e28", fontWeight: 600 }}>{cell.strong}</strong>}{cell.rest}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Minimum row */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "280px 1fr 1fr", borderBottom: "1px solid rgba(30,95,126,0.07)", background: "#fff" }}>
          {!mobile && (
            <div style={{ padding: "22px 48px", borderRight: "1px solid rgba(30,95,126,0.07)", display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)" }}>Minimum</span>
            </div>
          )}
          {[{ val: "$10,000", suffix: "one-time" }, { val: "$10,000", suffix: "per deal" }].map((cell, i) => (
            <div key={i} style={{ padding: mobile ? "18px 14px" : "22px 52px", borderRight: i === 0 ? "1px solid rgba(30,95,126,0.07)" : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {mobile && <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(107,122,138,0.45)", marginBottom: 3, fontWeight: 600 }}>Minimum</div>}
              <span style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "1.125rem" : "1.375rem", fontWeight: 600, color: "#0f3247", letterSpacing: "-0.01em" }}>
                {cell.val}{" "}
                <span style={{ fontSize: "0.6875rem", fontWeight: 400, color: "rgba(107,122,138,0.45)" }}>{cell.suffix}</span>
              </span>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "280px 1fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
          {!mobile && <div style={{ padding: "32px 48px", borderRight: "1px solid var(--border)" }} />}
          <div style={{ padding: mobile ? "20px 14px" : "32px 52px", borderRight: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
            <a href="#signup" style={{
              fontFamily: "'Clear Sans', sans-serif", fontSize: mobile ? "0.6875rem" : "0.8125rem",
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500,
              color: "var(--white-dim)", padding: mobile ? "11px 12px" : "14px 28px",
              border: "1px solid var(--border-mid)", textDecoration: "none",
              display: "inline-block", whiteSpace: "nowrap",
            }}>Explore Funds →</a>
          </div>
          <div style={{ padding: mobile ? "20px 14px" : "32px 52px", display: "flex", alignItems: "center" }}>
            <BtnGold href="#signup" style={{ whiteSpace: "nowrap", padding: mobile ? "11px 12px" : "16px 32px", fontSize: mobile ? "0.6875rem" : "0.875rem" }}>See Deals →</BtnGold>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Signup ────────────────────────────────────────────────────────────────────
function Signup() {
  const mobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const submitLP = useMutation(api.limitedPartnerApplications.submitLPApplication);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sectorPreferences: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      setErrorMsg("Please enter your name and email.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      await submitLP({
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        sectorPreferences: form.sectorPreferences || undefined,
        // Default classification — IR team qualifies in CRM
        investorType: "hnwi",
        source: "landing_page_signup",
      });
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", sectorPreferences: "" });
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // ── Shared input style ──────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid var(--border)",
    color: "#0b1e28",
    padding: "13px 16px",
    fontFamily: "'Clear Sans', sans-serif",
    fontSize: "1rem",
    fontWeight: 300,
    outline: "none",
    width: "100%",
    borderRadius: 0,
    WebkitAppearance: "none" as any,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Clear Sans', sans-serif",
    fontSize: "0.6875rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(245,240,232,0.4)",
    fontWeight: 500,
  };

  return (
    <section id="signup" style={{ background: "var(--obsidian)", borderTop: "1px solid var(--border)" }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
      }}>
        {/* ── Left — value prop ─────────────────────────────────────────────── */}
        <div style={{
          padding: mobile ? "48px 20px 36px" : "88px 72px",
          borderRight: mobile ? "none" : "1px solid var(--border)",
          borderBottom: mobile ? "1px solid var(--border)" : "none",
          position: "relative", overflow: "hidden",
        }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: "'Clear Sans', sans-serif",
            fontSize: "0.6875rem", letterSpacing: "0.28em",
            textTransform: "uppercase", color: "var(--teal-bright)",
            fontWeight: 500, display: "flex", alignItems: "center", gap: 14,
            marginBottom: 16,
          }}>
            <span style={{ width: 28, height: 1, flexShrink: 0, display: "block", background: "linear-gradient(90deg, var(--teal-bright), transparent)" }} />
            Get Started
          </div>

          <h2 style={{
            fontFamily: "'Clear Sans', sans-serif",
            fontSize: mobile ? "1.875rem" : "clamp(2rem,3vw,3rem)",
            fontWeight: 400, color: "var(--white)", lineHeight: 1,
            margin: "0 0 16px",
          }}>
            See Elite Deals<br /><span style={{ color: "var(--gold-2)" }}>Free to Join</span>
          </h2>
          <p style={{
            fontFamily: "'Clear Sans', sans-serif", fontSize: "0.9375rem",
            lineHeight: 1.85, color: "var(--white-dim)", fontWeight: 300,
            marginBottom: 36, maxWidth: 380,
          }}>
            Sign up in 5 seconds. No fees, no obligations. Start seeing
            institutional-grade deal flow immediately.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[
              "Immediate access to active syndications",
              "Full diligence materials on every deal",
              "Live IC calls with the investment team",
              "Zero membership fees, ever",
              "$10,000 minimum per deal",
            ].map((perk) => (
              <div key={perk} style={{
                display: "flex", alignItems: "center", gap: 14,
                fontFamily: "'Clear Sans', sans-serif",
                fontSize: "0.875rem", color: "var(--white-dim)", fontWeight: 300,
              }}>
                <span style={{ width: 18, height: 1, background: "var(--gold)", flexShrink: 0, display: "block" }} />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — form ──────────────────────────────────────────────────── */}
        <div style={{ padding: mobile ? "36px 20px 48px" : "88px 72px" }}>

          {/* ── Success state ─────────────────────────────────────────────── */}
          {status === "success" ? (
            <div style={{
              border: "1px solid rgba(39,174,96,0.3)",
              background: "rgba(39,174,96,0.06)",
              padding: "32px 28px",
            }}>
              <div style={{
                fontFamily: "'Clear Sans', sans-serif",
                fontSize: "0.6875rem", letterSpacing: "0.24em",
                textTransform: "uppercase", color: "#27ae60",
                fontWeight: 600, marginBottom: 12,
              }}>
                ✓ &nbsp;You're on the list
              </div>
              <p style={{
                fontFamily: "'Clear Sans', sans-serif",
                fontSize: "0.9375rem", color: "var(--white-dim)",
                lineHeight: 1.75, fontWeight: 300,
              }}>
                Our investor relations team will be in touch within 5 business days
                with your deal feed access and next steps.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                {(["firstName", "lastName"] as const).map((field, i) => (
                  <div key={field} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={labelStyle}>{i === 0 ? "First Name" : "Last Name"}</label>
                    <input
                      type="text"
                      placeholder={i === 0 ? "Your first name" : "Your last name"}
                      value={form[field]}
                      onChange={set(field)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="Preferred personal email"
                  value={form.email}
                  onChange={set("email")}
                  style={inputStyle}
                />
              </div>

              {/* Sector / interest */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Primary Investment Interest</label>
                <select
                  value={form.sectorPreferences}
                  onChange={set("sectorPreferences")}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  <option value="">Select a sector or syndicate…</option>
                  {SECTOR_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Error message */}
              {status === "error" && (
                <div style={{
                  fontFamily: "'Clear Sans', sans-serif",
                  fontSize: "0.8125rem", color: "#e74c3c",
                  padding: "10px 14px",
                  border: "1px solid rgba(231,76,60,0.25)",
                  background: "rgba(231,76,60,0.05)",
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === "submitting"}
                style={{
                  background: status === "submitting" ? "rgba(30,95,126,0.6)" : "var(--teal)",
                  color: "#fff",
                  border: "none",
                  padding: "15px 32px",
                  fontFamily: "'Clear Sans', sans-serif",
                  fontSize: "0.875rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                  alignSelf: mobile ? "stretch" : "flex-start",
                  touchAction: "manipulation",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "background 0.2s",
                }}
              >
                {status === "submitting" ? (
                  <>
                    <span style={{
                      width: 14, height: 14,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                      flexShrink: 0,
                    }} />
                    Submitting…
                  </>
                ) : "Access Deal Flow →"}
              </button>

              {/* Disclaimer */}
              <p style={{
                fontFamily: "'Clear Sans', sans-serif",
                fontSize: "0.6875rem",
                color: "rgba(245,240,232,0.22)",
                letterSpacing: "0.03em",
                lineHeight: 1.9,
                marginTop: 4,
              }}>
                By submitting, you acknowledge you may be an accredited investor
                considering an investment with MUSEDATA. No offer to sell or buy
                securities is made herein. Venture capital investing involves
                substantial risk, including loss of all capital invested.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
const SECTOR_OPTIONS = [
  "Enterprise AI Platforms",
  "AI Infrastructure & Tools",
  "Vertical SaaS",
  "Data & Analytics",
  "Cybersecurity & Trust",
  "Developer & DevOps Platforms",
  "AI-Enabled Fintech",
  "All Sectors — Full Access",
  "Investor Networks Syndicate",
];
// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const mobile = useIsMobile();
  return (
    <footer style={{ background: "#0f3247", borderTop: "1px solid var(--border)", padding: mobile ? "44px 20px 28px" : "72px 72px 40px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
        gap: mobile ? "32px 24px" : 52,
        marginBottom: 40, paddingBottom: 40,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        maxWidth: 1320, marginLeft: "auto", marginRight: "auto",
      }}>
        <div style={{ gridColumn: mobile ? "1 / -1" : "auto" }}>
          <div style={{ fontFamily: "'Clear Sans', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.22em", color: "#fff", marginBottom: 14 }}>
            MUSE<span style={{ color: "var(--teal-bright)" }}>DATA</span>
          </div>
          <p style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.8, color: "rgba(255,255,255,0.4)", marginBottom: 18, maxWidth: 280, fontWeight: 300 }}>
            Institutional-grade deal access in enterprise software and AI. Backed by QoE diligence and 8+ full-time venture professionals.
          </p>
          <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", lineHeight: 2, color: "rgba(255,255,255,0.22)" }}>
            611 South DuPont Highway, Suite 102<br />Dover, NY 19901<br />
            <a href="mailto:partners@musedata.ai" style={{ color: "rgba(255,255,255,0.22)", textDecoration: "none" }}>partners@musedata.ai</a>
          </div>
        </div>
        {[
          { title: "Investors",  links: ["Funds","Syndicates","Deal Flow"] },
          { title: "Company",   links: ["About MUSEDATA","Investment Team","Careers"] },
          { title: "Resources", links: ["Sample Evidence Pack","Performance Data","Legal & Privacy","Investor Policies"] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--teal-bright)", marginBottom: 16, fontWeight: 500 }}>{col.title}</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
              {col.links.map((l) => (
                <li key={l}><a href="#" style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 300 }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Clear Sans', sans-serif", fontSize: "0.625rem", color: "rgba(255,255,255,0.18)", lineHeight: 1.85, letterSpacing: "0.03em" }}>
          Neither MUSEDATA nor any of its funds are sponsored by, affiliated with, or endorsed by any school or institution. Venture capital investing involves substantial risk, including risk of loss of all capital invested. Past performance does not guarantee future results. No content on this website is an offer to sell, or solicitation of an offer to purchase, any security.
        </div>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function MusedataLanding() {
  return (
    <>
      <style>{globalStyles}</style>
      <UnifiedNavbar />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Syndicates />
      <Deals />
      <Voices />
      <Compare />
      <Signup />
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