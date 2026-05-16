import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CountUp from "react-countup";
import { Target, TrendingUp, Compass, CalendarCheck } from "lucide-react";

const AnalyticsCards = memo(({ stats }) => {
  const shouldReduceMotion = useReducedMotion();

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const cards = [
    { label: "Career Readiness", value: stats.readinessScore, suffix: "%", icon: <Target size={24} /> },
    { label: "Skills Completed", value: stats.skillsCompleted, suffix: "", icon: <Compass size={24} /> },
    { label: "Weekly Growth", value: stats.weeklyGrowth, suffix: "%", icon: <TrendingUp size={24} /> },
    { label: "Upcoming Sessions", value: stats.upcoming, suffix: "", icon: <CalendarCheck size={24} /> },
  ];

  return (
    <motion.div 
      className="dash-grid-middle"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {cards.map((card, i) => (
        <motion.div key={i} variants={fadeUp} className="glass-card analytics-card interactive">
          <div className="analytics-icon-wrap">
            {card.icon}
          </div>
          <div style={{ marginTop: "8px" }}>
            <div className="analytics-value">
              <CountUp end={card.value || 0} duration={2} useEasing={true} />
              {card.suffix}
            </div>
            <div className="analytics-label">{card.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

AnalyticsCards.displayName = "AnalyticsCards";
export default AnalyticsCards;
