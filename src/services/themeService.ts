import { supabase } from "../lib/supabase";

export interface ThemeSettings {
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

export const fetchThemeSettings = async (): Promise<ThemeSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("theme_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching theme settings:", error);
      return null;
    }

    return {
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      accentColor: data.accent_color,
      fontFamily: data.font_family,
      logoUrl: data.logo_url,
      headerFontColor: data.header_font_color,
      textFontColor: data.text_font_color,
      buttonColor: data.button_color,
      buttonTextColor: data.button_text_color,
    };
  } catch (error) {
    console.error("Exception fetching theme settings:", error);
    return null;
  }
};

export const updateThemeSettings = async (
  settings: ThemeSettings,
): Promise<boolean> => {
  try {
    // First check if any settings exist
    const { data: existingData, error: checkError } = await supabase
      .from("theme_settings")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1);

    if (checkError) {
      console.error("Error checking existing theme settings:", checkError);
      return false;
    }

    if (existingData && existingData.length > 0) {
      // Update existing settings
      const { error } = await supabase
        .from("theme_settings")
        .update({
          primary_color: settings.primaryColor,
          secondary_color: settings.secondaryColor,
          accent_color: settings.accentColor,
          font_family: settings.fontFamily,
          logo_url: settings.logoUrl,
          header_font_color: settings.headerFontColor,
          text_font_color: settings.textFontColor,
          button_color: settings.buttonColor,
          button_text_color: settings.buttonTextColor,
          updated_at: new Date(),
        })
        .eq("id", existingData[0].id);

      if (error) {
        console.error("Error updating theme settings:", error);
        return false;
      }
    } else {
      // Insert new settings
      const { error } = await supabase.from("theme_settings").insert([
        {
          primary_color: settings.primaryColor,
          secondary_color: settings.secondaryColor,
          accent_color: settings.accentColor,
          font_family: settings.fontFamily,
          logo_url: settings.logoUrl,
          header_font_color: settings.headerFontColor,
          text_font_color: settings.textFontColor,
          button_color: settings.buttonColor,
          button_text_color: settings.buttonTextColor,
        },
      ]);

      if (error) {
        console.error("Error inserting theme settings:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Exception updating theme settings:", error);
    return false;
  }
};
