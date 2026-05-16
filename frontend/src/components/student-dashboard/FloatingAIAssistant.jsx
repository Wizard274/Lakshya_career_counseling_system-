import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardContext } from "../../context/DashboardContext.jsx";
import { MessageSquare, X, Send } from "lucide-react";

const FloatingAIAssistant = memo(() => {
  const { aiWidgetOpen, toggleAiWidget, closeAiWidget } = useDashboardContext();

  return (
    <div className="ai-widget-container">
      <AnimatePresence>
        {aiWidgetOpen && (
          <motion.div 
            className="ai-chat-popover"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", background: "var(--primary-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", lineHeight: 1.2 }}>Lakshya AI</div>
                  <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: "500" }}>Career Assistant</div>
                </div>
              </div>
              <button onClick={closeAiWidget} className="icon-btn" style={{ width: "28px", height: "28px" }}><X size={16} /></button>
            </div>

            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "var(--bg-page)", border: "1px solid var(--border)", padding: "12px", borderRadius: "12px 12px 12px 2px", fontSize: "13px", color: "var(--text-body)", lineHeight: 1.5 }}>
                Hi there! 👋 I'm your AI career assistant. I can help you find the right learning paths, prepare for interviews, or analyze your skills. What would you like to do today?
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                <span className="interactive" style={{ fontSize: "11px", padding: "6px 12px", background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--primary-mid)", borderRadius: "16px", cursor: "pointer", fontWeight: "500" }}>Review my resume</span>
                <span className="interactive" style={{ fontSize: "11px", padding: "6px 12px", background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--primary-mid)", borderRadius: "16px", cursor: "pointer", fontWeight: "500" }}>Suggest courses</span>
              </div>
            </div>

            <div style={{ padding: "12px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }}>
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  placeholder="Ask anything..." 
                  style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: "20px", border: "1px solid var(--border)", background: "var(--bg-page)", color: "var(--text-body)", fontSize: "13px", outline: "none" }}
                />
                <button style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", background: "var(--primary)", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="ai-widget-btn" onClick={toggleAiWidget} aria-label="Toggle AI Assistant">
        {aiWidgetOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
});

FloatingAIAssistant.displayName = "FloatingAIAssistant";
export default FloatingAIAssistant;
