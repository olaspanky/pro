"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// ── IMAGES (Unsplash CDN – free, no attribution required) ──────────────────
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85&fit=crop",
  panels1: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=900&q=80&fit=crop",
  panels2: "https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=900&q=80&fit=crop",
  installation: "https://images.unsplash.com/photo-1548348384-b1e021e3d9b2?w=900&q=80&fit=crop",
  home: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop",
  farm: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400&q=80&fit=crop",
  team: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80&fit=crop",
  workers: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=900&q=80&fit=crop",
  roof: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900&q=80&fit=crop",
};

// ── TYPES ───────────────────────────────────────────────────────────────────
interface RevealProps { children: ReactNode; delay?: number; className?: string; from?: "bottom" | "left" | "right"; }

// ── HOOK: in-view ───────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// ── REVEAL WRAPPER ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "", from = "bottom" }: RevealProps) {
  const [ref, inView] = useInView();
  const startY = from === "bottom" ? 36 : 0;
  const startX = from === "left" ? -36 : from === "right" ? 36 : 0;
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0,0)" : `translate(${startX}px,${startY}px)`,
      transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #070707; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #070707; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#FFB800,#FF5F00); border-radius: 4px; }
    ::selection { background: rgba(255,184,0,0.25); }
    img { display: block; max-width: 100%; }

    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes pulse-ring { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(1.6); opacity: 0; } }
    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes shimmer { 0%,100% { opacity:.4; } 50% { opacity:1; } }
    @keyframes count-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      padding: "0 clamp(1rem, 4vw, 3rem)",
      background: scrolled ? "rgba(7,7,7,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,184,0,0.1)" : "none",
      transition: "all 0.4s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg,#FFB800,#FF5F00)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(255,184,0,0.4)",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ width: 18, height: 18 }}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#fff", letterSpacing: "-.01em" }}>PROSOLAR</span>
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {["Services", "Projects", "About", "FAQ"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            color: "rgba(255,255,255,0.6)", textDecoration: "none",
            fontSize: ".85rem", letterSpacing: ".05em", fontFamily: "'Plus Jakarta Sans',sans-serif",
            transition: "color .2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FFB800")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>{l}</a>
        ))}
        <CTABtn label="Free Quote" size="sm" />
      </div>
    </nav>
  );
}

// ── CTA BUTTON ───────────────────────────────────────────────────────────────
interface CTABtnProps { label?: string; size?: "sm" | "md" | "lg"; }
function CTABtn({ label = "Get My Free Solar Quote", size = "lg" }: CTABtnProps) {
  const [hov, setHov] = useState(false);
  const pad = size === "lg" ? "18px 40px" : size === "md" ? "14px 30px" : "10px 22px";
  const fs = size === "lg" ? "1rem" : size === "md" ? ".9rem" : ".82rem";
  return (
    <a href="#quote"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: hov ? "linear-gradient(135deg,#FFCA28,#FF5F00)" : "linear-gradient(135deg,#FFB800,#FF5F00)",
        color: "#000", padding: pad, borderRadius: 100,
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: fs,
        textDecoration: "none", letterSpacing: ".02em", whiteSpace: "nowrap",
        transform: hov ? "scale(1.04) translateY(-2px)" : "scale(1) translateY(0)",
        boxShadow: hov ? "0 16px 48px rgba(255,184,0,0.45)" : "0 4px 24px rgba(255,184,0,0.2)",
        transition: "all .25s cubic-bezier(.22,1,.36,1)",
      }}>
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
      {label}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15 }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
    </a>
  );
}

// ── SECTION WRAPPER ───────────────────────────────────────────────────────────
function Section({ children, id, bg = "transparent", style = {} }: { children: ReactNode; id?: string; bg?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ background: bg, padding: "clamp(60px,10vw,120px) clamp(1rem,5vw,3rem)", ...style }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Label({ children, color = "#FFB800" }: { children: ReactNode; color?: string }) {
  return (
    <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color, fontSize: ".78rem", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>
      {children}
    </p>
  );
}

function Heading({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.2rem)", color: "#fff", letterSpacing: "-.035em", lineHeight: 1.05, ...style }}>
      {children}
    </h2>
  );
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
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* BG IMAGE */}
      <img src={IMAGES.hero} alt="Solar panels" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center",
        filter: "brightness(0.28)",
      }} />
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(7,7,7,0.97) 40%, rgba(7,7,7,0.4) 100%)" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,184,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,184,0,0.04) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, background: "radial-gradient(circle,rgba(255,184,0,0.12),transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "120px clamp(1rem,5vw,3rem) 80px", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          {/* Badge */}
          <Reveal>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)",
              borderRadius: 100, padding: "8px 18px", marginBottom: "2rem",
              fontSize: ".82rem", color: "#FFB800", letterSpacing: ".1em", fontWeight: 600,
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              NIGERIA'S PREMIUM SOLAR ENERGY COMPANY
            </div>
          </Reveal>

          {/* HOOK */}
          <Reveal delay={0.05}>
            <h1 style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(3.2rem,7.5vw,7rem)", color: "#fff",
              letterSpacing: "-.04em", lineHeight: .98, marginBottom: "1.5rem",
            }}>
              Stop Paying<br />
              <span style={{ background: "linear-gradient(120deg,#FFB800 20%,#FF5F00 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                NEPA.
              </span>
              <br />Own Your Power.
            </h1>
          </Reveal>

          {/* SUB HEADING */}
          <Reveal delay={0.1}>
            <p style={{ fontSize: "clamp(1rem,2vw,1.25rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 580, marginBottom: "2.5rem", fontWeight: 400 }}>
              ProSolar Energy designs, supplies & installs premium solar systems that eliminate electricity bills, survive Nigeria's harshest conditions, and run reliably for 25+ years — guaranteed.
            </p>
          </Reveal>

          {/* CTA ROW */}
          <Reveal delay={0.15}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
              <CTABtn label="Get My Free Solar Quote" size="lg" />
              <a href="#how" style={{
                display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.65)",
                fontSize: ".95rem", textDecoration: "none", padding: "18px 28px",
                border: "1px solid rgba(255,255,255,0.14)", borderRadius: 100, transition: "border-color .2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,184,0,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                See How It Works
              </a>
            </div>
          </Reveal>

          {/* SOCIAL PROOF NUMBERS */}
          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: "clamp(1.5rem,4vw,3rem)", flexWrap: "wrap", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { val: `${count}+`, label: "Happy Clients" },
                { val: "25yr", label: "Warranty" },
                { val: "100%", label: "Bill Reduction" },
                { val: "⭐ 4.9", label: "Average Rating" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2rem)", color: "#FFB800" }}>{s.val}</div>
                  <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.38)", letterSpacing: ".08em", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Floating image panel (desktop) */}
      <div style={{ position: "absolute", right: "clamp(1rem,5vw,4rem)", bottom: "6%", width: "clamp(240px,30vw,380px)", zIndex: 2 }}>
        <Reveal from="right" delay={0.25}>
          <div style={{
            borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,184,0,0.2)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,184,0,0.1)",
            animation: "float 5s ease-in-out infinite",
          }}>
            <img src={IMAGES.panels1} alt="Solar installation" style={{ width: "100%", height: 260, objectFit: "cover" }} />
            <div style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)", padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(255,184,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00E676", boxShadow: "0 0 8px #00E676", animation: "shimmer 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".9rem" }}>System Active</span>
              </div>
              <div style={{ marginTop: 8, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: ".78rem", color: "rgba(255,255,255,0.45)" }}>Generating 8.4 kW · Saving ₦0 on bills</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── 2. SOCIAL PROOF TICKER ────────────────────────────────────────────────────
function Ticker() {
  const items = ["Bayelsa State Govt", "100kWp Otuan Plant", "LATC Aguobiri", "Korokorosei 100kWp", "Dobi Gwagwalada 95kWp", "500+ Happy Clients", "10+ Years Experience", "25-Year Warranty", "Lagos • Abuja • Bayelsa"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "18px 0", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", gap: "3rem", animation: "ticker 28s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "3rem", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>{item}</span>
            <span style={{ color: "#FFB800", fontSize: ".6rem" }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3. VSL SECTION ────────────────────────────────────────────────────────────
function VSL() {
  const [playing, setPlaying] = useState(false);
  return (
    <Section bg="#070707">
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Label>Watch First — 2 Minutes</Label>
          <Heading>See What Life Looks Like<br />
            <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Without Power Cuts
            </span>
          </Heading>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div onClick={() => setPlaying(true)} style={{
          position: "relative", borderRadius: 24, overflow: "hidden", cursor: "pointer",
          border: "1px solid rgba(255,184,0,0.15)", boxShadow: "0 60px 120px rgba(0,0,0,0.7)",
          aspectRatio: "16/9",
        }}>
          <img src={IMAGES.farm} alt="Solar farm" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }} />
          {/* Overlay grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(255,184,0,0.04) 0,rgba(255,184,0,0.04) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(255,184,0,0.04) 0,rgba(255,184,0,0.04) 1px,transparent 1px,transparent 64px)" }} />
          {/* Play btn */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "rgba(255,184,0,0.3)", animation: "pulse-ring 1.8s ease-out infinite" }} />
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                background: "linear-gradient(135deg,#FFB800,#FF5F00)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 60px rgba(255,184,0,0.5)",
                transition: "transform .2s",
              }}>
                <svg viewBox="0 0 24 24" fill="#000" style={{ width: 34, height: 34, marginLeft: 4 }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,0.55)", fontSize: ".9rem", letterSpacing: ".06em" }}>
              How ProSolar transformed 500+ Nigerian homes & businesses
            </p>
          </div>
          {/* Corner tags */}
          <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "6px 14px", border: "1px solid rgba(255,184,0,0.2)", fontSize: ".75rem", color: "#FFB800", fontWeight: 600, letterSpacing: ".08em" }}>🔴 REAL CLIENT STORIES</div>
        </div>
      </Reveal>
    </Section>
  );
}

// ── 4. THE PROBLEM ────────────────────────────────────────────────────────────
function Problem() {
  const problems = [
    { emoji: "💸", title: "Spending ₦2.4M+ Per Year on Fuel", body: "The average Nigerian household runs a generator 8–12 hours daily. That's ₦80K–₦200K monthly straight into fuel — money you'll never get back." },
    { emoji: "⚡", title: "NEPA Will Never Fix Itself", body: "Six decades of broken promises. The national grid has structurally failed. Waiting for it to improve is not a plan — it's costing you every single day." },
    { emoji: "🌫️", title: "Your Generator is a Health Risk", body: "Carbon monoxide poisoning kills silently. Constant noise destroys concentration. Your children are breathing fumes. The true cost of gen-life goes way beyond money." },
  ];
  return (
    <Section id="problem" bg="linear-gradient(180deg,#070707 0%,#0c0800 100%)">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)", alignItems: "center", marginBottom: "clamp(3rem,6vw,5rem)" }}>
        <div>
          <Reveal>
            <Label color="#FF5F00">The Real Problem</Label>
            <Heading>You're Trapped in a<br />
              <span style={{ color: "#FF5F00" }}>Broken Energy System</span>
            </Heading>
            <p style={{ marginTop: "1.5rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: ".95rem" }}>
              Every day you run a generator you're renting power you'll never own. Let's call it what it is. And it's not just inconvenience — it's a financial and health emergency hiding in plain sight.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.12} from="right">
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,95,0,0.15)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
            <img src={IMAGES.roof} alt="Old rooftop" style={{ width: "100%", height: 320, objectFit: "cover", filter: "brightness(0.65) saturate(0.5)" }} />
            <div style={{ background: "rgba(255,95,0,0.08)", padding: "1.5rem", borderTop: "1px solid rgba(255,95,0,0.15)" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#FF5F00", fontSize: "1rem" }}>₦2.4M+ wasted annually</p>
              <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>on fuel for the average Nigerian home running a generator</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem", marginBottom: "3.5rem" }}>
        {problems.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <div style={{
              background: "rgba(255,95,0,0.05)", border: "1px solid rgba(255,95,0,0.15)",
              borderRadius: 18, padding: "2rem", transition: "all .3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,95,0,0.1)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,95,0,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,95,0,0.05)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,95,0,0.15)"; }}>
              <div style={{ fontSize: "2.4rem", marginBottom: "1.25rem" }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: "1.05rem", marginBottom: ".75rem" }}>{p.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75, fontSize: ".9rem" }}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div style={{ textAlign: "center" }}>
          <CTABtn label="End the Generator Cycle Today" size="lg" />
        </div>
      </Reveal>
    </Section>
  );
}

// ── 5. SOLUTION ───────────────────────────────────────────────────────────────
function Solution() {
  const benefits = [
    { icon: "🔋", title: "Zero Electricity Bills", body: "After installation, sunlight is free. No more NEPA bills, no more fuel receipts — ever." },
    { icon: "🛡️", title: "25-Year Performance Warranty", body: "We don't install and disappear. Full warranty, maintenance & dedicated after-sales support." },
    { icon: "⚡", title: "Instant, Uninterrupted Power", body: "Inverters switch in milliseconds. Your devices, your business — never interrupted again." },
  ];
  return (
    <Section id="services" bg="#070707">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)", alignItems: "center" }}>
        {/* Images collage */}
        <Reveal from="left" delay={0.05}>
          <div style={{ position: "relative", height: 520 }}>
            <img src={IMAGES.panels2} alt="Solar panels" style={{
              position: "absolute", top: 0, left: 0, width: "65%", height: 340,
              objectFit: "cover", borderRadius: 18,
              border: "1px solid rgba(255,184,0,0.15)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            }} />
            <img src={IMAGES.installation} alt="Installation" style={{
              position: "absolute", bottom: 0, right: 0, width: "58%", height: 260,
              objectFit: "cover", borderRadius: 18,
              border: "1px solid rgba(255,184,0,0.15)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            }} />
            {/* Stats badge */}
            <div style={{
              position: "absolute", bottom: "28%", left: "-10%",
              background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,184,0,0.2)", borderRadius: 16, padding: "1rem 1.25rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#FFB800" }}>100%</div>
              <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Bill elimination<br />for our clients</div>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <Label>The Solution</Label>
            <Heading>Your Personal Power Plant,<br />
              <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Installed in Days
              </span>
            </Heading>
            <p style={{ marginTop: "1.5rem", marginBottom: "2.5rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontSize: ".95rem" }}>
              ProSolar designs, supplies, and installs premium solar systems tailored to your exact energy profile — homes, businesses, and rural communities across Nigeria.
            </p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.1}>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>{b.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".95rem", marginBottom: ".4rem" }}>{b.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: ".88rem" }}>{b.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div style={{ marginTop: "clamp(3rem,6vw,6rem)" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Label>Our Services</Label>
            <Heading style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>Sustainable Solutions,<br />Personalised for You</Heading>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
          {[
            { img: IMAGES.home, title: "Solar Home Systems", desc: "Custom residential systems that power your entire home 24/7, fully off-grid." },
            { img: IMAGES.workers, title: "Solar for Business", desc: "Keep your operations running. Protect revenue from power outages permanently." },
            { img: IMAGES.panels1, title: "Rural Electrification", desc: "Bringing clean, reliable power to communities underserved by the national grid." },
            { img: IMAGES.installation, title: "After-Sales Support", desc: "Installation to commissioning, training, maintenance, and long-term repair." },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div style={{
                borderRadius: 18, overflow: "hidden", background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.07)", transition: "all .3s", cursor: "pointer",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                <img src={s.img} alt={s.title} style={{ width: "100%", height: 180, objectFit: "cover", filter: "brightness(0.75)" }} />
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".95rem", marginBottom: ".5rem" }}>{s.title}</h3>
                  <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── 6. TESTIMONIALS ───────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: "Mrs. Owolabi", loc: "Lagos", stars: 5, text: "ProSolar transformed our lives completely. We haven't touched a generator in 8 months. The quality, the team, and the after-sales support — absolutely exceptional." },
    { name: "Mike Johnson", loc: "Abuja", stars: 5, text: "My bills dropped to zero overnight. From consultation to installation, everything was seamless and professional. I wish I had done this three years ago." },
    { name: "Alice Brown", loc: "Port Harcourt", stars: 5, text: "Fantastic from start to finish. The equipment is premium, the team was professional, and the post-installation support is genuinely impressive." },
    { name: "Tom Wilson", loc: "Bayelsa", stars: 5, text: "Our business runs 24/7 now without a single interruption. ProSolar paid for itself in under a year through fuel savings alone." },
  ];
  return (
    <Section bg="linear-gradient(180deg,#0c0800 0%,#070707 100%)">
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Label>Real People, Real Results</Label>
          <Heading>500+ Nigerians Have Already<br />Made the Switch</Heading>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.08}>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: "2rem", transition: "all .3s", height: "100%",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.2)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,184,0,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}>
              <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
                {[...Array(r.stars)].map((_, j) => <span key={j} style={{ color: "#FFB800", fontSize: ".9rem" }}>★</span>)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.75, fontSize: ".9rem", marginBottom: "1.5rem" }}>"{r.text}"</p>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".9rem", color: "#000" }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".9rem" }}>{r.name}</div>
                  <div style={{ fontSize: ".75rem", color: "#FFB800" }}>{r.loc}, Nigeria</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div style={{ textAlign: "center" }}>
          <CTABtn label="Join 500+ Happy ProSolar Clients" size="lg" />
        </div>
      </Reveal>
    </Section>
  );
}

// ── 7. ROADMAP + WHAT'S INCLUDED ──────────────────────────────────────────────
function Roadmap() {
  const steps = [
    { num: "01", title: "Book Free Consultation", body: "Fill out our quick form. We schedule a call to understand your energy needs — zero pressure, zero cost." },
    { num: "02", title: "Site Survey", body: "Our engineers visit your location, assess roof space, shading, and environmental factors specific to your site." },
    { num: "03", title: "Energy Audit & Custom Design", body: "We calculate your exact power requirements and design a system sized perfectly for your consumption." },
    { num: "04", title: "Professional Installation", body: "Certified team installs your system. Most residential installs complete in 1–3 days. You're powered." },
  ];
  const included = [
    "Premium Tier-1 Solar Panels", "High-Efficiency Inverter",
    "Deep-Cycle Battery Storage", "Full Wiring & Mounting Hardware",
    "Smart Energy Monitoring App", "25-Year Performance Warranty",
    "Annual Maintenance Visit", "24/7 Customer Support Line",
  ];
  return (
    <Section id="how" bg="#070707">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)" }}>
        {/* Roadmap */}
        <div>
          <Reveal>
            <Label>The Roadmap</Label>
            <Heading style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", marginBottom: "3rem" }}>How We Get You<br />Powered Up</Heading>
          </Reveal>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 23, top: 46, bottom: 20, width: 2, background: "linear-gradient(180deg,#FFB800 0%,rgba(255,184,0,0.1) 100%)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", position: "relative" }}>
              {steps.map((s, i) => (
                <Reveal key={s.num} delay={i * 0.1}>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#FFB800,#FF5F00)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: ".78rem", color: "#000",
                      boxShadow: "0 0 20px rgba(255,184,0,0.3)",
                    }}>{s.num}</div>
                    <div style={{ paddingTop: 10 }}>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".95rem", marginBottom: ".45rem" }}>{s.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontSize: ".88rem" }}>{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* What's included */}
        <div>
          <Reveal>
            <Label>What's Included</Label>
            <Heading style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", marginBottom: "3rem" }}>Everything You Need,<br />Nothing You Don't</Heading>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {included.map((item, i) => (
              <Reveal key={item} delay={i * 0.07}>
                <div style={{
                  display: "flex", gap: "1rem", alignItems: "center",
                  background: "rgba(255,184,0,0.04)", border: "1px solid rgba(255,184,0,0.1)",
                  borderRadius: 12, padding: "1rem 1.25rem", transition: "all .25s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,184,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,184,0,0.04)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.1)"; }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" style={{ width: 12, height: 12 }}><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <span style={{ fontSize: ".9rem", color: "rgba(255,255,255,0.78)" }}>{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Reveal delay={0.15}>
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <CTABtn label="Get My Custom Solar Package" size="lg" />
        </div>
      </Reveal>
    </Section>
  );
}

// ── 8. PROJECTS ───────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    { img: IMAGES.farm, title: "100kWp Solar Plant", loc: "Otuan, Southern Ijaw, Bayelsa" },
    { img: IMAGES.panels1, title: "33kWp Solar Plant", loc: "Aguobiri, Southern Ijaw, Bayelsa" },
    { img: IMAGES.panels2, title: "100kWp Solar Plant", loc: "Korokorosei, Southern Ijaw, Bayelsa" },
    { img: IMAGES.installation, title: "95kWp Solar Plant", loc: "Dobi, Gwagwalada, Abuja" },
  ];
  return (
    <Section id="projects" bg="linear-gradient(180deg,#070707 0%,#0c0800 100%)">
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Label>Past Projects</Label>
          <Heading>Delivering Power Across Nigeria</Heading>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
        {projects.map((p, i) => (
          <Reveal key={p.title + p.loc} delay={i * 0.1}>
            <div style={{
              borderRadius: 20, overflow: "hidden", position: "relative",
              border: "1px solid rgba(255,255,255,0.07)", transition: "all .3s", cursor: "pointer",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,184,0,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
              <img src={p.img} alt={p.title} style={{ width: "100%", height: 220, objectFit: "cover", filter: "brightness(0.7)" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.92))",
                padding: "3rem 1.5rem 1.5rem",
              }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#FFB800", fontSize: ".78rem", letterSpacing: ".1em", marginBottom: 4 }}>COMPLETED PROJECT</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: "1rem" }}>{p.title}</h3>
                <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{p.loc}</p>
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
  return (
    <Section id="about" bg="#070707">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)", alignItems: "center" }}>
        <div>
          <Reveal>
            <Label>About ProSolar</Label>
            <Heading>Nigeria's Most Trusted<br />
              <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Solar Energy Company
              </span>
            </Heading>
            <p style={{ marginTop: "1.5rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              ProSolar Energy was built on one mission: give every Nigerian access to reliable, affordable, clean electricity. We've delivered landmark projects from Abuja to Bayelsa, powering homes, hospitals, schools, and businesses.
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              Our certified engineers bring international standards to local execution — with after-sales support that never ends at installation. We're your long-term energy partner, not just a vendor.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[["10+", "Years in Operation"], ["₦0", "Bills for 500+ Clients"], ["5 States", "Projects Delivered"], ["25yr", "Performance Warranty"]].map(([v, l]) => (
              <Reveal key={l}>
                <div style={{ background: "rgba(255,184,0,0.05)", border: "1px solid rgba(255,184,0,0.12)", borderRadius: 14, padding: "1.25rem" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#FFB800" }}>{v}</div>
                  <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.5 }}>{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal from="right" delay={0.1}>
          <div style={{ position: "relative" }}>
            <img src={IMAGES.team} alt="ProSolar team" style={{
              width: "100%", height: 480, objectFit: "cover", borderRadius: 22,
              border: "1px solid rgba(255,184,0,0.15)", boxShadow: "0 60px 120px rgba(0,0,0,0.6)",
            }} />
            <div style={{
              position: "absolute", bottom: -20, left: -20,
              background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,184,0,0.2)", borderRadius: 16, padding: "1.25rem 1.5rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E676", boxShadow: "0 0 8px #00E676" }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".85rem" }}>Built for Nigeria</span>
              </div>
              <p style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.4)", maxWidth: 180, lineHeight: 1.5 }}>Engineered for tropical heat, humidity & harmattan conditions</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ── 10. FAQ ───────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How much does a solar system cost?", a: "Every system is custom-designed for your energy needs. A basic home system starts from ₦1.5M, while commercial systems scale with load requirements. We provide free, no-obligation quotes after a quick consultation." },
    { q: "How long does installation take?", a: "Most residential installations are complete within 1–3 days. Commercial and larger rural projects may take 1–2 weeks. We provide a precise timeline after the site survey." },
    { q: "What happens at night or on cloudy days?", a: "Your battery storage system keeps you fully powered through nights and overcast days. We design battery capacity specifically around your usage patterns so you're never left dark." },
    { q: "Do you operate in my area?", a: "We currently serve Lagos, Abuja, Rivers, Bayelsa, and Delta states with active expansion underway. Contact us to confirm availability in your exact location." },
    { q: "What does the 25-year warranty cover?", a: "Panel performance output, inverter function, battery capacity, and all workmanship. If anything underperforms within the warranty period, we fix or replace it at zero cost to you." },
    { q: "Can solar power my AC, fridge, and heavy appliances?", a: "Absolutely. We conduct a thorough energy audit to size your system correctly. Many clients run multiple ACs, refrigerators, and full office equipment 24/7 on ProSolar systems." },
  ];
  return (
    <Section id="faq" bg="linear-gradient(180deg,#0c0800 0%,#070707 100%)">
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Label>FAQ</Label>
          <Heading>Questions You're Probably Thinking</Heading>
        </div>
      </Reveal>
      <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "4rem" }}>
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.06}>
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                background: open === i ? "rgba(255,184,0,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${open === i ? "rgba(255,184,0,0.25)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14, overflow: "hidden", transition: "all .3s", cursor: "pointer",
              }}>
              <div style={{ padding: "1.4rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".92rem", paddingRight: "1rem" }}>{f.q}</span>
                <span style={{ color: "#FFB800", fontSize: "1.4rem", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform .3s", lineHeight: 1 }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding: "0 1.5rem 1.5rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontSize: ".9rem" }}>{f.a}</p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div style={{ textAlign: "center" }}>
          <CTABtn label="Still Have Questions? Let's Talk" size="lg" />
        </div>
      </Reveal>
    </Section>
  );
}

// ── 11. FINAL CTA ─────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="quote" style={{ position: "relative", overflow: "hidden", padding: "clamp(80px,12vw,160px) clamp(1rem,5vw,3rem)", textAlign: "center" }}>
      <img src={IMAGES.farm} alt="Solar farm" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.15) saturate(0.8)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,184,0,0.12) 0%, rgba(7,7,7,0.9) 70%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,184,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,184,0,0.04) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)", borderRadius: 100, padding: "8px 18px", marginBottom: "2rem", fontSize: ".8rem", color: "#FFB800", letterSpacing: ".1em", fontWeight: 600 }}>
            🎉 FREE CONSULTATION · NO COMMITMENT REQUIRED
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(2.8rem,6vw,5rem)", color: "#fff", letterSpacing: "-.04em", lineHeight: .98, marginBottom: "1.5rem" }}>
            Ready to Own<br />
            <span style={{ background: "linear-gradient(120deg,#FFB800,#FF5F00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Your Power?
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(.95rem,1.5vw,1.15rem)", lineHeight: 1.75, marginBottom: "3rem", maxWidth: 560, margin: "0 auto 3rem" }}>
            Join 500+ Nigerians who escaped NEPA and generator life permanently. Get a free, custom solar quote within 24 hours — no sales pressure.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <CTABtn label="Get My Free Quote Now — 100% Free" size="lg" />
            <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,0.28)" }}>No spam. No pressure. Just honest solar advice from Nigeria's most trusted team.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#040404", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "3rem clamp(1rem,5vw,3rem)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF5F00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
              </div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: "1.05rem" }}>PROSOLAR ENERGY</span>
            </div>
            <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 280 }}>Nigeria's most trusted solar energy company. Powering homes and businesses with clean, reliable energy since 2014.</p>
          </div>
          {[
            { title: "Services", links: ["Solar Home Systems", "Commercial Solar", "Rural Electrification", "After-Sales Support"] },
            { title: "Company", links: ["About Us", "Projects", "Blog", "Careers"] },
            { title: "Contact", links: ["Get a Quote", "WhatsApp Us", "Email Us", "Visit Us"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".85rem", marginBottom: "1rem", letterSpacing: ".06em" }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#FFB800")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} ProSolar Energy Nigeria Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service"].map(l => (
              <a key={l} href="#" style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FFB800")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>{l}</a>
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