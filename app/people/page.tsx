'use client'
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";

/* ─── Types ─── */
interface Person {
  init: string;
  name: string;
  title: string;
  logos: string[];
  logoTags: string[];
  bio: string;
}

/* ─── People data ─── */
const people: Record<string, Person> = {
  lead1: {
    init: 'CA', name: 'Collin Assam', title: 'Co-Founder & Managing Partner',
    logos: ['arrowrootcapital.com', 'rothcapital.com', 'db.com'],
    logoTags: ['Notre Dame'],
    bio: "Collin founded MUSEDATA Growth Equity to bring institutional-grade infrastructure to emerging private companies. His career spans Arrowroot Capital Management, ROTH Capital Partners, and Deutsche Bank, where he developed deep expertise in private equity, investment banking, and strategic capital deployment. At MUSEDATA, he leads overall investment strategy, portfolio company engagement, and firm development."
  },
  lead2: {
    init: 'NK', name: 'Nico Knutzen', title: 'COO & Partner',
    logos: ['mckinsey.com', 'alvarezandmarsal.com'],
    logoTags: ['Georgia Tech'],
    bio: 'Nico brings a track record of large-scale operational transformation across McKinsey & Company and Alvarez & Marsal, where he advised Fortune 500 and private equity-backed companies on business technology, digital operations, and performance improvement. At MUSEDATA, he oversees day-to-day operations and leads portfolio infrastructure delivery — ensuring every company in the portfolio is built to scale and earn institutional trust.'
  },
  lead4: {
    init: 'BK', name: 'Brien Kurtz', title: 'Advisor, AI & Data Strategy',
    logos: ['bridgewater.com', 'prattwhitney.com'],
    logoTags: ['Notre Dame'],
    bio: 'Brien brings 15+ years of experience building enterprise-grade data systems at Bridgewater Associates, Pratt & Whitney, and Cooper. His work spans scalable data pipelines, people analytics, and AI-driven infrastructure — making him a critical voice on how MUSEDATA portfolio companies architect their data layer for long-term institutional value.'
  },
  lead6: {
    init: 'SS', name: 'Stavan Shah', title: 'Strategic Growth Advisor',
    logos: ['mckinsey.com'],
    logoTags: ['Kellogg', 'Georgia Tech'],
    bio: "Stavan's background spans VC-level investing, early-stage technology, and strategic consulting at McKinsey & Company. He is currently completing his MBA at Northwestern's Kellogg School of Management. He advises MUSEDATA portfolio companies on growth strategy, go-to-market execution, and venture positioning — bridging the gap between operator instincts and investor expectations."
  },
  lead10: {
    init: 'AL', name: 'Alex Lee', title: 'Legal Strategy Advisor',
    logos: [],
    logoTags: ['WashU Law', 'Notre Dame'],
    bio: 'Alex provides legal strategy counsel to MUSEDATA and its portfolio companies, with a foundation from Washington University School of Law. He advises on deal structuring, regulatory considerations, and the legal frameworks that underpin institutional investment relationships.'
  },
  lead7: {
    init: 'NA', name: 'Noor Ul Ain', title: 'Investment Analyst',
    logos: [],
    logoTags: ['Oxford Brookes'],
    bio: "Noor supports MUSEDATA's investment team across deal evaluation, market research, and portfolio analysis. An Oxford Brookes University alumna, she brings structured analytical thinking and a sharp eye for financial detail to every engagement — helping the team move quickly and rigorously on new opportunities."
  },
  lead8: {
    init: 'NO', name: 'Nursan Omarov', title: 'Lead Developer',
    logos: [],
    logoTags: ['HRAI'],
    bio: "Nursan leads technology development for MUSEDATA's internal platforms and portfolio company tools. He brings deep expertise in AI systems, enterprise software architecture, and machine learning infrastructure — advising portfolio companies on how to build technology that compounds in value and supports institutional due diligence."
  },
  lead9: {
    init: 'AB', name: 'Arjun Bhattarai', title: 'Private Equity Intern',
    logos: [],
    logoTags: ['Harvard'],
    bio: 'Arjun supports the MUSEDATA investment team across deal sourcing, financial modeling, and portfolio research. A Harvard University student, he brings strong analytical foundations and a commitment to the rigorous work that underlies every investment thesis MUSEDATA pursues.'
  }
};

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

/* ─── Person card ─── */
function PersonCard({ id, person, index, onOpen }: { id: string; person: Person; index: number; onOpen: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .6s ${index * 0.07}s ease, transform .6s ${index * 0.07}s cubic-bezier(.22,1,.36,1)`;
    
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        io.disconnect();
      }
    }, { threshold: 0.05 });
    
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="lc" onClick={() => onOpen(id)}>
      <div className="lc-inner">
        <div className="lc-glow"></div>
        <div className="lc-num">{String(index + 1).padStart(2, '0')}</div>
        <div className="lc-avatar"><span className="lc-init">{person.init}</span></div>
        <div className="lc-body">
          <div className="lc-name">{person.name}</div>
          <div className="lc-title">{person.title}</div>
          <div className="lc-logos">
            {person.logos.map(domain => (
              <img
                key={domain}
                src={`https://logo.clearbit.com/${domain}`}
                alt={domain}
               
              />
            ))}
            {person.logoTags.map(tag => (
              <span key={tag} className="logo-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="lc-arrow">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal ─── */
function Modal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const person = id ? people[id] : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = id ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [id]);

  return (
    <div className={`modal-overlay${id ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>&#x2715;</button>
        {person && (
          <>
            <div className="modal-init">{person.init}</div>
            <div className="modal-name">{person.name}</div>
            <div className="modal-title">{person.title}</div>
            <div id="modal-logos" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap", marginTop: "1.2rem", alignItems: "center" }}>
              {person.logos.map(domain => (
                <img
                  key={domain}
                  src={`https://logo.clearbit.com/${domain}`}
                  alt={domain}
                  style={{ height: 28, width: "auto", objectFit: "contain", filter: "grayscale(1) opacity(.4)" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).remove(); }}
                />
              ))}
              {person.logoTags.map(tag => (
                <span key={tag} className="logo-tag">{tag}</span>
              ))}
            </div>
            <div className="modal-bio">{person.bio}</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function PeoplePage() {
  const [modalId, setModalId] = useState<string | null>(null);

  // Modal functions
  const openModal = (id: string) => {
    setModalId(id);
  };

  const closeModalBtn = () => {
    setModalId(null);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        :root{
          --deep:#0A2F42;--mid:#1B5E7B;--slate:#4A6B7C;
          --bright:#3BA3CB;--main:#2A7FA0;
          --white:#fff;--ghost:#F2F8FB;--wash:#E3F1F8;
          --border:rgba(42,127,160,.13);--nav-h:68px;
          --serif:'Inter',sans-serif;
          --sans:'Inter',sans-serif;
        }
        html{scroll-behavior:smooth;font-size:16px;}
        body{font-family:var(--sans);background:var(--white);color:var(--deep);overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        h1,h2,h3,h4,h5,h6{font-family:'Inter',sans-serif;}

        .logo{display:flex;align-items:center;gap:.75rem;text-decoration:none;}
        .logo-box{width:32px;height:32px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .logo-box img{height:19px;width:auto;}
        .logo-name{font-size:.75rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--deep);line-height:1;}
        .nav-links{display:flex;list-style:none;align-items:center;}
        .nav-links a{display:flex;align-items:center;padding:0 .85rem;height:var(--nav-h);font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--slate);text-decoration:none;border-bottom:2px solid transparent;transition:color .2s,border-color .2s;white-space:nowrap;}
        .nav-links a:hover,.nav-links a.on{color:var(--deep);border-bottom-color:var(--bright);}
        .nav-cta{display:inline-flex;align-items:center;height:36px;padding:0 1.4rem;border:1.5px solid var(--deep);color:var(--deep);font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;transition:background .2s,color .2s;white-space:nowrap;}
        .nav-cta:hover{background:var(--deep);color:var(--white);}

        /* PAGE HEADER */
        .page-header{background:var(--deep);padding:calc(var(--nav-h) + 5rem) 3rem 5rem;position:relative;overflow:hidden;}
        .page-header::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 85% 20%,rgba(59,163,203,.1),transparent 55%),radial-gradient(ellipse 50% 70% at 10% 80%,rgba(42,127,160,.07),transparent 55%);pointer-events:none;}
        .page-header::after{content:'';position:absolute;}
        .page-header-inner{max-width:1440px;margin:0 auto;position:relative;z-index:1;}
        .ph-tag{font-family:'Inter',sans-serif;font-size:.7rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--bright);display:inline-flex;align-items:center;gap:.8rem;margin-bottom:1.6rem;opacity:0;animation:rise .6s .1s ease forwards;}
        .ph-tag::before{content:'';width:28px;height:1px;background:var(--bright);}
        .ph-h{font-family:'Inter',sans-serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:300;color:var(--white);line-height:1.12;letter-spacing:-.03em;opacity:0;animation:rise .8s .2s ease forwards;max-width:820px;}
        .ph-h em{font-style:normal;font-weight:700;color:var(--bright);}
        .ph-sub{margin-top:1.8rem;font-family:'Inter',sans-serif;font-size:.9375rem;font-weight:400;line-height:1.75;color:rgba(255,255,255,.45);max-width:480px;opacity:0;animation:rise .8s .35s ease forwards;}

        /* SECTION */
        .team-section{max-width:1440px;margin:0 auto;padding:5rem 3rem;}
        .section-label{font-size:.7rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--main);margin-bottom:3rem;display:flex;align-items:center;gap:.9rem;}
        .section-label::before{content:'';width:24px;height:1px;background:var(--main);}
        .section-label::after{content:'';flex:1;height:1px;background:var(--border);}

        /* LEADERSHIP CARDS */
        .team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5px;background:linear-gradient(135deg,rgba(42,127,160,.12),rgba(59,163,203,.08));}
        .lc{background:var(--white);cursor:pointer;position:relative;overflow:hidden;}
        .lc-inner{padding:2.2rem 2.4rem 2rem;display:flex;flex-direction:column;gap:0;min-height:200px;position:relative;transition:background .35s;}
        .lc:hover .lc-inner{background:#F0F8FC;}
        .lc-glow{position:absolute;top:-60px;right:-60px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(59,163,203,.18),transparent 70%);opacity:0;transition:opacity .5s,transform .5s;transform:scale(.6);pointer-events:none;}
        .lc:hover .lc-glow{opacity:1;transform:scale(1);}
        .lc-num{position:absolute;top:1.6rem;right:2rem;font-size:2.4rem;font-weight:300;color:rgba(42,127,160,.08);line-height:1;letter-spacing:-.04em;transition:color .3s;}
        .lc:hover .lc-num{color:rgba(59,163,203,.18);}
        .lc-top{display:flex;align-items:center;gap:1.2rem;margin-bottom:1.1rem;}
        .lc-avatar{width:52px;height:52px;flex-shrink:0;border-radius:50%;background:linear-gradient(135deg,var(--wash),rgba(59,163,203,.15));border:1.5px solid rgba(42,127,160,.18);display:flex;align-items:center;justify-content:center;transition:border-color .3s,transform .35s;}
        .lc:hover .lc-avatar{border-color:var(--bright);transform:scale(1.07);}
        .lc-init{font-size:.875rem;font-weight:600;color:var(--main);letter-spacing:.04em;}
        .lc-body{flex:1;}
        .lc-name{font-size:1.0625rem;font-weight:500;color:var(--deep);line-height:1.3;letter-spacing:-.015em;margin-bottom:.3rem;}
        .lc-title{font-size:.6875rem;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--main);line-height:1.5;margin-bottom:1rem;}
        .lc-logos{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;min-height:26px;}
        .lc-logos img{height:20px;width:auto;object-fit:contain;filter:grayscale(1) opacity(.4);transition:filter .35s;}
        .lc:hover .lc-logos img{filter:grayscale(0) opacity(1);}
        .lc-logos .inline-logo{height:20px;width:auto;object-fit:contain;filter:grayscale(1) opacity(.4);transition:filter .35s;}
        .lc:hover .lc-logos .inline-logo{filter:grayscale(0) opacity(1);}
        .lc-logos .logo-tag{font-size:.6875rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--slate);background:var(--wash);border:1px solid var(--border);padding:.18rem .5rem;border-radius:2px;line-height:1.5;}
        .lc-arrow{position:absolute;bottom:1.6rem;right:2rem;width:32px;height:32px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--slate);opacity:0;transform:translateX(-6px);transition:opacity .3s,transform .35s,background .2s,color .2s;}
        .lc:hover .lc-arrow{opacity:1;transform:translateX(0);}
        .lc-arrow:hover{background:var(--deep);color:var(--white);}
        .lc::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,var(--main),var(--bright));transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.22,1,.36,1);z-index:1;}
        .lc:hover::before{transform:scaleX(1);}
        .lc::after{content:'';position:absolute;top:0;bottom:0;left:0;width:2.5px;background:linear-gradient(180deg,var(--bright),var(--main));transform:scaleY(0);transform-origin:top;transition:transform .55s cubic-bezier(.22,1,.36,1) .05s;z-index:1;}
        .lc:hover::after{transform:scaleY(1);}

        /* BAND */
        .band{background:var(--deep);padding:5.5rem 3rem;text-align:center;position:relative;overflow:hidden;}
        .band::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(59,163,203,.06),transparent 60%);pointer-events:none;}
        .band-inner{max-width:860px;margin:0 auto;position:relative;}
        .band-rule{width:32px;height:1px;background:var(--bright);margin:0 auto 2rem;}
        .band-q{font-size:clamp(1.0625rem,1.8vw,1.375rem);font-weight:400;color:var(--white);line-height:1.7;letter-spacing:-.01em;}
        .band-q em{font-style:italic;color:var(--bright);}

        /* CTA */
        .cta{background:var(--white);padding:8rem 3rem;text-align:center;border-top:1px solid var(--border);position:relative;overflow:hidden;}
        .cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 70% at 50% 50%,rgba(42,127,160,.04),transparent 60%);pointer-events:none;}
        .cta-h{font-size:clamp(1.75rem,3vw,3rem);font-weight:300;color:var(--deep);margin-bottom:2.4rem;letter-spacing:-.03em;line-height:1.15;}
        .cta-btn{display:inline-flex;align-items:center;gap:.9rem;height:50px;padding:0 2.6rem;background:var(--deep);color:var(--white);font-size:.75rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;text-decoration:none;transition:background .22s,transform .18s;}
        .cta-btn:hover{background:var(--main);transform:translateY(-2px);}

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

        @keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}

        /* MODAL */
        .modal-overlay{position:fixed;inset:0;background:rgba(8,38,54,.75);backdrop-filter:blur(12px);z-index:800;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s;}
        .modal-overlay.open{opacity:1;pointer-events:all;}
        .modal{background:var(--white);max-width:660px;width:90%;max-height:82vh;overflow-y:auto;padding:3.2rem;position:relative;transform:translateY(24px) scale(.98);transition:transform .35s cubic-bezier(.22,1,.36,1);}
        .modal-overlay.open .modal{transform:translateY(0) scale(1);}
        .modal-close{position:absolute;top:1.6rem;right:1.6rem;width:34px;height:34px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.875rem;color:var(--slate);transition:background .2s,color .2s;}
        .modal-close:hover{background:var(--deep);color:var(--white);}
        .modal-init{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--wash),rgba(59,163,203,.18));border:2px solid rgba(42,127,160,.18);display:flex;align-items:center;justify-content:center;font-size:1.125rem;font-weight:600;color:var(--main);margin-bottom:1.6rem;}
        .modal-name{font-size:1.375rem;font-weight:400;color:var(--deep);line-height:1.2;letter-spacing:-.02em;}
        .modal-title{font-size:.75rem;font-weight:400;letter-spacing:.1em;text-transform:uppercase;color:var(--main);margin-top:.5rem;}
        .modal-bio{font-size:.9375rem;font-weight:400;line-height:1.8;color:var(--slate);margin-top:1.8rem;padding-top:1.8rem;border-top:1px solid var(--border);}

        @media(max-width:1100px){.team-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:768px){.nav-links{display:none;}.ft{grid-template-columns:1fr;gap:1.4rem;text-align:center;}.ft-copy{text-align:center;}.ft-links{flex-wrap:wrap;justify-content:center;}}
        @media(max-width:520px){.lc-inner{padding:1.8rem 1.6rem;}.team-section{padding:3.5rem 1.5rem;}.team-grid{grid-template-columns:1fr;}}
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="ph-tag">People</div>
          <h1 className="ph-h">The team behind<br />the infrastructure.</h1>
          <p className="ph-sub">Capital markets veterans, seasoned operators, and technology builders united by one mandate: grow enterprise value and earn institutional trust.</p>
        </div>
      </div>

      {/* ── LEAD GRID ── */}
      <div style={{ background: "var(--white)" }}>
        <div className="team-section">
          <div className="section-label">Executive Leadership</div>
          <div className="team-grid">
            <PersonCard id="lead1" person={people.lead1} index={0} onOpen={openModal} />
            <PersonCard id="lead2" person={people.lead2} index={1} onOpen={openModal} />
            <PersonCard id="lead7" person={people.lead7} index={2} onOpen={openModal} />
            <PersonCard id="lead4" person={people.lead4} index={3} onOpen={openModal} />
            <PersonCard id="lead6" person={people.lead6} index={4} onOpen={openModal} />
            <PersonCard id="lead10" person={people.lead10} index={5} onOpen={openModal} />
            <PersonCard id="lead8" person={people.lead8} index={6} onOpen={openModal} />
            <PersonCard id="lead9" person={people.lead9} index={7} onOpen={openModal} />
            <div style={{ background: "var(--white)" }}></div>
            <div style={{ background: "var(--white)" }}></div>
          </div>
        </div>
      </div>

      {/* ── BAND ── */}
      <div className="band">
        <div className="band-inner">
          <div className="band-rule"></div>
          <p className="band-q">
            We don't just write checks. We embed <em>seasoned operators</em> inside every portfolio company to build the infrastructure that earns institutional trust.
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta">
        <h2 className="cta-h">We'd love to hear from you.</h2>
        <a href="mailto:partners@musedata.ai" className="cta-btn">Connect &rarr;</a>
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

      {/* ── MODAL ── */}
      <Modal id={modalId} onClose={closeModalBtn} />
    </>
  );
}