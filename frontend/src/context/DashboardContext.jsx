import React, { createContext, useContext, useState, useCallback } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiWidgetOpen, setAiWidgetOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  
  const toggleAiWidget = useCallback(() => setAiWidgetOpen((prev) => !prev), []);
  const closeAiWidget = useCallback(() => setAiWidgetOpen(false), []);

  return (
    <DashboardContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        aiWidgetOpen,
        toggleAiWidget,
        closeAiWidget,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};
