'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, X, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { useOnboarding } from "@/app/context/OnboardingContext";
import SplashScreen from "@/components/SplashScreen";
import HomeScreen from "@/components/HomeScreen";
import SignInScreen from "@/components/auth/SignInScreen";
import SignUpScreen from "@/components/auth/SignUpScreen";
import OnboardingShell from "@/components/auth/OnboardingShell";
import WelcomeLoadingScreen from "@/components/auth/WelcomeLoadingScreen";
import EmailVerificationScreen from "@/components/auth/EmailVerificationScreen";
import ForgotPasswordFlow from "@/components/auth/ForgotPasswordFlow";

// ─── Animated counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({
  target, prefix = "", suffix = "", decimals = 0,
}: { target: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2.2, ease: "power3.out",
          onUpdate: () => { if (el) el.textContent = prefix + obj.val.toFixed(decimals) + suffix; },
        });
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
};

// ─── PRIMARY slide-up-black button ───────────────────────────────────────────
const Btn = ({
  children, onClick, className = "", type = "button",
}: { children: React.ReactNode; onClick?: () => void; className?: string; type?: "button" | "submit" | "reset" }) => (
  <button
    type={type} onClick={onClick}
    className={`group relative overflow-hidden rounded-full border border-zinc-300 hover:border-[#09090b] bg-zinc-100 text-zinc-800 py-3 px-7 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 shrink-0 inline-flex items-center justify-center gap-2 cursor-pointer select-none shadow-sm ${className}`}
  >
    <span className="absolute inset-0 bg-[#09090b] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
    <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center gap-2">{children}</span>
  </button>
);

// ─── DARK variant ─────────────────────────────────────────────────────────────
const BtnDark = ({
  children, onClick, className = "",
}: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-full border border-white/20 hover:border-white bg-white/8 text-white py-3 px-7 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 shrink-0 inline-flex items-center justify-center gap-2 cursor-pointer select-none shadow-sm ${className}`}
  >
    <span className="absolute inset-0 bg-white translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
    <span className="relative z-10 group-hover:text-zinc-950 transition-colors duration-500 flex items-center gap-2">{children}</span>
  </button>
);

// ─── Link variant ─────────────────────────────────────────────────────────────
const BtnLink = ({
  children, href, className = "",
}: { children: React.ReactNode; href: string; className?: string }) => (
  <a
    href={href}
    className={`group relative overflow-hidden rounded-full border border-zinc-300 hover:border-[#09090b] bg-zinc-100 text-zinc-800 py-3 px-7 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 shrink-0 inline-flex items-center gap-2 cursor-pointer select-none shadow-sm ${className}`}
  >
    <span className="absolute inset-0 bg-[#09090b] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
    <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center gap-2">{children}</span>
  </a>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
  </svg>
);

// ─── Section label ────────────────────────────────────────────────────────────
const Label = ({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) => (
  <span className={`inline-flex items-center gap-2 text-[11px] font-medium tracking-wide ${muted ? "text-white/40" : "text-zinc-400"}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${muted ? "bg-white/40" : "bg-zinc-400"}`} />
    {children}
  </span>
);

// ─── Cookies banner ───────────────────────────────────────────────────────────
const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 1200); return () => clearTimeout(t); }, []);
  if (!visible) return null;
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-50 max-w-sm bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl px-5 py-4 shadow-xl flex items-center justify-between gap-4"
    >
      <p className="text-[11px] text-zinc-500 leading-relaxed">
        We use cookies to enhance your experience and analyze platform performance.{" "}
        <a href="#" className="text-zinc-800 underline underline-offset-2">Privacy Policy</a>
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => setVisible(false)}
          className="text-[10px] text-zinc-400 hover:text-zinc-700 font-medium uppercase tracking-widest transition-colors cursor-pointer">
          Decline
        </button>
        <Btn onClick={() => setVisible(false)} className="!py-2 !px-4 !text-[9px]">Accept</Btn>
      </div>
    </motion.div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const processSteps = [
  { num: "01", title: "Upload Your Image", desc: "Drop any photo — a portrait, landscape, product shot, or scanned document. We accept PNG, JPG, and WEBP up to 20MB. No account needed to preview; sign in to unlock full resolution exports." },
  { num: "02", title: "Choose Enhancement Mode", desc: "Select from Enhance, Upscale, Denoise, Restore, or Colorize. Dial in creativity and resemblance sliders to control how aggressively the AI transforms your image versus preserving the original." },
  { num: "03", title: "Download Your Result", desc: "Processing takes seconds on our GPU cluster. Preview a live before/after comparison, then export at full resolution with a single click — commercial license included on every output." },
];

const whyInvest = [
  { num: "01", title: "Advanced Prompt Control", body: "Add a descriptive text prompt to your upscale to guide our AI engine on exactly what fine details, textures, or features to intelligently invent." },
  { num: "02", title: "Multi-Model Engine", body: "Switch seamlessly between specialized rendering models optimized specifically for Portraits, Sci-Fi/Fantasy, Landscapes, Product Photography, or 3D assets." },
  { num: "03", title: "Creativity & Resemblance Sliders", body: "Take absolute control over the generation. Dial it down for a subtle, razor-sharp clean up, or turn it up to let the AI completely hallucinate stunning new high-def details." },
  { num: "04", title: "Lightning-Fast Rendering", body: "Skip the hours of manual rendering. Our optimized enterprise GPU clusters generate ultra-high-resolution, publication-ready visuals in mere seconds." },
];

const testimonials = [
  { quote: "Spectrum AI completely transformed my photography workflow. I can take a decent raw shot and turn it into something truly stunning in seconds. The detail recovery at 4× is unlike anything I've used — it's like having a professional retoucher available around the clock.", name: "James Thornton", role: "Photographer", loc: "Toronto, Canada" },
  { quote: "We use Spectrum AI for every client deliverable. The before/after quality difference speaks for itself. Our clients constantly ask how we achieve such sharp, clean results. It became our best-kept secret — and now our biggest competitive edge.", name: "Sofia Reinholt", role: "Creative Director", loc: "Apex Studio, Berlin" },
  { quote: "As an e-commerce brand, product image quality directly drives conversion. Since switching to Spectrum AI for our catalog photography, our add-to-cart rate improved by 23%. The engine understands texture and lighting in a way that genuinely feels intelligent.", name: "Ahmad Al-Rashid", role: "Head of Growth", loc: "Dubai, UAE" },
  { quote: "Turnaround time on photo editing dropped 60% after integrating Spectrum AI into our post-production pipeline. The batch processing and cinematic presets are exactly what a production house needs — consistent, repeatable, broadcast-quality output every time.", name: "Priya Nair", role: "Film Producer", loc: "Singapore" },
  { quote: "I've tested every AI upscaler available. Spectrum AI is the only one that preserves skin tones accurately and avoids haloes around hair. For portrait work, the resemblance slider gives me fine control that no other tool offers. It's simply the best.", name: "Daniel Kowalski", role: "Portrait Photographer", loc: "Warsaw, Poland" },
  { quote: "The restoration engine brought a 50-year-old family photo back to life with detail I didn't know existed in the original. My grandmother cried when she saw it. Spectrum AI isn't just a tool — it gives moments a second life.", name: "Aisha Mensah", role: "Graphic Designer", loc: "Accra, Ghana" },
  { quote: "We integrated Spectrum AI's API into our media platform serving 200k+ users. The throughput is exceptional. Output consistency across wildly different image types — from architectural shots to macro photography — is remarkable at this scale.", name: "Lucas Fernandez", role: "CTO", loc: "São Paulo, Brazil" },
  { quote: "The colorization feature is nothing short of magic. I work with archival content daily and Spectrum AI gives black-and-white footage a second life. The color accuracy is grounded — it doesn't over-saturate or guess wildly like every competitor I've tried.", name: "Yuki Tanaka", role: "Archivist & Editor", loc: "Tokyo, Japan" },
];

const team = [
  { name: "Marvin McKinney", role: "Co-Founder & CEO", img: "/pexels-didsss-2791056.jpg", bio: "15 years in computer vision and machine learning. Pioneer in generative AI scaling frameworks." },
  { name: "Lukas Weber", role: "Senior AI Infra Engineer", img: "/pexels-ganajp-15698413.jpg", bio: "Senior AI Infra Engineer. Specialist in custom diffusion architectures and high-throughput GPU orchestration." },
  { name: "Eleanor Pena", role: "Legal & Compliance", img: "/pexels-olga-178200755-12367292.jpg", bio: "AI Copyright & Compliance Counsel. Expert in ethical datasets, data privacy, and commercial IP licensing." },
  { name: "Dr. Alok Verma", role: "Lead AI Researcher", img: "/pexels-prathsnap-3168209.jpg", bio: "Lead AI Researcher. Designing proprietary generative model weights for ultra-high-resolution texture synthesis." },
  { name: "Guy Hawkins", role: "Full-Stack AI UI Engineer", img: "/pexels-didsss-2791056.jpg", bio: "Full-Stack AI UI Engineer. Specialist in high-performance canvas interfaces and node-based visual workflows." },
  { name: "Bessie Cooper", role: "Head of Creator Relations", img: "/pexels-ganajp-15698413.jpg", bio: "Head of Creator Relations. Managing global studio partnerships and enterprise platform adoption." },
];

const ticker = Array(4).fill([
  "⚡ 8× Max Upscale", "Proprietary Diffusion Engine v2.1", "Real-Time Texture Recovery",
  "Commercial Licensing Included", "Advanced Prompt Guidance", "4K & 8K Resolution", "Zero Artifacts",
]).flat();

// ─── Ghost Mouse Demo Section ─────────────────────────────────────────────────
function GhostMouseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cursor = cursorRef.current;
    const container = containerRef.current;
    if (!cursor || !container) return;

    // Steps: upload zone → mode select → enhance button → result
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.75, paused: true });
    tl.timeScale(2);
    tlRef.current = tl;

    // Move to upload zone
    tl.to(cursor, { x: 160, y: 130, duration: 1.2, ease: "power2.inOut" })
      .to(cursor, { scale: 0.8, duration: 0.12 }, "-=0.05")
      .to(cursor, { scale: 1, duration: 0.12 })
      // "click" — ripple on upload zone
      .to("#ghost-upload", { scale: 0.97, duration: 0.1 }, "-=0.05")
      .to("#ghost-upload", { scale: 1, duration: 0.15 })
      .to("#ghost-label", { opacity: 1, y: 0, duration: 0.4 })
      .to(cursor, { x: 310, y: 80, duration: 1.0, ease: "power2.inOut" }, "+=0.3")
      // hover mode button
      .to("#ghost-mode-2", { backgroundColor: "#09090b", color: "#fff", duration: 0.25 })
      .to(cursor, { scale: 0.8, duration: 0.12 }, "-=0.05")
      .to(cursor, { scale: 1, duration: 0.12 })
      .to("#ghost-mode-2", { backgroundColor: "#18181b", duration: 0.2 })
      // move to creativity slider
      .to(cursor, { x: 258, y: 200, duration: 0.9, ease: "power2.inOut" }, "+=0.2")
      .to("#ghost-slider-thumb", { x: 28, duration: 0.7, ease: "power2.inOut" })
      // move to enhance button
      .to(cursor, { x: 160, y: 280, duration: 1.0, ease: "power2.inOut" }, "+=0.2")
      .to(cursor, { scale: 0.8, duration: 0.1 })
      .to(cursor, { scale: 1, duration: 0.1 })
      .to("#ghost-btn", { scale: 0.95, duration: 0.1 })
      .to("#ghost-btn", { scale: 1, duration: 0.15 })
      // show result
      .to("#ghost-result", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "+=0.1")
      // reset
      .to(["#ghost-label", "#ghost-result"], { opacity: 0, y: 8, duration: 0.35 }, "+=2.0")
      .to("#ghost-slider-thumb", { x: 0, duration: 0.4 })
      .to(cursor, { x: 0, y: 0, duration: 0.6, ease: "power2.inOut" });

    ScrollTrigger.create({
      trigger: container,
      start: "top 70%",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.pause(),
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="h-screen bg-white flex flex-col justify-center px-6 md:px-10 py-10">
      <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-6">
        <div className="reveal">
          <Label>See it in action</Label>
          <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] text-[#09090b] mt-3 max-w-lg">
            From upload to enhanced result — in three simple steps.
          </h2>
        </div>

        <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row gap-8 items-stretch min-h-0 reveal">
          {/* Left — mock Spectrum UI with ghost cursor */}
          <div className="flex-1 relative bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Cursor SVG */}
            <div ref={cursorRef} className="absolute top-6 left-6 z-30 pointer-events-none" style={{ transform: "translate(0,0)" }}>
              <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                <path d="M2 2L20 14L12 16L8 26L2 2Z" fill="white" stroke="#09090b" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            </div>

            {/* Fake Spectrum UI */}
            <div className="absolute inset-0 flex flex-col">
              {/* Nav */}
              <div className="h-9 bg-[#0a0a0a] border-b border-white/5 flex items-center px-5 gap-3 shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/50"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" /></svg>
                <span className="text-[8px] text-white/25 font-medium tracking-wider">Spectrum AI</span>
                <div className="flex gap-1 ml-2">
                  {["Enhance","Upscale","Restore"].map((m,mi) => (
                    <span key={m} id={mi===1 ? "ghost-mode-2" : ""} className={`text-[7px] px-2 py-0.5 rounded font-semibold transition-all duration-200 ${mi===0 ? "bg-white/10 text-white/70" : "text-white/25"}`}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Main canvas */}
              <div className="flex-1 flex">
                {/* Canvas area */}
                <div className="flex-1 relative flex items-center justify-center p-6">
                  <div id="ghost-upload" className="w-full h-full max-h-[200px] border-2 border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer hover:border-white/30">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                    </div>
                    <span className="text-[9px] text-white/25 font-medium">Drop image here or click to upload</span>
                    <span id="ghost-label" className="text-[8px] text-emerald-400 font-semibold opacity-0 translate-y-2">portrait_raw.jpg selected ✓</span>
                  </div>

                  {/* Result overlay */}
                  <div id="ghost-result" className="absolute inset-6 rounded-2xl overflow-hidden opacity-0 translate-y-2 pointer-events-none">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/15498647_trimmed_4s.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[7px] text-white/60 font-mono">4× Enhanced</span>
                      <span className="text-[7px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Done ✓</span>
                    </div>
                  </div>
                </div>

                {/* Right control panel */}
                <div className="w-[130px] border-l border-white/5 bg-[#0a0a0a] p-3 flex flex-col gap-4 shrink-0">
                  <div>
                    <p className="text-[7px] text-white/25 font-bold uppercase tracking-wider mb-2">Scale</p>
                    <div className="flex gap-1">
                      {["2×","4×","8×"].map((s,si) => (
                        <span key={s} className={`text-[7px] px-1.5 py-0.5 rounded font-bold ${si===1 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-white/20"}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-[7px] text-white/25 font-bold uppercase tracking-wider">Creativity</p>
                      <span className="text-[7px] text-blue-400 font-bold">7</span>
                    </div>
                    <div className="relative h-1 bg-white/10 rounded-full">
                      <div className="absolute left-0 h-full bg-blue-500 rounded-full" style={{ width: "58%" }} />
                      <div id="ghost-slider-thumb" className="absolute -top-1.5 w-3 h-3 bg-white rounded-full shadow-sm border border-zinc-200" style={{ left: "calc(58% - 6px)" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[7px] text-white/25 font-bold uppercase tracking-wider mb-1">Style</p>
                    <span className="text-[7px] text-white/50 font-semibold">Photo</span>
                  </div>
                  <button id="ghost-btn" className="mt-auto w-full bg-blue-500 rounded-lg py-1.5 text-[7px] font-bold text-white text-center transition-transform cursor-default">
                    Enhance
                  </button>
                </div>
              </div>

              {/* Status bar */}
              <div className="h-6 bg-[#0a0a0a] border-t border-white/5 flex items-center px-4 gap-3 shrink-0">
                <span className="text-[6.5px] text-white/20 font-mono">Spectrum Engine v2.1 · Active</span>
                <div className="flex-1" />
                <span className="text-[6.5px] text-yellow-400 font-semibold">⚡ 250 credits</span>
              </div>
            </div>
          </div>

          {/* Right — step annotations */}
          <div className="lg:w-[280px] flex flex-col justify-center gap-8 shrink-0">
            {[
              { num: "01", title: "Upload Your Image", desc: "Drop any photo. PNG, JPG, or WEBP up to 20MB — our engine accepts everything." },
              { num: "02", title: "Configure Settings", desc: "Choose scale, style, and creativity level. The AI adapts to your exact intent." },
              { num: "03", title: "One Click to Enhance", desc: "Processing takes seconds. Export at full resolution with a commercial license included." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start stagger-item">
                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-zinc-500">{step.num}</span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-zinc-900 tracking-[-0.02em]">{step.title}</p>
                  <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Video Split Slider ────────────────────────────────────────────────────────
function VideoSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawRef    = useRef<HTMLVideoElement>(null);
  const enhRef    = useRef<HTMLVideoElement>(null);
  const [pos, setPos] = useState(50);
  const dragging  = useRef(false);

  // Keep both videos frame-locked
  useEffect(() => {
    const id = setInterval(() => {
      const raw = rawRef.current, enh = enhRef.current;
      if (!raw || !enh) return;
      if (Math.abs(raw.currentTime - enh.currentTime) > 0.15)
        enh.currentTime = raw.currentTime;
    }, 250);
    return () => clearInterval(id);
  }, []);

  const calcPos = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) setPos(calcPos(e.clientX)); };
    const onUp   = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden cursor-ew-resize"
      onMouseDown={e => { dragging.current = true; setPos(calcPos(e.clientX)); }}>

      {/* Bottom layer — enhanced / sharp */}
      <video ref={enhRef} autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover">
        <source src="/15498647_trimmed_4s.mp4" type="video/mp4" />
      </video>

      {/* Top layer — raw / blurry, clipped to left portion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <video ref={rawRef} autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(2.5px) saturate(0.25) brightness(0.75)" }}>
          <source src="/15498647_trimmed_4s.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Divider line + draggable handle */}
      <div className="absolute inset-y-0 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/70" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-xl flex items-center justify-center text-[9px] text-zinc-700 font-bold pointer-events-auto cursor-ew-resize"
          onMouseDown={e => { e.stopPropagation(); dragging.current = true; }}>⟺</div>
      </div>

      <span className="absolute top-2 left-2 text-[6px] font-bold text-white/50 bg-black/50 px-1.5 py-0.5 rounded-full pointer-events-none">Before</span>
      <span className="absolute top-2 right-2 text-[6px] font-bold text-white/50 bg-black/50 px-1.5 py-0.5 rounded-full pointer-events-none">After</span>
    </div>
  );
}

// ─── Interactive Advantage Cards ───────────────────────────────────────────────
function AdvantageCards() {
  const [active, setActive] = useState<number | null>(null);
  const [typed,  setTyped]  = useState("");
  const [slider, setSlider] = useState(8);
  const [prog,   setProg]   = useState(0);
  const [model,  setModel]  = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const MODELS = ["Portrait", "Landscape", "Sci-Fi", "Product"];
  const PROMPT = "portrait, golden hour, sharp eyes, 8K skin texture...";

  const clear = () => { if (timer.current) clearInterval(timer.current); };

  const start = (i: number) => {
    clear();
    setActive(i); setTyped(""); setSlider(8); setProg(0); setModel(0);
    if (i === 0) {
      let idx = 0;
      timer.current = setInterval(() => { idx++; setTyped(PROMPT.slice(0, idx)); if (idx >= PROMPT.length) clear(); }, 55);
    } else if (i === 1) {
      let m = 0;
      timer.current = setInterval(() => { m = (m + 1) % 4; setModel(m); }, 700);
    } else if (i === 2) {
      let v = 8;
      timer.current = setInterval(() => { v = Math.min(90, v + 1.5); setSlider(v); if (v >= 90) clear(); }, 20);
    } else {
      let p = 0;
      timer.current = setInterval(() => { p = Math.min(100, p + 1.5); setProg(p); if (p >= 100) clear(); }, 16);
    }
  };

  const stop = () => { clear(); setActive(null); setTyped(""); setSlider(8); setProg(0); setModel(0); };
  useEffect(() => () => clear(), []);

  const overlays = [
    /* 0 — Prompt Control: ghost typing */
    <div key={0} className="absolute inset-0 p-6 flex flex-col gap-3 pointer-events-none">
      <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Prompt</p>
      <div className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900/80 p-3.5 overflow-hidden">
        <p className="text-[11px] text-white/75 font-mono leading-relaxed">
          {typed}<span className="animate-pulse text-white/90">▍</span>
        </p>
      </div>
    </div>,

    /* 1 — Multi-Model: clean cycling pills */
    <div key={1} className="absolute inset-0 p-6 flex flex-col gap-3 pointer-events-none">
      <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Select Model</p>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {MODELS.map((m, mi) => (
          <div key={m} className="rounded-lg flex items-center justify-center text-[11px] font-semibold border transition-all duration-300"
            style={{
              background: mi === model ? "rgba(255,255,255,0.07)" : "transparent",
              borderColor: mi === model ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.06)",
              color: mi === model ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)",
            }}>
            {m}
          </div>
        ))}
      </div>
    </div>,

    /* 2 — Sliders: two clean labeled sliders */
    <div key={2} className="absolute inset-0 p-6 flex flex-col gap-3 pointer-events-none">
      <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Control</p>
      <div className="flex flex-col gap-5 flex-1 justify-center">
        {[["Creativity", slider], ["Resemblance", 100 - slider * 0.45]].map(([lbl, val]) => (
          <div key={String(lbl)}>
            <div className="flex justify-between mb-2">
              <span className="text-[11px] text-white/55 font-medium">{lbl}</span>
              <span className="text-[11px] text-white/70 font-mono tabular-nums">{Math.round(Number(val))}</span>
            </div>
            <div className="relative h-[2px] bg-zinc-700 rounded-full">
              <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${Number(val)}%` }} />
              <div className="absolute top-1/2 w-3 h-3 bg-white rounded-full border-2 border-zinc-900 shadow-md"
                style={{ left: `${Number(val)}%`, transform: "translate(-50%, -50%)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>,

    /* 3 — Lightning Fast: single progress bar + stage chips */
    <div key={3} className="absolute inset-0 p-6 flex flex-col gap-3 pointer-events-none">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Processing</p>
        <span className="text-[10px] font-mono text-white/55 tabular-nums">{(prog / 100 * 0.8).toFixed(2)}s</span>
      </div>
      <div className="h-[2px] bg-zinc-700 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full transition-none" style={{ width: `${prog}%` }} />
      </div>
      <div className="flex gap-2 flex-wrap mt-1">
        {["Loading", "Diffusing", "Upscaling", "Output"].map((s, si) => (
          <span key={s} className="text-[9px] font-medium px-2 py-0.5 rounded-full border transition-all duration-300"
            style={{
              background: prog >= si * 25 + 25 ? "rgba(255,255,255,0.07)" : "transparent",
              borderColor: prog >= si * 25 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
              color: prog >= si * 25 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.2)",
            }}>
            {s}{prog >= si * 25 + 25 ? " ✓" : ""}
          </span>
        ))}
      </div>
      {prog >= 100 && <p className="text-[11px] text-white/60 font-medium mt-auto">Done in 0.8s</p>}
    </div>,
  ];

  return (
    <div className="h-full grid grid-cols-2 grid-rows-2 border-l border-white/10">
      {whyInvest.map((w, i) => (
        <div key={i}
          onMouseEnter={() => start(i)}
          onMouseLeave={stop}
          className={`stagger-item group relative overflow-hidden flex flex-col justify-between p-7 border-white/10 cursor-pointer
            ${i % 2 === 1 ? "border-l" : ""} ${i < 2 ? "border-b" : ""}`}>
          {/* Swipe-up background */}
          <span className="absolute inset-0 bg-zinc-900 translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
          {/* Static text — fades out when animation is active */}
          <div className={`relative z-10 transition-opacity duration-200 ${active === i ? "opacity-0" : "opacity-100"}`}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-4">{w.num} — Advantages</p>
            <h4 className="text-xl md:text-2xl font-bold text-white tracking-[-0.03em] mb-2">{w.title}</h4>
            <p className="text-[12px] text-zinc-500 leading-relaxed">{w.body}</p>
          </div>
          {/* Animation overlay — z-20, fades in over the text */}
          <div className={`absolute inset-0 z-20 transition-opacity duration-200 ${active === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {overlays[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onSignIn, onGoHome }: { onSignIn: () => void; onGoHome?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [openStep, setOpenStep] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const [route, setRoute] = useState("enhance");
  const [size, setSize] = useState("2x");
  const [length, setLength] = useState("photo");
  const [tickets, setTickets] = useState(5);
  const [calculating, setCalculating] = useState(false);

  let mult = 1000, apy = 21.45;
  if (route === "denoise") { mult *= 1.25; apy += 2.1; }
  else if (route === "colorize") { mult *= 1.45; apy += 3.5; }
  if (size === "4x") { mult *= 1.8; apy += 1.5; }
  if (length === "standard") apy -= 1.8;
  else if (length === "cinematic") { mult *= 1.15; apy += 2.2; }
  const yieldResult = Math.floor(tickets * mult * (1 + apy / 100));

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault(); setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setEmail(""); }, 4000);
  };

  const scrollTestimonial = (dir: number) => {
    const next = Math.max(0, Math.min(testimonials.length - 1, testimonialIdx + dir));
    setTestimonialIdx(next);
    const el = testimonialsRef.current?.children[next] as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    let raf: number;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    gsap.registerPlugin(ScrollTrigger);

    // Scale + fade reveal
    document.querySelectorAll(".reveal").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, scale: 1.12 },
        {
          opacity: 1, scale: 1.0, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        }
      );
    });

    // Staggered children
    document.querySelectorAll(".stagger-grid").forEach(container => {
      const items = container.querySelectorAll(".stagger-item");
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, scale: 1.08 },
          {
            opacity: 1, scale: 1.0, duration: 0.75, stagger: 0.1, ease: "power2.out",
            scrollTrigger: { trigger: container, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      }
    });

    // Hero words — keep y-based for text feel
    const words = document.querySelectorAll(".hero-word");
    if (words.length) gsap.fromTo(words, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.25 });

    // Marquee
    const track = document.querySelector(".marquee-inner");
    if (track) gsap.to(track, { x: "-50%", duration: 30, ease: "none", repeat: -1 });

    // Floating Y-drift on cards/mockups
    document.querySelectorAll(".float-drift").forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -10 : 10,
        duration: 3 + i * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    // Parallax on background videos/images
    document.querySelectorAll(".parallax-bg").forEach(el => {
      gsap.to(el, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Section heading slide-up reveals
    document.querySelectorAll(".reveal-text").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" } }
      );
    });

    // Counter chips animate in
    document.querySelectorAll(".chip-reveal").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: i * 0.12,
          scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" } }
      );
    });

    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <div className="font-sans antialiased text-[#18181b] bg-[#ebebeb] overflow-x-hidden selection:bg-zinc-900 selection:text-white">

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${scrolled ? "bg-white/95 backdrop-blur-md py-3.5 border-b border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "bg-transparent py-5"}`}>
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <Logo className={`w-5 h-5 transition-colors duration-300 ${scrolled ? "text-zinc-900" : "text-white"}`} />
            <span className={`font-semibold text-[14px] tracking-[-0.02em] transition-colors duration-300 ${scrolled ? "text-zinc-900" : "text-white"}`}>Spectrum AI</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[["Business", "#who-we-are"], ["How it works", "#how-it-works"], ["Gallery", "#vessel-1"], ["Team", "#team"]].map(([l, h]) => (
              <a key={h} href={h} className={`text-[13px] font-medium transition-colors duration-300 ${scrolled ? "text-zinc-500 hover:text-zinc-900" : "text-white/70 hover:text-white"}`}>{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {onGoHome && (
              <BtnDark onClick={onGoHome} className="!py-2.5 !px-5 !text-[11px]">
                Home
              </BtnDark>
            )}
            <Btn onClick={onSignIn} className={`!py-2.5 !px-5 !text-[11px] ${!scrolled ? "!bg-white !border-white !text-zinc-900 hover:!border-[#09090b]" : ""}`}>
              Sign In <ArrowRight className="w-3 h-3" />
            </Btn>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-screen bg-zinc-950 text-white flex items-center overflow-hidden" style={{ height: "100dvh" }}>
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={heroVideoRef}
            autoPlay loop muted playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/13167255_trimmed_4s.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-16">
          {/* Left */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-white/55 font-medium tracking-wide">AI Visual Enhancement Platform</span>
            </div>

            <div className="overflow-hidden">
              <h1 className="text-5xl md:text-[3.75rem] xl:text-[4.25rem] font-bold tracking-[-0.04em] leading-[1.0]">
                {["Transforming", "Visuals", "With", "Intelligence"].map(w => (
                  <span key={w} className="hero-word inline-block mr-3 opacity-0">{w}</span>
                ))}
              </h1>
            </div>

            <p className="text-white/55 text-[14px] leading-relaxed max-w-[400px]">
              Spectrum AI enhances, upscales, and restores images with unprecedented quality — giving every creator access to professional-grade visual AI.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Btn onClick={onSignIn}>Get Started <ArrowRight className="w-3 h-3" /></Btn>
              <button onClick={() => setVideoOpen(true)}
                className="flex items-center gap-2.5 text-white/65 hover:text-white transition-colors text-[12px] font-medium group">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                </span>
                Watch overview
              </button>
            </div>

            <div className="grid grid-cols-3 gap-5 pt-3 border-t border-white/10 mt-1">
              {[{ v: 4.2, s: "M+", l: "Images enhanced" }, { v: 99, s: "%", l: "Quality score" }, { v: 8, s: "×", l: "Max upscale" }].map(s => (
                <div key={s.l}>
                  <p className="text-2xl font-bold tracking-[-0.04em] text-white">
                    <AnimatedCounter target={s.v} suffix={s.s} decimals={s.v % 1 !== 0 ? 1 : 0} />
                  </p>
                  <p className="text-[10px] text-white/35 uppercase tracking-widest mt-1 font-medium">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Calculator / CTA card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="float-drift w-full max-w-[360px] rounded-2xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-white/50 font-semibold tracking-widest uppercase">Live · Enhancement Engine v2.1</span>
                </div>
                <span className="text-[9px] text-blue-400 font-semibold">Active</span>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-white tracking-[-0.02em] leading-snug">Try Spectrum AI Enhancement</h3>
                <p className="text-[10px] text-white/35 mt-0.5 font-medium">Select your enhancement parameters</p>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[8.5px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Enhancement Mode</label>
                  <div className="relative">
                    <select value={route} onChange={e => setRoute(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[11px] text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer">
                      <option className="bg-zinc-900" value="enhance">Enhance — AI Upscale</option>
                      <option className="bg-zinc-900" value="denoise">Denoise — Clean & Restore</option>
                      <option className="bg-zinc-900" value="colorize">Colorize — Add Color</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[{ label: "Scale", val: size, set: setSize, opts: [["2x", "2× Upscale"], ["4x", "4× Upscale"]] },
                    { label: "Style", val: length, set: setLength, opts: [["standard", "Standard"], ["photo", "Photo"], ["cinematic", "Cinematic"]] }
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-[8.5px] font-bold uppercase tracking-widest text-white/35 mb-1.5">{f.label}</label>
                      <div className="relative">
                        <select value={f.val} onChange={e => f.set(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer">
                          {f.opts.map(([v, l]) => <option key={v} className="bg-zinc-900" value={v}>{l}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[8.5px] font-bold uppercase tracking-widest text-white/35">Creativity</label>
                    <span className="text-[11px] font-bold text-blue-400">{tickets}</span>
                  </div>
                  <input type="range" min="1" max="12" value={tickets} onChange={e => setTickets(+e.target.value)}
                    className="w-full h-[2px] bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                </div>
              </div>

              <div className="border-t border-white/10 pt-3.5 flex items-end justify-between">
                <div>
                  <p className="text-[8.5px] uppercase tracking-widest text-white/35 font-bold mb-1">Credits needed</p>
                  <p className="text-xl font-bold text-white tracking-[-0.03em]">3 credits</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                  250 free
                </span>
              </div>

              <Btn onClick={onSignIn} className="w-full !rounded-xl !py-3 !text-[10px]">
                Start Enhancing
              </Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies */}
      <AnimatePresence><CookiesBanner /></AnimatePresence>

      {/* ── STATS MARQUEE ────────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-y border-zinc-800 py-3.5 overflow-hidden">
        <div className="marquee-inner flex whitespace-nowrap will-change-transform">
          {ticker.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-5 text-[11px] font-medium text-zinc-400 tracking-wide">
              {item}
              <span className="text-zinc-700">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── WHO WE ARE ───────────────────────────────────────────────── */}
      <section id="who-we-are" className="h-screen bg-[#ebebeb] flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-5">
          <Label>Who we are</Label>
          <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm p-8 md:p-12 flex flex-col justify-center overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center h-full">
              {/* Video */}
              <div className="relative aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden group cursor-pointer reveal"
                onClick={() => setVideoOpen(true)}>
                <Image src="/pexels-didsss-2791056.jpg" alt="Showreel" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full self-start border border-white/15">Platform Showreel</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60 font-medium">Spectrum AI Showreel</span>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-4 h-4 fill-zinc-900 translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-5 reveal">
                <h2 className="reveal-text text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.1] text-[#09090b]">
                  Most creators experience the same gap — between the vision and the quality.
                </h2>
                <div className="flex flex-col gap-3 text-zinc-500 text-[13px] leading-relaxed">
                  <p>Spectrum AI transforms any image with state-of-the-art enhancement models — upscaling, denoising, and restoring visuals to professional quality in seconds.</p>
                  <p>We close the gap between raw captures and publication-ready results — through AI precision, intuitive controls, and lightning-fast processing.</p>
                </div>
                <Btn onClick={onSignIn}>About us</Btn>

                <div className="grid grid-cols-3 gap-5 pt-5 border-t border-zinc-100 mt-1">
                  {[{ t: 4.2, p: "", s: "M+", d: 1, l: "Images processed" }, { t: 99, p: "", s: "%", d: 0, l: "Quality score" }, { t: 48000, p: "", s: "+", d: 0, l: "Active users" }].map(s => (
                    <div key={s.l}>
                      <p className="text-xl font-bold tracking-[-0.03em] text-zinc-900">
                        <AnimatedCounter target={s.t} prefix={s.p} suffix={s.s} decimals={s.d} />
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="h-screen bg-[#0a0a0a] text-white flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-6">

          <div className="reveal">
            <Label muted>How it works</Label>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.07] mt-4">
              Spectrum AI simplifying{" "}
              <span className="text-blue-400">visual enhancement for everyone</span>
            </h2>
          </div>

          {/* Two-column: steps LEFT, video RIGHT */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-0">

            {/* LEFT — Steps accordion, slide-up ONLY on inner text div */}
            <div className="flex flex-col border-t border-white/10 justify-center">
              {processSteps.map((step, i) => (
                <div key={i}
                  className="border-b border-white/10 cursor-pointer select-none"
                  onClick={() => setOpenStep(i)}
                  onMouseEnter={() => setOpenStep(i)}>

                  <div className="flex items-center justify-between py-5">
                    {/* Slide-up ONLY on this left inner div */}
                    <div className="group relative overflow-hidden flex items-center gap-5 flex-1 rounded-lg px-2 py-1">
                      <span className={`absolute inset-0 rounded-lg transition-transform duration-500 ease-out origin-bottom z-0
                        ${openStep === i ? "bg-zinc-800 translate-y-0" : "bg-zinc-800 translate-y-[102%] group-hover:translate-y-0"}`} />
                      <span className={`relative z-10 text-[10px] font-bold tabular-nums tracking-widest transition-colors duration-300 w-7 shrink-0 ${openStep === i ? "text-blue-400" : "text-white/25 group-hover:text-white/50"}`}>
                        {step.num}
                      </span>
                      <span className={`relative z-10 text-[17px] md:text-[19px] font-semibold tracking-[-0.02em] transition-colors duration-300 ${openStep === i ? "text-white" : "text-white/55 group-hover:text-white/85"}`}>
                        {step.title}
                      </span>
                    </div>
                    {/* Plus/minus — outside the group, no slide-up */}
                    <div className={`shrink-0 ml-4 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 text-[18px] leading-none ${openStep === i ? "border-blue-400 text-blue-400" : "border-white/15 text-white/25"}`}>
                      {openStep === i ? "−" : "+"}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {openStep === i && (
                      <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden">
                        <p className="text-[13px] text-white/50 leading-relaxed pb-5 px-2 pt-1 max-w-md">{step.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* RIGHT — media panel, different per step */}
            <div className="relative rounded-2xl overflow-hidden reveal min-h-[240px]">
              <AnimatePresence mode="wait">
                <motion.div key={openStep}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {openStep === 0 ? (
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/8312047_trimmed_4s.mp4" type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={openStep === 1 ? "/pexels-ganajp-15698413.jpg" : "/pexels-zmaysq-1725935641-38189217.jpg"}
                      alt={`Step ${openStep + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-2">
                    {processSteps.map((_, j) => (
                      <div key={j} className={`rounded-full transition-all duration-300 ${j === openStep ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`} />
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest text-white/50 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    Step {openStep + 1} of 3
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── VESSEL 1 ─────────────────────────────────────────────────── */}
      <section id="vessel-1" className="h-screen bg-[#ebebeb] flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-5">
          <div className="flex items-start justify-between reveal">
            <Label>Featured models</Label>
            <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] leading-[1.05] text-right max-w-md text-[#09090b]">
              Bridging raw captures with publication-ready quality.
            </h2>
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden reveal">
            <div className="h-full grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-between p-8 md:p-12 lg:p-14">
                <div className="flex flex-col gap-5">
                  <Label>Spectrum Enhance</Label>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-[#09090b]">AI Enhancement Engine</h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed max-w-sm">
                    Our core AI engine reconstructs fine detail, recovers lost texture, and intelligently sharpens edges — powered by proprietary diffusion models trained on millions of professional images.
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-6 py-6 border-y border-zinc-100">
                    {[{ v: "8×", l: "Max upscale" }, { v: "v2.1", l: "Engine version" }, { v: "99%", l: "Quality score" }].map(s => (
                      <div key={s.l}>
                        <p className="text-xl md:text-2xl font-bold text-zinc-900 tracking-[-0.03em]">{s.v}</p>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-5">
                    <a href="#" className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-800 hover:text-zinc-950 group">
                      Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
              {/* Right — Product UI mockup */}
              <div className="relative h-full min-h-[280px] lg:min-h-0 bg-zinc-950 flex items-center justify-center p-5">
                <div className="float-drift w-full h-full rounded-xl overflow-hidden border border-white/8 shadow-2xl flex flex-col bg-[#0c0c0c]">
                  <div className="h-8 border-b border-white/5 flex items-center px-3 gap-2 shrink-0 bg-[#0a0a0a]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/50"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" /></svg>
                    <span className="text-[7.5px] text-white/25 font-medium">Spectrum AI — Enhance</span>
                    <div className="flex gap-0.5 ml-1">
                      {["Enhance","Upscale","Denoise"].map((t,ti) => (
                        <span key={t} className={`text-[6.5px] px-1.5 py-0.5 rounded font-semibold ${ti===0 ? "bg-white text-zinc-900" : "text-white/20"}`}>{t}</span>
                      ))}
                    </div>
                    <div className="flex-1" />
                    <span className="text-[7px] text-yellow-400 font-semibold">⚡ 250</span>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <VideoSlider />
                  </div>
                  <div className="h-6 border-t border-white/5 flex items-center px-3 gap-3 shrink-0 bg-[#0a0a0a]">
                    <span className="text-[6.5px] text-white/20 font-mono">4× · Photo · Creativity 7</span>
                    <div className="flex-1" />
                    <span className="text-[6.5px] text-emerald-400 font-bold">Enhanced ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VESSEL 2 ─────────────────────────────────────────────────── */}
      <section id="vessel-2" className="h-screen bg-[#ebebeb] flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-5">
          <div className="flex items-start justify-between reveal">
            <Label>Featured models</Label>
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden reveal">
            <div className="h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Left — Restore UI mockup */}
              <div className="relative h-full min-h-[280px] lg:min-h-0 order-last lg:order-first bg-zinc-950 flex items-center justify-center p-5">
                <div className="w-full h-full rounded-xl overflow-hidden border border-white/8 shadow-2xl flex flex-col bg-[#0c0c0c]">
                  <div className="h-8 border-b border-white/5 flex items-center px-3 gap-2 shrink-0 bg-[#0a0a0a]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/50"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" /></svg>
                    <span className="text-[7.5px] text-white/25 font-medium">Spectrum AI — Video Gen</span>
                    <div className="flex gap-0.5 ml-1">
                      {["Text-to-Video","Img-to-Video","AI Interpolate"].map((t,ti) => (
                        <span key={t} className={`text-[6.5px] px-1.5 py-0.5 rounded font-semibold ${ti===0 ? "bg-white text-zinc-900" : "text-white/20"}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/18120715_trimmed_4s.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[7px] text-white/50 font-mono">Motion Synthesis</span>
                          <span className="text-[7px] text-white/70 font-bold">7 / 10</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full"><div className="h-full w-[70%] bg-violet-400 rounded-full" /></div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[7px] text-white/50 font-mono">Temporal Consistency</span>
                          <span className="text-[7px] text-emerald-400 font-bold">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-6 border-t border-white/5 flex items-center px-3 shrink-0 bg-[#0a0a0a]">
                    <span className="text-[6.5px] text-white/20 font-mono">Generation complete · 4K cinematic</span>
                    <div className="flex-1" />
                    <span className="text-[6.5px] text-emerald-400 font-bold">Generated ✓</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between p-8 md:p-12 lg:p-14">
                <div className="flex flex-col gap-5">
                  <Label>Spectrum Video Gen</Label>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-[#09090b]">Video Generation Engine</h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed max-w-sm">
                    Create cinematic, high-fidelity videos entirely from text prompts. Our advanced diffusion models generate fluid motion, photorealistic lighting, and stunning visual effects in seconds.
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-6 py-6 border-y border-zinc-100">
                    {[{ v: "4K", l: "Cinematic" }, { v: "60", l: "FPS Generation" }, { v: "100%", l: "Prompt Matching" }].map(s => (
                      <div key={s.l}>
                        <p className="text-xl md:text-2xl font-bold text-zinc-900 tracking-[-0.03em]">{s.v}</p>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-5">
                    <a href="#" className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-800 hover:text-zinc-950 group">
                      Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY INVEST ───────────────────────────────────────────────── */}
      <section className="h-screen bg-[#0a0a0a] text-white flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-3">
          <Label muted>Why Spectrum AI</Label>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">

            <div className="lg:col-span-5 h-full reveal">
              <div className="h-full flex flex-col p-8 md:p-10 bg-zinc-900 border border-white/5 gap-5"
                style={{ borderRadius: "4rem 0 4rem 0" }}>
                <div className="flex items-center justify-between shrink-0">
                  <div className="text-blue-500"><Logo className="w-7 h-7" /></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500">Platform Advantages</span>
                </div>
                {/* Video in the middle */}
                <div className="flex-1 relative rounded-2xl overflow-hidden min-h-0">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/16034575_trimmed_4s.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {["8× Upscale", "Real-time", "Batch API", "Commercial License"].map(tag => (
                        <span key={tag} className="text-[8px] font-semibold text-white/70 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-[1.1] text-white">
                    Why Choose<br />Spectrum AI?
                  </h3>
                  <p className="text-zinc-500 text-[12px] leading-relaxed">
                    Next-generation diffusion models, giving every creator access to professional-grade visual enhancement — instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 h-full reveal stagger-grid">
              <AdvantageCards />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE BENTO ─────────────────────────────────────────── */}
      <section className="h-screen bg-white flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-5">
          <div className="flex items-end justify-between reveal">
            <div>
              <Label>Platform guarantees</Label>
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] text-[#09090b] mt-3 max-w-md">
                Safety and privacy is our top priority. We protect every image.
              </h2>
            </div>
            <Btn onClick={onSignIn}>Get Started <ArrowRight className="w-3 h-3" /></Btn>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 stagger-grid">
            <div className="md:col-span-5 stagger-item relative rounded-[2rem] overflow-hidden group">
              <Image src="/pexels-olga-178200755-12367292.jpg" alt="Privacy" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-blue-400 font-bold text-base">*</span>
                  <span className="text-[13px] font-semibold">Data Privacy</span>
                </div>
                <p className="text-[12px] text-zinc-300 leading-relaxed max-w-xs">All uploaded images are processed locally and never stored — your visual assets remain 100% private.</p>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 gap-4">
              <div className="col-span-2 stagger-item relative rounded-[2rem] overflow-hidden group min-h-[140px]">
                <Image src="/pexels-prathsnap-3168209.jpg" alt="Security" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-blue-400 font-bold">*</span>
                    <span className="text-[12px] font-semibold">End-to-End Encryption & Secure Processing</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed max-w-md">Military-grade encryption ensures every image transfer and processing operation is fully secured.</p>
                </div>
              </div>
              <div className="stagger-item rounded-[2rem] bg-gradient-to-br from-zinc-950 via-[#1e1b4b] to-zinc-950 border border-white/5 p-6 flex flex-col justify-between min-h-[120px]">
                <Logo className="w-4 h-4 text-blue-400 animate-pulse" />
                <div>
                  <div className="flex items-center gap-1.5 text-white mb-1">
                    <span className="text-blue-400 font-bold text-sm">*</span>
                    <span className="text-[12px] font-semibold">GPU Cluster Processing</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">Distributed GPU infrastructure ensures sub-second enhancement at any scale.</p>
                </div>
              </div>
              <div className="stagger-item rounded-[2rem] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="w-4 h-4 rounded-full border border-cyan-400/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-white mb-1">
                    <span className="text-cyan-300 font-bold text-sm">*</span>
                    <span className="text-[12px] font-semibold">Commercial License</span>
                  </div>
                  <p className="text-[11px] text-blue-200 leading-relaxed">All outputs carry full commercial rights — use enhanced images anywhere without restrictions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GHOST MOUSE DEMO ─────────────────────────────────────────── */}
      <GhostMouseSection />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="h-screen bg-[#ebebeb] flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-5">
          <div className="flex items-end justify-between reveal shrink-0">
            <div>
              <Label>Testimonials</Label>
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] text-[#09090b] mt-3">Trusted by creators worldwide.</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollTestimonial(-1)}
                className="group relative overflow-hidden w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center cursor-pointer">
                <span className="absolute inset-0 bg-[#09090b] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
                <span className="relative z-10 text-zinc-500 group-hover:text-white transition-colors text-base leading-none">←</span>
              </button>
              <button onClick={() => scrollTestimonial(1)}
                className="group relative overflow-hidden w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center cursor-pointer">
                <span className="absolute inset-0 bg-[#09090b] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
                <span className="relative z-10 text-zinc-500 group-hover:text-white transition-colors text-base leading-none">→</span>
              </button>
            </div>
          </div>

          {/* Cards — tall, fills remaining height, bigger text */}
          <div ref={testimonialsRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide flex-1 reveal">
            {testimonials.map((t, i) => (
              <div key={i} className="snap-center shrink-0 w-[clamp(300px,34vw,440px)] h-full bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-8 flex flex-col gap-6">
                {/* Top row */}
                <div className="flex items-start justify-between shrink-0">
                  <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center">
                    <span className="text-3xl font-serif text-zinc-300 leading-none mt-1">"</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_,si) => (
                      <svg key={si} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                </div>
                {/* Quote */}
                <p className="text-[15px] md:text-[16px] leading-[1.65] text-zinc-600 flex-1">&ldquo;{t.quote}&rdquo;</p>
                {/* Author */}
                <div className="border-t border-zinc-100 pt-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-[11px] font-bold text-blue-600 shrink-0">
                      {t.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900">{t.name}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{t.role} · {t.loc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-zinc-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setTestimonialIdx(i); scrollTestimonial(i - testimonialIdx); }}
                className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-6 h-1.5 bg-zinc-900" : "w-1.5 h-1.5 bg-zinc-300 hover:bg-zinc-400"}`} />
            ))}
            <div className="flex-1 h-px bg-zinc-200 ml-2" />
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────── */}
      <section id="team" className="h-screen bg-[#0a0a0a] text-white flex flex-col justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex flex-col justify-center gap-5">
          <div className="flex items-end justify-between reveal">
            <div>
              <Label muted>Team</Label>
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mt-3">Meet our AI specialists.</h2>
            </div>
            <BtnDark onClick={() => setVideoOpen(true)}>Meet the team <ArrowRight className="w-3 h-3" /></BtnDark>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 stagger-grid">
            {team.map((m, i) => (
              <div key={i} className="stagger-item group bg-zinc-900 border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-300 flex flex-col"
                style={{ borderRadius: "2rem 0 2rem 0" }}>
                <div className="relative h-32 overflow-hidden flex-shrink-0">
                  <Image src={m.img} alt={m.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                  <span className="absolute top-3 left-3 text-[8px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {m.role.split(" ")[0]}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-1 flex-1">
                  <h3 className="text-[13px] font-semibold text-white tracking-[-0.02em]">{m.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">{m.role}</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-1.5">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / NEWSLETTER ─────────────────────────────────────────── */}
      <section id="contact" className="h-screen bg-[#ebebeb] flex items-center justify-center px-6 md:px-10 py-10">
        <div className="max-w-[1380px] mx-auto w-full h-full flex items-center">
          <div className="relative w-full h-full overflow-hidden border border-zinc-300/60 shadow-xl bg-zinc-950"
            style={{ borderRadius: "5rem 0 5rem 0" }}>
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="/14674120_trimmed_4s.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[#0a0a0a]/55" />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-start p-10 md:p-16"
            >
              <div className="w-full max-w-[520px] bg-white/95 backdrop-blur-md border border-white shadow-2xl p-8 md:p-10 flex flex-col gap-6"
                style={{ borderRadius: "3.5rem 0 3.5rem 0" }}>
                <Logo className="w-7 h-7 text-zinc-900" />

                <div>
                  <Label>Get started</Label>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.07] text-[#09090b] mt-3">
                    Ready to enhance your visuals?
                  </h2>
                </div>

                <p className="text-zinc-500 text-[13px] leading-relaxed">
                  Join thousands of creators using Spectrum AI — enhance, upscale, and restore images with professional AI models.
                </p>

                <form onSubmit={handleNewsletter} className="flex items-center bg-zinc-100 rounded-full p-1.5 border border-zinc-200">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Your e-mail..."
                    className="flex-1 bg-transparent border-none outline-none text-[#18181b] text-[12px] px-4 py-2.5 placeholder-zinc-400" />
                  <button type="submit"
                    className="group relative overflow-hidden w-10 h-10 bg-zinc-200 text-zinc-800 rounded-full flex items-center justify-center shrink-0 cursor-pointer border border-zinc-300 hover:border-[#09090b]">
                    <span className="absolute inset-0 bg-[#09090b] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom z-0" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500 text-[14px]">→</span>
                  </button>
                </form>

                <AnimatePresence>
                  {submitted && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" /> You're on the list. We'll be in touch soon.
                    </motion.div>
                  )}
                </AnimatePresence>

                <Btn onClick={onSignIn} className="w-full !rounded-2xl !py-3.5">
                  Start for Free <ArrowRight className="w-3.5 h-3.5" />
                </Btn>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-[#050505] text-white py-14 border-t border-white/5">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Logo className="w-4 h-4 text-white" />
              <span className="font-semibold text-[13px] tracking-[-0.02em]">Spectrum AI</span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed max-w-[170px]">AI-powered visual enhancement for creators, professionals, and enterprises.</p>
          </div>
          {[
            { h: "Product", links: ["Enhance", "Upscale", "Denoise", "Restore", "Colorize"] },
            { h: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
            { h: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Security"] },
          ].map(col => (
            <div key={col.h} className="flex flex-col gap-2.5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{col.h}</p>
              {col.links.map(l => <a key={l} href="#" className="text-[12px] text-zinc-400 hover:text-white transition-colors">{l}</a>)}
            </div>
          ))}
        </div>

        <div className="max-w-[1380px] mx-auto px-6 md:px-10 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-[10px] text-zinc-600 font-mono">© 2026 Spectrum AI Inc. All rights reserved.</span>
          <span className="text-[10px] text-zinc-600 font-mono">AI Visual Enhancement Engine · Powered by Spectrum v2.1</span>
        </div>
      </footer>

      {/* ── VIDEO MODAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/92 z-[60] flex items-center justify-center p-6 backdrop-blur-sm"
            onClick={() => setVideoOpen(false)}>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border border-white/10">
                <X className="w-4 h-4" />
              </button>
              <video autoPlay controls className="w-full h-full object-cover">
                <source src="/13167255_trimmed_4s.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root page with screen routing ───────────────────────────────────────────
export default function Page() {
  const { currentScreen, setScreen } = useOnboarding();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  switch (currentScreen) {
    case "HOME_PERSONALISED": return <HomeScreen />;
    case "SIGN_IN":           return <SignInScreen />;
    case "SIGN_UP":           return <SignUpScreen />;
    case "ONBOARDING":        return <OnboardingShell />;
    case "WELCOME_LOADING":   return <WelcomeLoadingScreen />;
    case "EMAIL_VERIFICATION":return <EmailVerificationScreen />;
    case "FORGOT_PASSWORD_1":
    case "FORGOT_PASSWORD_2":
    case "FORGOT_PASSWORD_3":
    case "FORGOT_PASSWORD_4": return <ForgotPasswordFlow />;
    default:                  return <LandingPage onSignIn={() => setScreen("SIGN_IN")} onGoHome={() => setScreen("HOME_PERSONALISED")} />;
  }
}
