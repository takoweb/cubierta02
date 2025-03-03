import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import MenuGrid from "./MenuGrid";
import Loading from "./ui/loading";
import { getThemeValue } from "../utils/theme";
import { Dish } from "../types/dish";
import { ContentSettings } from "./ContentEditor";
import { fetchDishes } from "../services/dishService";
import { trackPageView } from "../services/analyticsService";

const Home = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState<ContentSettings>({
    pageTitle: "メニュー",
    pageDescription:
      "最高の食材で作られた美味しい料理の数々をご覧ください。すべての料理は、特別な食事体験を提供するために丁寧に作られています。",
    footerText: "Cubierta. 全著作権所有。",
  });

  useEffect(() => {
    // Track page view
    trackPageView("home");

    // Load dishes and content from Supabase or fallback to localStorage
    const loadData = async () => {
      try {
        // Try to fetch dishes from Supabase first
        const supabaseDishes = await fetchDishes();

        if (supabaseDishes && supabaseDishes.length > 0) {
          setDishes(supabaseDishes);
        } else {
          // Fallback to localStorage if no dishes in Supabase
          const savedDishes = localStorage.getItem("restaurantDishes");
          if (savedDishes) {
            setDishes(JSON.parse(savedDishes));
          } else {
            // Default dishes will be provided by MenuGrid component
            setDishes([]);
          }
        }

        // Try to fetch page content from Supabase
        const { fetchPageContent } = await import("../services/contentService");
        const supabaseContent = await fetchPageContent();

        if (supabaseContent) {
          setPageContent(supabaseContent);
        } else {
          // Fallback to localStorage if no content in Supabase
          const savedContent = localStorage.getItem("restaurantContent");
          if (savedContent) {
            setPageContent(JSON.parse(savedContent));
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to localStorage on error
        const savedDishes = localStorage.getItem("restaurantDishes");
        if (savedDishes) {
          setDishes(JSON.parse(savedDishes));
        }

        const savedContent = localStorage.getItem("restaurantContent");
        if (savedContent) {
          setPageContent(JSON.parse(savedContent));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLoginSuccess = (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      // Redirect is handled in the Navbar component
    }
  };

  if (isLoading) {
    return <Loading message="メニューを読み込み中..." />;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: getThemeValue("secondaryColor", "#f8fafc"),
        fontFamily: getThemeValue("fontFamily", "'Inter', sans-serif"),
      }}
    >
      <Navbar onLoginSuccess={handleLoginSuccess} />

      <main className="container mx-auto py-8 md:py-12 px-4 overflow-hidden">
        <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            style={{
              color: getThemeValue("headerFontColor", "#1e293b"),
            }}
          >
            {pageContent.pageTitle}
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto px-2"
            style={{
              color: getThemeValue("textFontColor", "#475569"),
            }}
          >
            {pageContent.pageDescription}
          </p>
        </div>

        <MenuGrid dishes={dishes.length > 0 ? dishes : []} />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 md:py-8 mt-8 md:mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            &copy; {new Date().getFullYear()} {pageContent.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
