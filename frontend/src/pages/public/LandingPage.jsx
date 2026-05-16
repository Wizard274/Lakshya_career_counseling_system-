import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";
import authService from "../../services/authService.js";
import AuthModal from "../../components/common/AuthModal.jsx";
import AmbientBackground from "../../components/common/AmbientBackground.jsx";
import "../../styles/landing.css";

// Dynamic Lottie wrapper to prevent SSR issues and handle fetching
const DynamicLottie = ({ url, style }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Error loading Lottie", err));
  }, [url]);

  if (!animationData) return <div style={{ ...style, background: "rgba(99,102,241,0.1)", borderRadius: "50%" }} />;

  return <Lottie animationData={animationData} loop={true} style={style} />;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState("");
  const isLoggedIn = authService.isLoggedIn();
  const shouldReduceMotion = useReducedMotion();

  const handleProtectedAction = (intent, route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setAuthIntent(intent);
      setIsAuthModalOpen(true);
    }
  };

  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Lakshya | Premium Career Navigation Platform</title>
        <meta name="description" content="Connect with certified career counselors and experience futuristic AI guidance. Built for the modern professional." />
      </Helmet>

      <AmbientBackground />

      {/* --- HERO SECTION --- */}
      <section id="home" className="hero-section">
        {/* Background Video */}
        <div className="hero-video-wrapper">
          <div className="hero-overlay" />
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="hero-video"
            poster="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          >
            {/* Premium abstract/cinematic background video */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-container interactive">
          <motion.div className="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1 variants={fadeUp}>
              Navigate Your <br />
              <span className="text-gradient">Career</span> with <br />
              Confidence
            </motion.h1>
            <motion.p variants={fadeUp}>
              Connect with certified career counselors. Get personalized guidance, expert sessions, and actionable plans to reach your goals. Built for the modern professional.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <button onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }} className="btn btn-outline btn-lg">Explore Services</button>
              <button onClick={() => handleProtectedAction("book a counselor", "/student/counselors")} className="btn btn-primary btn-lg glow-on-hover">
                Book Counselor
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Tilt tiltMaxAngleX={shouldReduceMotion ? 0 : 5} tiltMaxAngleY={shouldReduceMotion ? 0 : 5} perspective={1000} transitionSpeed={1000} scale={shouldReduceMotion ? 1 : 1.02} className="tilt-container">
              <div className="glass-mockup">
                <img src="/hero_dashboard_mockup_1778839303471.png" alt="Lakshya Dashboard Preview" className="hero-image" />
                <div className="glass-reflection" />
              </div>
            </Tilt>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="section-padding" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-container" style={{ gridTemplateColumns: "1fr" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="section-title">Why Lakshya?</h2>
            <p className="section-subtitle">
              We believe every student deserves clear, actionable, and personalized career guidance. Lakshya bridges the gap between ambition and reality using state-of-the-art AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="section-padding">
        <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Everything you need to succeed
        </motion.h2>
        <motion.p className="section-subtitle" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Powerful tools and expert guidance designed to accelerate your career growth.
        </motion.p>

        <motion.div className="features-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          {[
            { lottie: "https://assets9.lottiefiles.com/packages/lf20_qp1q7mct.json", icon: "🎯", title: "Career Guidance", desc: "1-on-1 personalized sessions to map out your exact career trajectory." },
            { lottie: "https://assets2.lottiefiles.com/packages/lf20_ucbyrun5.json", icon: "👨‍🏫", title: "Expert Counselors", desc: "Book sessions with verified industry experts and certified counselors." },
            { lottie: "https://assets6.lottiefiles.com/packages/lf20_w51pcehl.json", icon: "⚡", title: "AI Support", desc: "Get instant, data-driven career insights powered by advanced AI models." },
            { lottie: "https://assets8.lottiefiles.com/packages/lf20_qp1q7mct.json", icon: "📊", title: "Progress Tracking", desc: "Monitor your session notes, action items, and career milestones." },
          ].map((f, i) => (
            <Tilt key={i} tiltMaxAngleX={shouldReduceMotion ? 0 : 10} tiltMaxAngleY={shouldReduceMotion ? 0 : 10} perspective={1000} transitionSpeed={1000}>
              <motion.div className="feature-card interactive mouse-glow" variants={fadeUp}>
                <div className="feature-icon">
                  {/* Fallback to emoji if lottie fails or is too heavy */}
                  {shouldReduceMotion ? <span style={{ fontSize: "2.5rem" }}>{f.icon}</span> : <DynamicLottie url={f.lottie} style={{ width: 64, height: 64 }} />}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </motion.div>
      </section>

      {/* --- VIDEO SHOWCASE SECTION --- */}
      <section id="how-it-works" className="section-padding" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-container" style={{ gridTemplateColumns: "1fr" }}>
          <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            See How It Works
          </motion.h2>
          <motion.div className="showcase-video-container" initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="showcase-video"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screens-2720-large.mp4" type="video/mp4" />
            </video>
            <div className="video-glass-border" />
          </motion.div>
        </div>
      </section>

      {/* --- STATS / PROJECT INFO --- */}
      <section id="services" ref={statsRef} className="section-padding">
        <div className="hero-container" style={{ gridTemplateColumns: "1fr", textAlign: "center" }}>
          <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Trusted by Thousands
          </motion.h2>
          <motion.div style={{ display: "flex", justifyContent: "center", gap: "64px", flexWrap: "wrap", marginTop: "48px" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {[
              { val: 2400, suffix: "+", label: "Students Guided" },
              { val: 150, suffix: "+", label: "Certified Counselors" },
              { val: 98, suffix: "%", label: "Satisfaction Rate" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary-color)", fontFamily: "'Inter', sans-serif" }}>
                  {statsInView ? <CountUp end={s.val} duration={2.5} separator="," useEasing={true} /> : "0"}
                  {s.suffix}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600 }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section id="contact" className="section-padding" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <motion.div className="cta-container interactive" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="section-title">Ready to take the next step?</h2>
          <p className="section-subtitle" style={{ marginBottom: "32px", color: "var(--text-main)" }}>Join Lakshya today and start building the future you deserve.</p>
          <button onClick={() => handleProtectedAction("get started", "/student/dashboard")} className="btn btn-primary btn-lg glow-on-hover" style={{ padding: "16px 48px" }}>
            Get Started Free
          </button>
        </motion.div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} intent={authIntent} />
    </>
  );
};

export default LandingPage;
