import { useAuth } from "@/services/AuthContext";
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tách useTheme thành một function riêng và export
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Component ThemeProvider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userRole } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const shouldApplyTheme = () => {
    if (!userRole) return false;
    return userRole !== "Customer";
  };

  useEffect(() => {
    if (shouldApplyTheme()) {
      document.documentElement.classList.toggle("dark", isDarkMode);
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
    }
  }, [isDarkMode, userRole]);

  const toggleTheme = () => {
    if (shouldApplyTheme()) {
      setIsDarkMode((prev) => !prev);
    }
  };

  if (!shouldApplyTheme()) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Export cả component và hook
export { ThemeProvider, useTheme };