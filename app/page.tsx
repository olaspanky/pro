"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

const IMAGES = {
  hero:         "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85&fit=crop",
  panels1:      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=900&q=80&fit=crop",
  panels2:      "https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=900&q=80&fit=crop",
  installation: "https://images.unsplash.com/photo-1548348384-b1e021e3d9b2?w=900&q=80&fit=crop",
  home:         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop",
  farm:         "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400&q=80&fit=crop",
  team:         "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80&fit=crop",
  workers:      "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=900&q=80&fit=crop",
  roof:         "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900&q=80&fit=crop",
};

// ── useWindowWidth ────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

// ── useInView ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// ── Reveal ────────────────────────────────────────────────────────────────────
interface RevealProps { children: ReactNode; delay?: number; from?: "bottom"|"left"|"right"; style?: React.CSSProperties; }
function Reveal({ children, delay = 0, from = "bottom", style = {} }: RevealProps) {
  const [ref, inView] = useInView();
  const y = from === "bottom" ? 26 : 0;
  const x = from === "left" ? -26 : from === "right" ? 26 : 0;
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translate(0,0)" : `translate(${x}px,${y}px)`, transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ── GlobalStyle ───────────────────────────────────────────────────────────────
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #fff; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
      img { display: block; max-width: 100%; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: #fff; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(#FFB800,#FF5F00); border-radius: 4px; }
      ::selection { background: rgba(255,184,0,0.2); }

      @keyframes float      { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
      @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.7);opacity:0} }
      @keyframes ticker     { 0%{transform:translateX(0)}       100%{transform:translateX(-50%)} }
      @keyframes shimmer    { 0%,100%{opacity:.4}               50%{opacity:1} }

      /* Mobile drawer */
      .mob-drawer {
        position: fixed; inset: 0; z-index: 300;
        background: rgba(255,255,255,0.98); backdrop-filter: blur(24px);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 2.25rem; padding: 2rem;
        transform: translateX(100%); transition: transform .35s cubic-bezier(.22,1,.36,1);
        pointer-events: none;
      }
      .mob-drawer.open { transform: translateX(0); pointer-events: all; }
      .mob-drawer a {
        font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(1.75rem,7vw,2.5rem);
        color: #111; text-decoration: none; letter-spacing: -.02em; transition: color .2s;
      }
      .mob-drawer a:active { color: #FFB800; }

      /* Responsive grids */
      .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem,5vw,5rem); }
      .g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; }
      .g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.2rem; }
      .ga { display: grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 1.2rem; }

      @media (max-width: 960px) {
        .g4 { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 720px) {
        .g2 { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        .g3 { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 520px) {
        .g3 { grid-template-columns: 1fr !important; }
        .g4 { grid-template-columns: 1fr !important; }
        .ga { grid-template-columns: 1fr !important; }
        .hide-sm { display: none !important; }
        .footer-g { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
      }

      /* Hero floating card */
      @media (max-width: 820px) { .hero-float { display: none !important; } }
    `}</style>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useWindowWidth() < 820;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 66,
        padding: "0 clamp(1.25rem,5vw,3rem)",
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,184,0,0.16)" : "none",
        transition: "all .4s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(255,184,0,0.32)", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.08rem", color: "#111", letterSpacing: "-.01em" }}>PROSOLAR</span>
        </a>

        {/* Desktop */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "2.25rem", alignItems: "center" }}>
            {["Services","Projects","About","FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "rgba(15,15,15,0.52)", textDecoration: "none", fontSize: ".84rem", letterSpacing: ".05em", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FFB800")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(15,15,15,0.52)")}>{l}</a>
            ))}
            <CTABtn label="Free Quote" size="sm" />
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button onClick={() => setOpen(o => !o)} aria-label={open ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, zIndex: 301 }}>
            <span style={{ display: "block", width: 22, height: 2, background: "#111", transform: open ? "rotate(45deg) translate(5px,5px)" : "none", transition: "all .3s", transformOrigin: "center" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#111", opacity: open ? 0 : 1, transition: "opacity .3s" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#111", transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none", transition: "all .3s", transformOrigin: "center" }} />
          </button>
        )}
      </nav>

      {/* Mobile drawer */}
      <div className={`mob-drawer${open ? " open" : ""}`} role="dialog" aria-modal="true">
        {["Services","Projects","About","FAQ"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={close}>{l}</a>
        ))}
        <CTABtn label="Get Free Quote" size="md" />
      </div>
    </>
  );
}

// ── CTABtn ────────────────────────────────────────────────────────────────────
interface CTABtnProps { label?: string; size?: "sm"|"md"|"lg"; }
function CTABtn({ label = "Get My Free Solar Quote", size = "lg" }: CTABtnProps) {
  const [hov, setHov] = useState(false);
  const pad = size === "lg" ? "15px 34px" : size === "md" ? "13px 26px" : "9px 18px";
  const fs  = size === "lg" ? ".93rem"    : size === "md" ? ".87rem"    : ".78rem";
  return (
    <a href="#quote" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: hov ? "linear-gradient(135deg,#FFCA28,#FF5F00)" : "linear-gradient(135deg,#FFB800,#FF5F00)", color: "#000", padding: pad, borderRadius: 100, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: fs, textDecoration: "none", letterSpacing: ".02em", whiteSpace: "nowrap", transform: hov ? "scale(1.04) translateY(-2px)" : "scale(1)", boxShadow: hov ? "0 14px 40px rgba(255,184,0,0.38)" : "0 4px 18px rgba(255,184,0,0.18)", transition: "all .25s cubic-bezier(.22,1,.36,1)" }}>
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      {label}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 13, height: 13 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
  );
}

// ── Section / Label / Heading ─────────────────────────────────────────────────
function Section({ children, id, bg = "#fff", style = {} }: { children: ReactNode; id?: string; bg?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ background: bg, padding: "clamp(52px,10vw,108px) clamp(1.25rem,5vw,3rem)", ...style }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </section>
  );
}
function Label({ children, color = "#FFB800" }: { children: ReactNode; color?: string }) {
  return <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color, fontSize: ".7rem", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".8rem", fontWeight: 600 }}>{children}</p>;
}
function Heading({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) {
  return <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,4vw,3rem)", color: "#111", letterSpacing: "-.03em", lineHeight: 1.08, ...style }}>{children}</h2>;
}

// ── 1. HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { n += 8; if (n >= 500) { setCount(500); clearInterval(t); } else setCount(n); }, 18);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <img src={IMAGES.hero} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.28)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0.15) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,184,0,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,184,0,0.07) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "8%", left: "2%", width: 380, height: 380, background: "radial-gradient(circle,rgba(255,184,0,0.1),transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "clamp(88px,14vw,128px) clamp(1.25rem,5vw,3rem) clamp(56px,8vw,88px)", width: "100%" }}>
        <div style={{ maxWidth: "clamp(300px,80vw,640px)" }}>
          {/* Badge */}
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.28)", borderRadius: 100, padding: "6px 15px", marginBottom: "1.6rem", fontSize: ".72rem", color: "#FFB800", letterSpacing: ".1em", fontWeight: 600 }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 11, height: 11 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              NIGERIA'S PREMIUM SOLAR ENERGY COMPANY
            </div>
          </Reveal>

          {/* H1 */}
          <Reveal delay={0.05}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(2.6rem,8.5vw,6.5rem)", color: "#111", letterSpacing: "-.04em", lineHeight: .96, marginBottom: "1.1rem" }}>
              Stop Paying<br />
              <span style={{ background: "linear-gradient(120deg,#FFB800 20%,#FF5F00 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NEPA.</span>
              <br />Own Your Power.
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.1}>
            <p style={{ fontSize: "clamp(.9rem,2vw,1.15rem)", color: "rgba(15,15,15,0.58)", lineHeight: 1.75, maxWidth: 520, marginBottom: "2rem", fontWeight: 400 }}>
              ProSolar Energy designs, supplies & installs premium solar systems that eliminate electricity bills, survive Nigeria's harshest conditions, and run reliably for 25+ years — guaranteed.
            </p>
          </Reveal>

          {/* CTA row */}
          <Reveal delay={0.15}>
            <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap", marginBottom: "2.75rem" }}>
              <CTABtn label="Get My Free Solar Quote" size="lg" />
              <a href="#how" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "rgba(15,15,15,0.58)", fontSize: ".88rem", textDecoration: "none", padding: "15px 22px", border: "1px solid rgba(0,0,0,0.13)", borderRadius: 100, transition: "border-color .2s, color .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFB800"; e.currentTarget.style.color = "#111"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.13)"; e.currentTarget.style.color = "rgba(15,15,15,0.58)"; }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                See How It Works
              </a>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: "clamp(1.1rem,4vw,2.5rem)", flexWrap: "wrap", paddingTop: "1.75rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              {[{ val: `${count}+`, lbl: "Happy Clients" }, { val: "25yr", lbl: "Warranty" }, { val: "100%", lbl: "Bill Reduction" }, { val: "⭐ 4.9", lbl: "Avg Rating" }].map(s => (
                <div key={s.lbl}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.25rem,3vw,1.85rem)", color: "#FFB800" }}>{s.val}</div>
                  <div style={{ fontSize: ".7rem", color: "rgba(15,15,15,0.38)", letterSpacing: ".07em", marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Floating card — hidden on small screens via CSS */}
      <div className="hero-float" style={{ position: "absolute", right: "clamp(1rem,5vw,4rem)", bottom: "8%", width: "clamp(220px,28vw,350px)", zIndex: 2 }}>
        <Reveal from="right" delay={0.3}>
          <div style={{ borderRadius: 17, overflow: "hidden", border: "1px solid rgba(255,184,0,0.18)", boxShadow: "0 28px 64px rgba(0,0,0,0.14)", animation: "float 5s ease-in-out infinite" }}>
            <img src={IMAGES.panels1} alt="Solar panels" style={{ width: "100%", height: 210, objectFit: "cover" }} />
            <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(10px)", padding: "1rem 1.35rem", borderTop: "1px solid rgba(255,184,0,0.16)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E676", boxShadow: "0 0 7px #00E676", animation: "shimmer 2s ease-in-out infinite", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".85rem" }}>System Active</span>
              </div>
              <div style={{ marginTop: 5, fontSize: ".72rem", color: "rgba(15,15,15,0.44)" }}>Generating 8.4 kW · Saving ₦0 on bills</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── 2. TICKER ─────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Bayelsa State Govt","100kWp Otuan Plant","LATC Aguobiri","Korokorosei 100kWp","Dobi Gwagwalada 95kWp","500+ Happy Clients","10+ Years Experience","25-Year Warranty","Lagos • Abuja • Bayelsa"];
  const doubled = [...items,...items];
  return (
    <div style={{ background: "#f1f1f1", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "15px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: "3rem", animation: "ticker 26s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "3rem", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(15,15,15,0.4)", whiteSpace: "nowrap" }}>{item}</span>
            <span style={{ color: "#FFB800", fontSize: ".5rem" }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3. VSL ────────────────────────────────────────────────────────────────────
function VSL() {
  return (
    <Section bg="#fff">
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <Label>Watch First — 2 Minutes</Label>
          <Heading>See What Life Looks Like<br />
            <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Without Power Cuts</span>
          </Heading>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ position: "relative", borderRadius: "clamp(12px,3vw,20px)", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,184,0,0.14)", boxShadow: "0 32px 72px rgba(0,0,0,0.1)", aspectRatio: "16/9" }}>
          <img src={IMAGES.farm} alt="Solar farm" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.42)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.1rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "rgba(255,184,0,0.28)", animation: "pulse-ring 1.8s ease-out infinite" }} />
              <div style={{ width: "clamp(58px,10vw,84px)", height: "clamp(58px,10vw,84px)", borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 48px rgba(255,184,0,0.48)" }}>
                <svg viewBox="0 0 24 24" fill="#000" style={{ width: "36%", height: "36%", marginLeft: "6%" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(.75rem,1.5vw,.92rem)", letterSpacing: ".04em", textAlign: "center", padding: "0 1.5rem" }}>
              How ProSolar transformed 500+ Nigerian homes & businesses
            </p>
          </div>
          <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "5px 12px", border: "1px solid rgba(255,184,0,0.2)", fontSize: ".68rem", color: "#FFB800", fontWeight: 700, letterSpacing: ".08em" }}>🔴 REAL CLIENT STORIES</div>
        </div>
      </Reveal>
    </Section>
  );
}

// ── 4. PROBLEM ────────────────────────────────────────────────────────────────
function Problem() {
  const problems = [
    { emoji: "💸", title: "Spending ₦2.4M+ Per Year on Fuel", body: "The average Nigerian household runs a generator 8–12 hours daily. That's ₦80K–₦200K monthly straight into fuel — money you'll never get back." },
    { emoji: "⚡", title: "NEPA Will Never Fix Itself",         body: "Six decades of broken promises. The national grid has structurally failed. Waiting for it to improve is not a plan — it's costing you every single day." },
    { emoji: "🌫️", title: "Your Generator is a Health Risk",  body: "Carbon monoxide poisoning kills silently. Constant noise destroys concentration. Your children are breathing fumes. The true cost of gen-life goes way beyond money." },
  ];
  return (
    <Section id="problem" bg="linear-gradient(180deg,#fff 0%,#fffbf0 100%)">
      <div className="g2" style={{ alignItems: "center", marginBottom: "clamp(2.5rem,6vw,5rem)" }}>
        <div>
          <Reveal>
            <Label color="#FF5F00">The Real Problem</Label>
            <Heading>You're Trapped in a<br /><span style={{ color: "#FF5F00" }}>Broken Energy System</span></Heading>
            <p style={{ marginTop: "1.1rem", color: "rgba(15,15,15,0.5)", lineHeight: 1.8, fontSize: ".9rem" }}>
              Every day you run a generator you're renting power you'll never own. And it's not just inconvenience — it's a financial and health emergency hiding in plain sight.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} from="right">
          <div style={{ borderRadius: "clamp(12px,3vw,18px)", overflow: "hidden", border: "1px solid rgba(255,95,0,0.14)", boxShadow: "0 24px 56px rgba(0,0,0,0.08)" }}>
            <img src={IMAGES.roof} alt="Old rooftop" style={{ width: "100%", height: "clamp(180px,28vw,300px)", objectFit: "cover", filter: "brightness(0.6) saturate(0.45)" }} />
            <div style={{ background: "rgba(255,95,0,0.05)", padding: "1.1rem 1.4rem", borderTop: "1px solid rgba(255,95,0,0.11)" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#FF5F00", fontSize: ".92rem" }}>₦2.4M+ wasted annually</p>
              <p style={{ fontSize: ".78rem", color: "rgba(15,15,15,0.44)", marginTop: 3 }}>on fuel for the average Nigerian home running a generator</p>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="g3" style={{ marginBottom: "3rem" }}>
        {problems.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.09}>
            <div style={{ background: "rgba(255,95,0,0.04)", border: "1px solid rgba(255,95,0,0.13)", borderRadius: 15, padding: "1.6rem", transition: "all .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,95,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,95,0,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,95,0,0.04)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,95,0,0.13)"; }}>
              <div style={{ fontSize: "2rem", marginBottom: ".9rem" }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".95rem", marginBottom: ".6rem" }}>{p.title}</h3>
              <p style={{ color: "rgba(15,15,15,0.5)", lineHeight: 1.75, fontSize: ".85rem" }}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal><div style={{ textAlign: "center" }}><CTABtn label="End the Generator Cycle Today" size="lg" /></div></Reveal>
    </Section>
  );
}

// ── 5. SOLUTION ───────────────────────────────────────────────────────────────
function Solution() {
  const isMobile = useWindowWidth() < 600;
  const benefits = [
    { icon: "🔋", title: "Zero Electricity Bills",         body: "After installation, sunlight is free. No more NEPA bills, no more fuel receipts — ever." },
    { icon: "🛡️", title: "25-Year Performance Warranty",  body: "We don't install and disappear. Full warranty, maintenance & dedicated after-sales support." },
    { icon: "⚡", title: "Instant, Uninterrupted Power",  body: "Inverters switch in milliseconds. Your devices, your business — never interrupted again." },
  ];
  return (
    <Section id="services" bg="#fff">
      <div className="g2" style={{ alignItems: "center", marginBottom: "clamp(3rem,6vw,6rem)" }}>
        {/* Photo collage */}
        <Reveal from="left" delay={0.05}>
          {isMobile ? (
            <div style={{ borderRadius: 15, overflow: "hidden", border: "1px solid rgba(255,184,0,0.14)", boxShadow: "0 20px 48px rgba(0,0,0,0.08)" }}>
              <img src={IMAGES.panels2} alt="Solar panels" style={{ width: "100%", height: 220, objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{ position: "relative", height: 460 }}>
              <img src={IMAGES.panels2} alt="Solar panels" style={{ position: "absolute", top: 0, left: 0, width: "65%", height: 300, objectFit: "cover", borderRadius: 15, border: "1px solid rgba(255,184,0,0.13)", boxShadow: "0 28px 56px rgba(0,0,0,0.09)" }} />
              <img src={IMAGES.installation} alt="Installation" style={{ position: "absolute", bottom: 0, right: 0, width: "57%", height: 230, objectFit: "cover", borderRadius: 15, border: "1px solid rgba(255,184,0,0.13)", boxShadow: "0 28px 56px rgba(0,0,0,0.09)" }} />
              <div style={{ position: "absolute", bottom: "26%", left: "-6%", background: "#fff", border: "1px solid rgba(255,184,0,0.18)", borderRadius: 13, padding: ".85rem 1rem", boxShadow: "0 14px 36px rgba(0,0,0,0.08)" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.45rem", color: "#FFB800" }}>100%</div>
                <div style={{ fontSize: ".68rem", color: "rgba(15,15,15,0.44)", marginTop: 2 }}>Bill elimination<br />for our clients</div>
              </div>
            </div>
          )}
        </Reveal>
        {/* Text */}
        <div>
          <Reveal>
            <Label>The Solution</Label>
            <Heading>Your Personal Power Plant,<br />
              <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Installed in Days</span>
            </Heading>
            <p style={{ marginTop: "1.1rem", marginBottom: "1.9rem", color: "rgba(15,15,15,0.53)", lineHeight: 1.8, fontSize: ".9rem" }}>
              ProSolar designs, supplies, and installs premium solar systems tailored to your exact energy profile — homes, businesses, and rural communities across Nigeria.
            </p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.09}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.13)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", flexShrink: 0 }}>{b.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".9rem", marginBottom: ".32rem" }}>{b.title}</h3>
                    <p style={{ color: "rgba(15,15,15,0.5)", lineHeight: 1.7, fontSize: ".83rem" }}>{b.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      {/* Service cards */}
      <Reveal><div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
        <Label>Our Services</Label>
        <Heading style={{ fontSize: "clamp(1.55rem,3vw,2.35rem)" }}>Sustainable Solutions,<br />Personalised for You</Heading>
      </div></Reveal>
      <div className="g4">
        {[
          { img: IMAGES.home,         title: "Solar Home Systems",   desc: "Custom residential systems that power your entire home 24/7, fully off-grid." },
          { img: IMAGES.workers,      title: "Solar for Business",   desc: "Keep operations running. Protect revenue from power outages permanently." },
          { img: IMAGES.panels1,      title: "Rural Electrification",desc: "Bringing reliable power to communities underserved by the national grid." },
          { img: IMAGES.installation, title: "After-Sales Support",  desc: "Installation, commissioning, training, maintenance, and long-term repair." },
        ].map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div style={{ borderRadius: 15, overflow: "hidden", background: "#fff", border: "1px solid rgba(0,0,0,0.07)", transition: "all .3s", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.32)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,0,0,0.07)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              <img src={s.img} alt={s.title} style={{ width: "100%", height: 165, objectFit: "cover", filter: "brightness(0.76)" }} />
              <div style={{ padding: "1rem 1.15rem" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".88rem", marginBottom: ".35rem" }}>{s.title}</h3>
                <p style={{ fontSize: ".78rem", color: "rgba(15,15,15,0.44)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ── 6. TESTIMONIALS ───────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: "Mrs. Owolabi", loc: "Lagos",         stars: 5, text: "ProSolar transformed our lives completely. We haven't touched a generator in 8 months. The quality, the team, and the after-sales support — absolutely exceptional." },
    { name: "Mike Johnson", loc: "Abuja",         stars: 5, text: "My bills dropped to zero overnight. From consultation to installation, everything was seamless and professional. I wish I had done this three years ago." },
    { name: "Alice Brown",  loc: "Port Harcourt", stars: 5, text: "Fantastic from start to finish. The equipment is premium, the team was professional, and the post-installation support is genuinely impressive." },
    { name: "Tom Wilson",   loc: "Bayelsa",       stars: 5, text: "Our business runs 24/7 now without a single interruption. ProSolar paid for itself in under a year through fuel savings alone." },
  ];
  return (
    <Section bg="linear-gradient(180deg,#fffbf0 0%,#fff 100%)">
      <Reveal><div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
        <Label>Real People, Real Results</Label>
        <Heading>500+ Nigerians Have Already<br />Made the Switch</Heading>
      </div></Reveal>
      <div className="ga" style={{ marginBottom: "3.25rem" }}>
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.08}>
            <div style={{ background: "rgba(0,0,0,0.024)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 15, padding: "1.6rem", transition: "all .3s", height: "100%" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.22)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,184,0,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,0,0,0.07)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.024)"; }}>
              <div style={{ display: "flex", gap: 3, marginBottom: ".8rem" }}>
                {[...Array(r.stars)].map((_,j) => <span key={j} style={{ color: "#FFB800", fontSize: ".82rem" }}>★</span>)}
              </div>
              <p style={{ color: "rgba(15,15,15,0.63)", lineHeight: 1.75, fontSize: ".86rem", marginBottom: "1.3rem" }}>"{r.text}"</p>
              <div style={{ display: "flex", gap: ".65rem", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".88rem", color: "#000", flexShrink: 0 }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".85rem" }}>{r.name}</div>
                  <div style={{ fontSize: ".7rem", color: "#FFB800" }}>{r.loc}, Nigeria</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal><div style={{ textAlign: "center" }}><CTABtn label="Join 500+ Happy ProSolar Clients" size="lg" /></div></Reveal>
    </Section>
  );
}

// ── 7. ROADMAP + INCLUDED ─────────────────────────────────────────────────────
function Roadmap() {
  const steps = [
    { num: "01", title: "Book Free Consultation",    body: "Fill out our quick form. We schedule a call to understand your energy needs — zero pressure, zero cost." },
    { num: "02", title: "Site Survey",               body: "Our engineers visit your location, assess roof space, shading, and environmental factors specific to your site." },
    { num: "03", title: "Energy Audit & Design",     body: "We calculate your exact power requirements and design a system sized perfectly for your consumption." },
    { num: "04", title: "Professional Installation", body: "Certified team installs your system. Most residential installs complete in 1–3 days. You're powered." },
  ];
  const included = ["Premium Tier-1 Solar Panels","High-Efficiency Inverter","Deep-Cycle Battery Storage","Full Wiring & Mounting Hardware","Smart Energy Monitoring App","25-Year Performance Warranty","Annual Maintenance Visit","24/7 Customer Support Line"];
  return (
    <Section id="how" bg="#fff">
      <div className="g2">
        <div>
          <Reveal>
            <Label>The Roadmap</Label>
            <Heading style={{ fontSize: "clamp(1.65rem,3vw,2.45rem)", marginBottom: "2.25rem" }}>How We Get You<br />Powered Up</Heading>
          </Reveal>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 23, top: 44, bottom: 12, width: 2, background: "linear-gradient(180deg,#FFB800,rgba(255,184,0,0.06))" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2.1rem", position: "relative" }}>
              {steps.map((s, i) => (
                <Reveal key={s.num} delay={i * 0.09}>
                  <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                    <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: ".73rem", color: "#000", boxShadow: "0 0 16px rgba(255,184,0,0.22)" }}>{s.num}</div>
                    <div style={{ paddingTop: 9 }}>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".9rem", marginBottom: ".36rem" }}>{s.title}</h3>
                      <p style={{ color: "rgba(15,15,15,0.44)", lineHeight: 1.7, fontSize: ".83rem" }}>{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Reveal>
            <Label>What's Included</Label>
            <Heading style={{ fontSize: "clamp(1.65rem,3vw,2.45rem)", marginBottom: "2.25rem" }}>Everything You Need,<br />Nothing You Don't</Heading>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {included.map((item, i) => (
              <Reveal key={item} delay={i * 0.055}>
                <div style={{ display: "flex", gap: ".85rem", alignItems: "center", background: "rgba(255,184,0,0.04)", border: "1px solid rgba(255,184,0,0.11)", borderRadius: 10, padding: ".85rem 1.05rem", transition: "all .25s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,184,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.22)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,184,0,0.04)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.11)"; }}>
                  <div style={{ width: 19, height: 19, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" style={{ width: 10, height: 10 }}><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize: ".85rem", color: "rgba(15,15,15,0.73)" }}>{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <Reveal delay={0.1}><div style={{ textAlign: "center", marginTop: "3.75rem" }}><CTABtn label="Get My Custom Solar Package" size="lg" /></div></Reveal>
    </Section>
  );
}

// ── 8. PROJECTS ───────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    { img: IMAGES.farm,         title: "100kWp Solar Plant", loc: "Otuan, Southern Ijaw, Bayelsa" },
    { img: IMAGES.panels1,      title: "33kWp Solar Plant",  loc: "Aguobiri, Southern Ijaw, Bayelsa" },
    { img: IMAGES.panels2,      title: "100kWp Solar Plant", loc: "Korokorosei, Southern Ijaw, Bayelsa" },
    { img: IMAGES.installation, title: "95kWp Solar Plant",  loc: "Dobi, Gwagwalada, Abuja" },
  ];
  return (
    <Section id="projects" bg="linear-gradient(180deg,#fff 0%,#fffbf0 100%)">
      <Reveal><div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
        <Label>Past Projects</Label>
        <Heading>Delivering Power Across Nigeria</Heading>
      </div></Reveal>
      <div className="g4">
        {projects.map((p, i) => (
          <Reveal key={p.loc} delay={i * 0.08}>
            <div style={{ borderRadius: 15, overflow: "hidden", position: "relative", border: "1px solid rgba(0,0,0,0.07)", transition: "all .3s", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,0,0,0.07)"; }}>
              <img src={p.img} alt={p.title} style={{ width: "100%", height: 195, objectFit: "cover", filter: "brightness(0.66)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.86))", padding: "2.5rem 1.2rem 1.2rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#FFB800", fontSize: ".68rem", letterSpacing: ".1em", marginBottom: 3 }}>COMPLETED</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: ".9rem" }}>{p.title}</h3>
                <p style={{ fontSize: ".73rem", color: "rgba(255,255,255,0.52)", marginTop: 2 }}>{p.loc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ── 9. ABOUT ──────────────────────────────────────────────────────────────────
function About() {
  const isMobile = useWindowWidth() < 600;
  return (
    <Section id="about" bg="#fff">
      <div className="g2" style={{ alignItems: "center" }}>
        <div>
          <Reveal>
            <Label>About ProSolar</Label>
            <Heading>Nigeria's Most Trusted<br />
              <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Solar Energy Company</span>
            </Heading>
            <p style={{ marginTop: "1.1rem", color: "rgba(15,15,15,0.53)", lineHeight: 1.8, marginBottom: ".9rem", fontSize: ".9rem" }}>
              ProSolar Energy was built on one mission: give every Nigerian access to reliable, affordable, clean electricity. We've delivered landmark projects from Abuja to Bayelsa, powering homes, hospitals, schools, and businesses.
            </p>
            <p style={{ color: "rgba(15,15,15,0.53)", lineHeight: 1.8, marginBottom: "1.9rem", fontSize: ".9rem" }}>
              Our certified engineers bring international standards to local execution — with after-sales support that never ends at installation. We're your long-term energy partner, not just a vendor.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
            {[["10+","Years in Operation"],["₦0","Bills for 500+ Clients"],["5 States","Projects Delivered"],["25yr","Performance Warranty"]].map(([v,l]) => (
              <Reveal key={l}>
                <div style={{ background: "rgba(255,184,0,0.05)", border: "1px solid rgba(255,184,0,0.12)", borderRadius: 11, padding: "1rem" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.45rem", color: "#FFB800" }}>{v}</div>
                  <div style={{ fontSize: ".7rem", color: "rgba(15,15,15,0.42)", marginTop: 3, lineHeight: 1.5 }}>{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal from="right" delay={0.1}>
          <div style={{ position: "relative" }}>
            <img src={IMAGES.team} alt="ProSolar team" style={{ width: "100%", height: "clamp(280px,42vw,460px)", objectFit: "cover", borderRadius: 19, border: "1px solid rgba(255,184,0,0.13)", boxShadow: "0 36px 72px rgba(0,0,0,0.1)" }} />
            {!isMobile && (
              <div style={{ position: "absolute", bottom: -14, left: -14, background: "#fff", backdropFilter: "blur(12px)", border: "1px solid rgba(255,184,0,0.18)", borderRadius: 13, padding: "1rem 1.25rem", boxShadow: "0 14px 36px rgba(0,0,0,0.09)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00E676", boxShadow: "0 0 7px #00E676" }} />
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".8rem" }}>Built for Nigeria</span>
                </div>
                <p style={{ fontSize: ".7rem", color: "rgba(15,15,15,0.44)", maxWidth: 165, lineHeight: 1.5 }}>Engineered for tropical heat, humidity & harmattan conditions</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ── 10. FAQ ───────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number|null>(null);
  const faqs = [
    { q: "How much does a solar system cost?",              a: "Every system is custom-designed for your energy needs. A basic home system starts from ₦1.5M, while commercial systems scale with load requirements. We provide free, no-obligation quotes after a quick consultation." },
    { q: "How long does installation take?",                a: "Most residential installations are complete within 1–3 days. Commercial and larger rural projects may take 1–2 weeks. We provide a precise timeline after the site survey." },
    { q: "What happens at night or on cloudy days?",        a: "Your battery storage system keeps you fully powered through nights and overcast days. We design battery capacity specifically around your usage patterns so you're never left dark." },
    { q: "Do you operate in my area?",                     a: "We currently serve Lagos, Abuja, Rivers, Bayelsa, and Delta states with active expansion underway. Contact us to confirm availability in your exact location." },
    { q: "What does the 25-year warranty cover?",           a: "Panel performance output, inverter function, battery capacity, and all workmanship. If anything underperforms within the warranty period, we fix or replace it at zero cost to you." },
    { q: "Can solar power my AC, fridge, and heavy appliances?", a: "Absolutely. We conduct a thorough energy audit to size your system correctly. Many clients run multiple ACs, refrigerators, and full office equipment 24/7 on ProSolar systems." },
  ];
  return (
    <Section id="faq" bg="linear-gradient(180deg,#fffbf0 0%,#fff 100%)">
      <Reveal><div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
        <Label>FAQ</Label>
        <Heading>Questions You're Probably Thinking</Heading>
      </div></Reveal>
      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "3.25rem" }}>
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <div onClick={() => setOpen(open === i ? null : i)}
              style={{ background: open === i ? "rgba(255,184,0,0.05)" : "rgba(0,0,0,0.023)", border: `1px solid ${open === i ? "rgba(255,184,0,0.2)" : "rgba(0,0,0,0.07)"}`, borderRadius: 12, overflow: "hidden", transition: "all .3s", cursor: "pointer" }}>
              <div style={{ padding: "1.15rem 1.35rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#111", fontSize: ".875rem", lineHeight: 1.4 }}>{f.q}</span>
                <span style={{ color: "#FFB800", fontSize: "1.25rem", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .3s", lineHeight: 1 }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding: "0 1.35rem 1.35rem" }}>
                  <p style={{ color: "rgba(15,15,15,0.53)", lineHeight: 1.75, fontSize: ".86rem" }}>{f.a}</p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal><div style={{ textAlign: "center" }}><CTABtn label="Still Have Questions? Let's Talk" size="lg" /></div></Reveal>
    </Section>
  );
}

// ── 11. FINAL CTA ─────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="quote" style={{ position: "relative", overflow: "hidden", padding: "clamp(68px,12vw,136px) clamp(1.25rem,5vw,3rem)", textAlign: "center" }}>
      <img src={IMAGES.farm} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.16) saturate(0.65)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,184,0,0.12) 0%, rgba(255,255,255,0.88) 70%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,184,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,184,0,0.06) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 660, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.28)", borderRadius: 100, padding: "6px 15px", marginBottom: "1.6rem", fontSize: ".72rem", color: "#FFB800", letterSpacing: ".1em", fontWeight: 600 }}>
            🎉 FREE CONSULTATION · NO COMMITMENT REQUIRED
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem,6.5vw,4.4rem)", color: "#111", letterSpacing: "-.04em", lineHeight: .97, marginBottom: "1.1rem" }}>
            Ready to Own<br />
            <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Power?</span>
          </h2>
          <p style={{ color: "rgba(15,15,15,0.53)", fontSize: "clamp(.88rem,1.5vw,1.08rem)", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 2.25rem" }}>
            Join 500+ Nigerians who escaped NEPA and generator life permanently. Get a free, custom solar quote within 24 hours — no sales pressure.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".85rem" }}>
            <CTABtn label="Get My Free Quote Now — 100% Free" size="lg" />
            <p style={{ fontSize: ".75rem", color: "rgba(15,15,15,0.28)" }}>No spam. No pressure. Just honest solar advice from Nigeria's most trusted team.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "clamp(2rem,5vw,3rem) clamp(1.25rem,5vw,3rem)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="footer-g" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2.5rem", marginBottom: "2.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: ".8rem" }}>
              <div style={{ width: 29, height: 29, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              </div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: ".98rem" }}>PROSOLAR ENERGY</span>
            </div>
            <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,0.36)", lineHeight: 1.7, maxWidth: 240 }}>Nigeria's most trusted solar energy company. Powering homes and businesses with clean energy since 2014.</p>
          </div>
          {[
            { title: "Services", links: ["Solar Home Systems","Commercial Solar","Rural Electrification","After-Sales Support"] },
            { title: "Company",  links: ["About Us","Projects","Blog","Careers"] },
            { title: "Contact",  links: ["Get a Quote","WhatsApp Us","Email Us","Visit Us"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".78rem", marginBottom: ".85rem", letterSpacing: ".06em" }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".52rem" }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.36)", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#FFB800")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.36)")}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".75rem" }}>
          <p style={{ fontSize: ".73rem", color: "rgba(255,255,255,0.24)" }}>© {new Date().getFullYear()} ProSolar Energy Nigeria Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            {["Privacy Policy","Terms of Service"].map(l => (
              <a key={l} href="#" style={{ fontSize: ".73rem", color: "rgba(255,255,255,0.24)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FFB800")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.24)")}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function ProSolarPage() {
  return (
    <>
      <GlobalStyle />
      <Nav />
      <Hero />
      <Ticker />
      <VSL />
      <Problem />
      <Solution />
      <Testimonials />
      <Roadmap />
      <Projects />
      <About />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}