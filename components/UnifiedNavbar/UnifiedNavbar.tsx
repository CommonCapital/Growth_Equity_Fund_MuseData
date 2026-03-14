'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UnifiedNavbarProps {
  currentPage?: string;
  transparent?: boolean;
}
export const LOGO_B64 = "data:image/png;base64,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";
export default function UnifiedNavbar({ currentPage, transparent = false }: UnifiedNavbarProps) {
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (page: string) => currentPage === page;

  const handleApplyForCapital = () => {
    console.log("Navigating to /funding");
    router.push("/funding");
  };

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
          display: flex; align-items: center; align-self: center; flex-shrink: 0;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; line-height: 1;
          color: var(--connect-text); background: transparent;
          padding: 12px 26px; text-decoration: none; white-space: nowrap;
          border: 1.5px solid var(--connect-border);
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .nav-connect:hover { background: var(--hero-bg); color: #fff; border-color: var(--hero-bg); }
        
        .nav-apply {
          margin-left: 12px;
          background: var(--btn-bg);
          color: var(--btn-text) !important;
          border-color: var(--btn-bg);
        }
        .nav-apply:hover {
          background: var(--hero-bg);
          border-color: var(--hero-bg);
        }

        .ham { display: none; flex-direction: column; justify-content: center; gap: 6px; cursor: pointer; margin-left: auto; align-self: center; flex-shrink: 0; }
        .ham span { width: 22px; height: 1.5px; background: var(--nav-active); display: block; }
        @media(max-width:980px){ .nav-links a { padding: 0 11px; font-size: 0.667rem; } }
        @media(max-width:780px){ 
          .nav-links { display: none; } 
          .ham { display: flex; } 
          .nav-connect { display: none; } 
        }

        .mob-nav {
          display: none; position: fixed; top: 82px; left: 0; right: 0; z-index: 199;
          background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
          padding: 24px 20px 32px; flex-direction: column;
        }
        .mob-nav.open { display: flex; }
        .mob-nav a { 
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; 
          color: #8fa8b2; text-decoration: none; padding: 14px 0; border-bottom: 1px solid var(--nav-border); 
          transition: color 0.2s; 
        }
        .mob-nav a:hover { color: var(--nav-active); }
        .mob-nav .mob-cta { 
          margin-top: 20px; 
          background: var(--btn-bg); 
          color: #fff !important; 
          text-align: center; 
          padding: 14px !important; 
          font-weight: 600; 
          letter-spacing: 0.16em; 
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        .mob-nav .mob-cta:hover {
          background: var(--hero-bg);
        }
      `}</style>

      {/* ── NAV ─ */}
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div className="nav-mark">
              
              <img src={LOGO_B64} alt="MUSEDATA logo" />
            </div>
            <span className="nav-word">MUSEDATA</span>
          </a>
          
          <ul className="nav-links">
            {[
              ["/companies","Companies"],
              ["/funds","Funds"],
              ["/syndicates","Syndicates"],
              ["/strategic-resource-group","SRG"],
              ["/people","People"],
              ["/about","About"],
              ["/jobs","Jobs"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={isActive(href) ? "active" : ""}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

         
          
          {/* Desktop Apply for Capital Button */}
          <button className="nav-connect nav-apply" onClick={handleApplyForCapital}>
            Apply for Capital
          </button>
          
          <div className="ham" onClick={() => setMobOpen(o => !o)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-nav${mobOpen ? " open" : ""}`}>
        {[
          ["/companies","Companies"],
          ["/funds","Funds"],
          ["/syndicates","Syndicates"],
          ["/strategic-resource-group","SRG"],
          ["/people","People"],
          ["/about","About"],
          ["/jobs","Jobs"],
        ].map(([href, label]) => (
          <Link key={href} href={href} onClick={() => setMobOpen(false)}>
            {label}
          </Link>
        ))}
        
        {/* Mobile Apply for Capital Button */}
        <button className="mob-cta " onClick={() => {
          setMobOpen(false);
          handleApplyForCapital();
        }}>
          Apply for Capital
        </button>
      </div>
    </>
  );
}