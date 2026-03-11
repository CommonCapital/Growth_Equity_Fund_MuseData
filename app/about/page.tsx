"use client";
import { useState, useEffect, useRef } from "react";
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
    <div ref={ref} className={`fade ${className}`} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

const TEAM = [
  {
    name: "Alexandra Chen",
    role: "Managing Partner",
    bio: "Former Partner at Insight Partners. Led investments in Snowflake, Datadog, and Confluent. MBA from Stanford GSB.",
    image: "/team/alex.jpg",
  },
  {
    name: "Marcus Thorne",
    role: "Partner, Strategic Resource Group",
    bio: "Ex-CFO at Plaid and early operator at Stripe. Builds financial infrastructure for portfolio companies.",
    image: "/team/marcus.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Principal, Investments",
    bio: "Previously at a16z and Goldman Sachs. Focuses on enterprise AI and data infrastructure.",
    image: "/team/priya.jpg",
  },
  {
    name: "James Okafor",
    role: "Principal, Capital Formation",
    bio: "Built LP relationships at Tiger Global. Leads co-investment processes and fund reporting.",
    image: "/team/james.jpg",
  },
];

const VALUES = [
  {
    icon: "🔍",
    title: "Evidence First",
    desc: "We invest based on proprietary diligence, not relationships or momentum. Every decision is backed by data.",
  },
  {
    icon: "🤝",
    title: "Partnership Over Control",
    desc: "We take minority positions intentionally. Founders retain control; we provide infrastructure, not interference.",
  },
  {
    icon: "🌍",
    title: "Global by Design",
    desc: "The best enterprise software companies aren't confined to one geography. Neither are we.",
  },
  {
    icon: "⚡",
    title: "Speed with Rigor",
    desc: "We move fast—but never at the expense of thoroughness. Our process is structured, not rushed.",
  },
];

const LOGO_B64 = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABAAEADASIAAhEBAxEB/8QAGgABAQEBAQEBAAAAAAAAAAAACAcGCQUAAv/EAD4QAAAEBAIFBwoEBwAAAAAAAAECAwQABQYRBwgSITFW0hQXQWGRlLIWGCIyNTZVc3bRQlGV0wkjN3F0gZL/xAAYAQADAQEAAAAAAAAAAAAAAAACAwQABf/EACQRAAICAgIBAwUAAAAAAAAAAAECAAMEERJBEwUhYRQxccHw/9oADAMBAAIRAxEAPwCx5pa7qeh5fIVaamBWZ3aqxVhMgmppAUCCHrgNto7IhHP/AIqbxJdwb8EVHPD7Jpb57nwpwXY6uLUjVAkTh5t1i3EKxERWDGL1f1HP5q1m85TcIt5K7dJFBoiSypCgJRuUoXt+WyI75y2Mm9CP6a2/bjTZc/eqe/Tj7wBB5gbK0DkajabXNYJJ7lg85bGTehH9NbftxYsZ8Xq/pyfyprKJym3RcSVo6VKLRE91TlETDcxRtf8ALZA9hDZjPeqRfTjHwDGrrQuBqa61xUSCep++f/FTeJLuDfgi75Wq7qeuJfPlalmBXh2iqJURKgmnogYDiPqAF9gbYG8KLI97Jqn57bwqQWVUi1EgRWFdY1wDMTNNmlQodeXyEK1fTpqmCq3JhlqZDiYbE0tLS/1a3XEI5BgP8drjuyH2io54fZNLfPc+FOC7GxU3UDszZtnG4jiDEXgqywmLUM0CnZtVKzk0mdFWB2ikUoIiUNMQ0Q9YA2dES/ySy/bx173dvwx62Wv3ynP0898IRLoPwhnOyeoH1BWtdAd/qbvySy/bx173dvwxRMdlcHW1TytGp5tViLsslaAiDJukYgoaI6AiJvxCF79EQCNZm4/qHJvpth4TQuyvgw0TG02+VWDAdT0+WZevjted0Q+0IDKYtQKsuqAaEfTx0kCyHKhmaRCCUbH0dHR2htvfqgEQwP4evsWsP8lr4VITcW4HZlOOqCwaUTb5tKRqSrJdT6dOyleYnbLLmWBIQ9ADAS17iG2wwfeZzE3c9/2k4ot+dKYP5fK6ZFg+ctBOu4A4oqmJpWKna9h1wZ/KOofj0072p94fi8/ENakmaa/MeQO/74lqwIw2rmRVRNHU3px20RVkrtumc4lsZQxQ0S6h2jE+5nMTdz3/AGk4o0eXSdTh1V03I6mz9chZA8OUqjg5gAwFCwhcdvXEz8o6h+PTTvan3hiizmfcdRLGrxr7Hvv8fE1PM5ibue/7ScUaPMnhViFUlbSt7I6Wevm6UiZt1FExJYqhCjpF1jtC8TPyjqH49NO9qfeGdiTiZL8LcFGVWzNE71YWrdBo2A+iZy4OncCiYb2CwGMI69RR2jqhGUzpomVYKVvyA31BbzE4ubjTL/pPihNZKqIqui5VUyVUyRxKzul25kAWEvpgUqlxCwjsuHbEPkedOv0qhI4nMgkLqUmU/mNWyaiSpSX/AAKCc3pf3AQHqhx0pPJdU1NS2oZSqKrCYtiOW5hCw6BygIAIdAhewh0DeI3uLDRnRShUOxIJnh9k0t89z4U4LsdFKtpGm6sTbp1FKUJiRsJjIgqI+gJrXtYQ22CM9zOYZbnsO0/FFNGUtaBSJFk4L22FwRC7lr98pz9PPfCES6Ogkhw2oaROlXUopxo0WVQOgocgmuZM2oxdY7BjzuZzDLc9h2n4oMZiBidQG9OsKBdj23AZC2zJYazbEzLxKJfICgrNpaRs/bNxMBeUaKIkMmAjqARKcRC/SUA1Xje8zmGW57DtPxRuWyCTZsk2QICaSRAImUNhSgFgDshGTkLaBoSnDxWoJLH7zlBI8JsSpzUJJCzoifA+FTQOVdkokVLXtOc4AUgdYiAR07wmpUaIw1p+kzLg4UljIiKqpfVOpa5xC/RpCNuq0aiPokl0/9k=";

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

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
        #about-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
          transition: box-shadow 0.3s;
        }
        #about-header.scrolled { box-shadow: 0 2px 24px rgba(9,46,66,0.08); }
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
        #about-hero {
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
        /* Sections */
        .about-section { padding: 72px 0; border-top: 1px solid var(--divider); background: var(--section-white); }
        .about-section.alt { background: var(--section-bg); }
        .section-label {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
          font-size: 0.633rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--hero-label);
        }
        .section-label::before { content: ''; width: 28px; height: 1px; background: var(--hero-label); display: block; }
        .section-title {
          font-family: var(--ff); font-size: clamp(1.6rem,2.8vw,2.2rem); font-weight: 300;
          line-height: 1.15; letter-spacing: -0.01em; color: var(--h2-color); margin-bottom: 32px;
        }
        .section-body { font-size: 0.867rem; color: var(--body-color); line-height: 1.75; max-width: 720px; }
        /* Values Grid */
        .values-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; margin-top: 40px; }
        @media(max-width:768px){ .values-grid { grid-template-columns: 1fr; } }
        .value-card {
          background: var(--section-white); border-radius: 12px; padding: 28px;
          border-left: 3px solid var(--card-border);
        }
        .value-card .icon { font-size: 1.8rem; margin-bottom: 16px; }
        .value-card h3 {
          font-family: var(--ff); font-size: 1.067rem; font-weight: 500;
          color: var(--h2-color); margin-bottom: 10px;
        }
        .value-card p { font-size: 0.867rem; color: var(--body-color); line-height: 1.7; }
        /* Team */
        .team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; margin-top: 40px; }
        @media(max-width:1024px){ .team-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:640px){ .team-grid { grid-template-columns: 1fr; } }
        .team-card {
          background: var(--section-white); border-radius: 12px; padding: 24px;
          text-align: center; border: 1.5px solid var(--divider);
          transition: border-color 0.25s;
        }
        .team-card:hover { border-color: var(--hero-label); }
        .team-avatar {
          width: 100%; aspect-ratio: 1; border-radius: 10px; margin-bottom: 16px;
          background: var(--section-bg); display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem; color: var(--hero-label);
        }
        .team-name {
          font-family: var(--ff); font-size: 1rem; font-weight: 500; color: var(--h2-color);
          margin-bottom: 4px;
        }
        .team-role { font-size: 0.733rem; font-weight: 600; color: var(--hero-label); margin-bottom: 12px; }
        .team-bio { font-size: 0.8rem; color: var(--body-color); line-height: 1.6; }
        /* Timeline */
        .timeline { position: relative; padding-left: 40px; margin-top: 40px; }
        .timeline::before {
          content: ''; position: absolute; left: 12px; top: 8px; bottom: 8px;
          width: 2px; background: var(--divider);
        }
        .timeline-item { position: relative; padding: 24px 0; }
        .timeline-item::before {
          content: ''; position: absolute; left: -32px; top: 32px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--btn-bg); border: 3px solid var(--section-white);
        }
        .timeline-year {
          font-size: 0.733rem; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--hero-label); margin-bottom: 8px;
        }
        .timeline-title {
          font-family: var(--ff); font-size: 1.067rem; font-weight: 500;
          color: var(--h2-color); margin-bottom: 8px;
        }
        .timeline-desc { font-size: 0.867rem; color: var(--body-color); line-height: 1.7; }
        /* CTA */
        .about-cta {
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
        #about-footer {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: var(--footer-bg); border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-slim {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 0; gap: 24px; flex-wrap: nowrap;
        }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .footer-mark { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-mark img { width: 28px; height: 28px; object-fit: contain; display: block; }
        .footer-word { font-size: 0.733rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.7); line-height: 1; white-space: nowrap; }
        .footer-right { display: flex; align-items: center; gap: 32px; flex-shrink: 0; }
        .footer-links-row { display: flex; align-items: center; gap: 24px; }
        .footer-links-row a {
          font-size: 0.633rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; white-space: nowrap; line-height: 1;
        }
        .footer-links-row a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 0.633rem; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; line-height: 1; white-space: nowrap; flex-shrink: 0; }
        @media(max-width:768px){
          .hero-inner { padding: 56px 24px 72px; }
          .hero-h1 { font-size: clamp(1.7rem,5vw,2.4rem); }
          .hero-body { font-size: 0.867rem; margin-top: 1.5rem; }
          .about-section { padding: 48px 0; }
          .footer-slim { flex-wrap: wrap; gap: 14px; }
          .footer-right { flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer-links-row { flex-wrap: wrap; gap: 14px; }
        }
        @media(max-width:480px){
          .hero-inner { padding: 44px 18px 56px; }
          .about-section { padding: 36px 0; }
          .section-title { font-size: 1.4rem; }
          .footer-slim { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px 0; }
        }
      `}</style>

      {/* Header */}
      <header id="about-header" className={scrolled ? "scrolled" : ""}>
        <div className="header-inner">
          <a href="/" className="header-logo">
            <div className="header-mark">
              <img src={LOGO_B64} alt="MUSEDATA" />
            </div>
            <span className="header-word">MUSEDATA</span>
          </a>
          <span className="header-tag">About</span>
        </div>
      </header>

      {/* Hero */}
      <section id="about-hero">
        <div className="hero-bg-img" />
        <div className="w">
          <div className="hero-inner">
            <Fade delay={0}>
              <div className="hero-label-row">
                <div className="hero-label-line" />
                <span className="hero-label-text">Our Story</span>
              </div>
            </Fade>
            <Fade delay={0.12}>
              <h1 className="hero-h1">
                Evidence before <span className="accent">conviction.</span>
              </h1>
            </Fade>
            <Fade delay={0.24}>
              <p className="hero-body">
                MUSEDATA is a growth equity firm deploying minority capital into enterprise software and AI companies. We were founded on a simple principle: the finest capital is not merely patient—it is precise.
              </p>
            </Fade>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="w">
          <Fade delay={0}>
            <div className="section-label">Our Mission</div>
          </Fade>
          <Fade delay={0.08}>
            <h2 className="section-title">Building institutions, not just companies.</h2>
          </Fade>
          <Fade delay={0.16}>
            <p className="section-body">
              We believe the best enterprise software companies are built to last. That requires more than capital—it requires infrastructure, discipline, and partnerships that scale with ambition. MUSEDATA exists to provide exactly that: minority growth equity, embedded operational expertise, and institutional credibility from day one.
            </p>
          </Fade>
        </div>
      </section>

      {/* Values */}
      <section className="about-section alt">
        <div className="w">
          <Fade delay={0}>
            <div className="section-label">Our Values</div>
          </Fade>
          <Fade delay={0.08}>
            <h2 className="section-title">The principles that guide every decision.</h2>
          </Fade>
          
          <div className="values-grid">
            {VALUES.map((value, i) => (
              <Fade key={value.title} delay={0.16 + i * 0.08}>
                <div className="value-card">
                  <div className="icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-section">
        <div className="w">
          <Fade delay={0}>
            <div className="section-label">Our Team</div>
          </Fade>
          <Fade delay={0.08}>
            <h2 className="section-title">Operators. Investors. Builders.</h2>
          </Fade>
          
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <Fade key={member.name} delay={0.16 + i * 0.08}>
                <div className="team-card">
                  <div className="team-avatar">👤</div>
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="about-section alt">
        <div className="w">
          <Fade delay={0}>
            <div className="section-label">Our Journey</div>
          </Fade>
          <Fade delay={0.08}>
            <h2 className="section-title">From thesis to track record.</h2>
          </Fade>
          
          <div className="timeline">
            <Fade delay={0.16}>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-title">Founded</div>
                <p className="timeline-desc">MUSEDATA launched with a thesis: enterprise software companies need more than capital—they need institutional infrastructure from day one.</p>
              </div>
            </Fade>
            <Fade delay={0.24}>
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-title">First Investments</div>
                <p className="timeline-desc">Deployed initial capital into three enterprise AI companies, each selected through proprietary diligence frameworks.</p>
              </div>
            </Fade>
            <Fade delay={0.32}>
              <div className="timeline-item">
                <div className="timeline-year">2023</div>
                <div className="timeline-title">SRG Launched</div>
                <p className="timeline-desc">Embedded the Strategic Resource Group directly into portfolio operations, building financial and GTM infrastructure at scale.</p>
              </div>
            </Fade>
            <Fade delay={0.4}>
              <div className="timeline-item">
                <div className="timeline-year">2024–Present</div>
                <div className="timeline-title">Global Expansion</div>
                <p className="timeline-desc">Expanded investment activity across North America and Europe. Built LP network for co-investment and sponsor processes.</p>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="w">
          <Fade delay={0}>
            <h2 className="cta-h2">Ready to build something <span style={{ color: 'var(--cta-accent)' }}>extraordinary?</span></h2>
          </Fade>
          <Fade delay={0.08}>
            <p className="cta-sub">
              Whether you're a founder seeking capital or an operator looking to join our team, we'd love to hear from you.
            </p>
          </Fade>
          <Fade delay={0.16}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/funding" className="cta-btn">Apply for Capital →</Link>
              <Link href="/jobs" className="cta-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}>View Careers →</Link>
            </div>
          </Fade>
        </div>
      </section>

      {/* Footer */}
      <footer id="about-footer">
        <div className="w">
          <div className="footer-slim">
            <a href="/" className="footer-logo">
              <div className="footer-mark">
                <img src={LOGO_B64} alt="MUSEDATA" />
              </div>
              <span className="footer-word">MUSEDATA</span>
            </a>
            <div className="footer-right">
              <div className="footer-links-row">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Use</a>
                <a href="/disclosures">Disclosures</a>
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