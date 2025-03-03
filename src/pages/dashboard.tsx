import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import MenuManager from "../components/MenuManager";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { Button } from "../components/ui/button";
import { Home, Menu, X, BarChart } from "lucide-react";
import ThemeSettings from "../components/ThemeSettings";
import ContentEditor, { ContentSettings } from "../components/ContentEditor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Dish } from "../types/dish";
import Loading from "../components/ui/loading";
import { getThemeValue } from "../utils/theme";
import { isAuthenticated, logout } from "../utils/auth";
import Logo from "../components/ui/logo";
import {
  fetchDishes,
  addDish,
  updateDish,
  deleteDish,
} from "../services/dishService";
import { trackPageView } from "../services/analyticsService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    // Track page view
    trackPageView("dashboard");

    // Load dishes from Supabase or fallback to localStorage
    const loadDishes = async () => {
      try {
        // Try to fetch from Supabase first
        const supabaseDishes = await fetchDishes();

        if (supabaseDishes && supabaseDishes.length > 0) {
          setDishes(supabaseDishes);
        } else {
          // Fallback to localStorage if no dishes in Supabase
          const savedDishes = localStorage.getItem("restaurantDishes");
          if (savedDishes) {
            setDishes(JSON.parse(savedDishes));
          } else {
            // Import default dishes from types
            const { defaultDishes } = require("../types/dish");
            setDishes(defaultDishes);
            localStorage.setItem(
              "restaurantDishes",
              JSON.stringify(defaultDishes),
            );
          }
        }
      } catch (error) {
        console.error("Error loading dishes:", error);
        // Fallback to localStorage on error
        const savedDishes = localStorage.getItem("restaurantDishes");
        if (savedDishes) {
          setDishes(JSON.parse(savedDishes));
        } else {
          // Import default dishes from types
          const { defaultDishes } = require("../types/dish");
          setDishes(defaultDishes);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDishes();
  }, [navigate]);

  const handleAddDish = async (newDish: Omit<Dish, "id">) => {
    try {
      // Try to add to Supabase first
      const addedDish = await addDish(newDish);

      if (addedDish) {
        // If successful, update state
        const updatedDishes = [...dishes, addedDish];
        setDishes(updatedDishes);
        // Also update localStorage as fallback
        localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
      } else {
        // Fallback to localStorage only
        const dish = {
          ...newDish,
          id: Date.now().toString(),
        };
        const updatedDishes = [...dishes, dish];
        setDishes(updatedDishes);
        localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
      }
    } catch (error) {
      console.error("Error adding dish:", error);
      // Fallback to localStorage
      const dish = {
        ...newDish,
        id: Date.now().toString(),
      };
      const updatedDishes = [...dishes, dish];
      setDishes(updatedDishes);
      localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
    }
  };

  const handleEditDish = async (editedDish: Dish) => {
    try {
      // Try to update in Supabase first
      const success = await updateDish(editedDish);

      if (success) {
        // If successful, update state
        const updatedDishes = dishes.map((dish) =>
          dish.id === editedDish.id ? editedDish : dish,
        );
        setDishes(updatedDishes);
        // Also update localStorage as fallback
        localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
        return true;
      } else {
        // Fallback to localStorage only
        const updatedDishes = dishes.map((dish) =>
          dish.id === editedDish.id ? editedDish : dish,
        );
        setDishes(updatedDishes);
        localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
        return true;
      }
    } catch (error) {
      console.error("Error updating dish:", error);
      // Fallback to localStorage
      const updatedDishes = dishes.map((dish) =>
        dish.id === editedDish.id ? editedDish : dish,
      );
      setDishes(updatedDishes);
      localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
      return true;
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      // Try to delete from Supabase first
      const success = await deleteDish(id);

      // Regardless of Supabase success, update local state
      const updatedDishes = dishes.filter((dish) => dish.id !== id);
      setDishes(updatedDishes);
      localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
    } catch (error) {
      console.error("Error deleting dish:", error);
      // Fallback to localStorage
      const updatedDishes = dishes.filter((dish) => dish.id !== id);
      setDishes(updatedDishes);
      localStorage.setItem("restaurantDishes", JSON.stringify(updatedDishes));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleContentSave = async (content: ContentSettings) => {
    try {
      // Try to save to Supabase first
      const { updatePageContent } = await import("../services/contentService");
      const success = await updatePageContent(content);

      // Always save to localStorage as fallback
      localStorage.setItem("restaurantContent", JSON.stringify(content));

      if (!success) {
        console.warn(
          "Failed to save content to Supabase, but saved to localStorage",
        );
      }
    } catch (error) {
      console.error("Error saving content:", error);
      // Fallback to localStorage only
      localStorage.setItem("restaurantContent", JSON.stringify(content));
    }
  };

  if (isLoading) {
    return <Loading message="ダッシュボードを読み込み中..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full border-b border-gray-200 shadow-sm px-4 md:px-6 py-4 md:h-20 flex flex-wrap md:flex-nowrap items-center justify-between bg-white">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row">
          <div className="flex justify-between items-center w-full">
            <Logo size="medium" />
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0 transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-center gap-3">
              <ContentEditor
                onSave={handleContentSave}
                initialContent={
                  localStorage.getItem("restaurantContent")
                    ? JSON.parse(
                        localStorage.getItem("restaurantContent") || "{}",
                      )
                    : undefined
                }
              />

              <ThemeSettings
                onSave={async (settings) => {
                  try {
                    // Save to Supabase first
                    const { updateThemeSettings } = await import(
                      "../services/themeService"
                    );
                    await updateThemeSettings(settings);

                    // Force a re-render by updating localStorage directly
                    localStorage.setItem(
                      "restaurantThemeSettings",
                      JSON.stringify(settings),
                    );
                    window.location.reload();
                  } catch (error) {
                    console.error("Error saving theme settings:", error);
                    // Still update localStorage and reload as fallback
                    localStorage.setItem(
                      "restaurantThemeSettings",
                      JSON.stringify(settings),
                    );
                    window.location.reload();
                  }
                }}
                initialSettings={
                  localStorage.getItem("restaurantThemeSettings")
                    ? JSON.parse(
                        localStorage.getItem("restaurantThemeSettings") || "{}",
                      )
                    : undefined
                }
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link to="/" className="w-full md:w-auto">
                <Button
                  variant="outline"
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                  style={{
                    borderColor: localStorage.getItem("restaurantThemeSettings")
                      ? JSON.parse(
                          localStorage.getItem("restaurantThemeSettings") ||
                            "{}",
                        ).buttonColor || "#0ea5e9"
                      : "#0ea5e9",
                    color: localStorage.getItem("restaurantThemeSettings")
                      ? JSON.parse(
                          localStorage.getItem("restaurantThemeSettings") ||
                            "{}",
                        ).buttonColor || "#0ea5e9"
                      : "#0ea5e9",
                  }}
                >
                  <Home size={18} />
                  <span>ホームに戻る</span>
                </Button>
              </Link>
              <a
                href="https://drive.google.com/drive/folders/17n0JnmAqx7szXpeMU6FG-dSMTUQw6Ivl?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                  style={{
                    borderColor: localStorage.getItem("restaurantThemeSettings")
                      ? JSON.parse(
                          localStorage.getItem("restaurantThemeSettings") ||
                            "{}",
                        ).buttonColor || "#0ea5e9"
                      : "#0ea5e9",
                    color: localStorage.getItem("restaurantThemeSettings")
                      ? JSON.parse(
                          localStorage.getItem("restaurantThemeSettings") ||
                            "{}",
                        ).buttonColor || "#0ea5e9"
                      : "#0ea5e9",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                  <span>レシピ</span>
                </Button>
              </a>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full md:w-auto flex items-center justify-center gap-2 mt-2 md:mt-0"
              style={{
                borderColor: localStorage.getItem("restaurantThemeSettings")
                  ? JSON.parse(
                      localStorage.getItem("restaurantThemeSettings") || "{}",
                    ).buttonColor || "#0ea5e9"
                  : "#0ea5e9",
                color: localStorage.getItem("restaurantThemeSettings")
                  ? JSON.parse(
                      localStorage.getItem("restaurantThemeSettings") || "{}",
                    ).buttonColor || "#0ea5e9"
                  : "#0ea5e9",
              }}
            >
              <span>ログアウト</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 md:py-8 px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            ダッシュボードへようこそ
          </h1>
          <p className="text-gray-600">
            レストランメニューを管理し、分析データを表示します。
          </p>
        </div>

        <Tabs defaultValue="menu" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Menu size={16} />
              メニュー管理
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart size={16} />
              分析
            </TabsTrigger>
          </TabsList>
          <TabsContent value="menu">
            <MenuManager
              dishes={dishes}
              onAddDish={handleAddDish}
              onEditDish={handleEditDish}
              onDeleteDish={handleDeleteDish}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
