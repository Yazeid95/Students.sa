"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const updateDocumentTheme = useCallback((isDarkTheme: boolean) => {
    const documentElement = document.documentElement;
    
    if (isDarkTheme) {
      documentElement.classList.add("dark");
      documentElement.classList.remove("light");
    } else {
      documentElement.classList.remove("dark");
      documentElement.classList.add("light");
    }
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to dark
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
      setIsDark(shouldBeDark);
      updateDocumentTheme(shouldBeDark);
    } catch (error) {
      console.error("Error loading theme preference:", error);
      setIsDark(true);
      updateDocumentTheme(true);
    }
  }, [updateDocumentTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    updateDocumentTheme(newTheme);
  }, [isDark, updateDocumentTheme]);

  const theme: 'light' | 'dark' = useMemo(() => isDark ? 'dark' : 'light', [isDark]);

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    theme
  }), [isDark, toggleTheme, theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
