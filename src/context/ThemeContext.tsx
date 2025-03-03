import React, { createContext, useState, useContext, useEffect } from "react";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl: string;
  headerFontColor: string;
  textFontColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

const defaultSettings: ThemeSettings = {
  primaryColor: "#1e293b", // slate-800
  secondaryColor: "#f8fafc", // slate-50
  accentColor: "#0ea5e9", // sky-500
  fontFamily: "'Inter', sans-serif",
  logoUrl: "/vite.svg",
  headerFontColor: "#1e293b", // slate-800
  textFontColor: "#475569", // slate-600
  buttonColor: "#0ea5e9", // sky-500
  buttonTextColor: "#ffffff", // white
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultSettings,
  updateTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultSettings);

  useEffect(() => {
    // Load theme from Supabase or fallback to localStorage
    const loadTheme = async () => {
      try {
        // Try to fetch from Supabase first
        const { fetchThemeSettings } = await import("../services/themeService");
        const supabaseTheme = await fetchThemeSettings();

        if (supabaseTheme) {
          setTheme({ ...defaultSettings, ...supabaseTheme });
        } else {
          // Fallback to localStorage
          const savedTheme = localStorage.getItem("restaurantThemeSettings");
          if (savedTheme) {
            try {
              const parsedTheme = JSON.parse(savedTheme);
              setTheme({ ...defaultSettings, ...parsedTheme });
            } catch (error) {
              console.error("Failed to parse theme settings:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading theme settings:", error);
        // Fallback to localStorage
        const savedTheme = localStorage.getItem("restaurantThemeSettings");
        if (savedTheme) {
          try {
            const parsedTheme = JSON.parse(savedTheme);
            setTheme({ ...defaultSettings, ...parsedTheme });
          } catch (error) {
            console.error("Failed to parse theme settings:", error);
          }
        }
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.style.setProperty(
      "--font-family",
      theme.fontFamily,
    );

    // Create a style element for custom CSS variables
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      :root {
        --primary-color: ${theme.primaryColor};
        --secondary-color: ${theme.secondaryColor};
        --accent-color: ${theme.accentColor};
        --header-font-color: ${theme.headerFontColor};
        --text-font-color: ${theme.textFontColor};
        --button-color: ${theme.buttonColor};
        --button-text-color: ${theme.buttonTextColor};
      }
      
      body {
        font-family: ${theme.fontFamily};
      }
    `;

    // Add the style element to the head
    document.head.appendChild(styleEl);

    // Clean up function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [theme]);

  const updateTheme = async (newTheme: Partial<ThemeSettings>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setTheme(updatedTheme);

    try {
      // Try to save to Supabase first
      const { updateThemeSettings } = await import("../services/themeService");
      const success = await updateThemeSettings(updatedTheme);

      // Always save to localStorage as fallback
      localStorage.setItem(
        "restaurantThemeSettings",
        JSON.stringify(updatedTheme),
      );

      if (!success) {
        console.warn(
          "Failed to save theme to Supabase, but saved to localStorage",
        );
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      // Fallback to localStorage only
      localStorage.setItem(
        "restaurantThemeSettings",
        JSON.stringify(updatedTheme),
      );
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
