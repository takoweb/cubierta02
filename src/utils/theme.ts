export const getThemeValue = (key: string, defaultValue: string): string => {
  try {
    const themeSettings = localStorage.getItem("restaurantThemeSettings");
    if (!themeSettings) return defaultValue;

    const parsedSettings = JSON.parse(themeSettings);
    return parsedSettings[key] || defaultValue;
  } catch (error) {
    console.error("Error getting theme value:", error);
    return defaultValue;
  }
};
