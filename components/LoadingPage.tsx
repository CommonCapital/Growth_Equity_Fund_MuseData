export default function Loading() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .loader-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0A2F42;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2.4rem;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── Logo mark ── */
        .loader-mark {
          display: grid;
          grid-template-columns: repeat(3, 10px);
          grid-template-rows: repeat(3, 10px);
          gap: 4px;
          opacity: 0;
          animation: fade-in 0.5s 0.1s ease forwards;
        }
        .loader-mark span {
          display: block;
          border-radius: 2px;
          background: #1B5E7B;
        }
        .loader-mark span:nth-child(2),
        .loader-mark span:nth-child(6) { background: #0A2F42; border: 1px solid rgba(59,163,203,.3); }
        .loader-mark span:nth-child(9) { background: #000; border-radius: 50%; }

        /* ── Wordmark ── */
        .loader-word {
          font-size: 0.733rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          opacity: 0;
          animation: fade-in 0.5s 0.25s ease forwards;
        }

        /* ── Progress bar ── */
        .loader-bar-wrap {
          width: 120px;
          height: 1px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
          opacity: 0;
          animation: fade-in 0.4s 0.4s ease forwards;
        }
        .loader-bar {
          height: 100%;
          width: 0%;
          background: #3BA3CB;
          animation: progress 1.4s 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes progress {
          0%   { width: 0%; }
          60%  { width: 75%; }
          100% { width: 100%; }
        }
      `}</style>

      <div className="loader-root">
        <div>
          <div className="loader-mark">
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
          </div>
        </div>
        <div className="loader-word">MUSEDATA</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" />
        </div>
      </div>
    </>
  );
}