import { supabase } from "../lib/supabase";
import { ContentSettings } from "../components/ContentEditor";

export const fetchPageContent = async (): Promise<ContentSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching page content:", error);
      return null;
    }

    return {
      pageTitle: data.page_title,
      pageDescription: data.page_description,
      footerText: data.footer_text,
    };
  } catch (error) {
    console.error("Exception fetching page content:", error);
    return null;
  }
};

export const updatePageContent = async (
  content: ContentSettings,
): Promise<boolean> => {
  try {
    // First check if any content exists
    const { data: existingData, error: checkError } = await supabase
      .from("page_content")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1);

    if (checkError) {
      console.error("Error checking existing page content:", checkError);
      return false;
    }

    if (existingData && existingData.length > 0) {
      // Update existing content
      const { error } = await supabase
        .from("page_content")
        .update({
          page_title: content.pageTitle,
          page_description: content.pageDescription,
          footer_text: content.footerText,
          updated_at: new Date(),
        })
        .eq("id", existingData[0].id);

      if (error) {
        console.error("Error updating page content:", error);
        return false;
      }
    } else {
      // Insert new content
      const { error } = await supabase.from("page_content").insert([
        {
          page_title: content.pageTitle,
          page_description: content.pageDescription,
          footer_text: content.footerText,
        },
      ]);

      if (error) {
        console.error("Error inserting page content:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Exception updating page content:", error);
    return false;
  }
};
