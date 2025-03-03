import { supabase } from "../lib/supabase";

interface TimeChunkData {
  lunch: number;
  afternoon: number;
  dinner: number;
  other: number;
}

interface PopularDish {
  name: string;
  views: number;
}

export interface AnalyticsData {
  timeChunks: TimeChunkData;
  dailyViews: number[];
  weeklyViews: number[];
  monthlyViews: number[];
  popularDishes: PopularDish[];
  yearlyData: {
    [year: string]: {
      [month: string]: TimeChunkData;
    };
  };
}

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    // Get time chunks data
    const { data: timeChunksData, error: timeChunksError } = await supabase
      .from("menu_analytics")
      .select("time_chunk, count(*)")
      .group("time_chunk");

    if (timeChunksError) {
      console.error("Error fetching time chunks:", timeChunksError);
    }

    // Get popular dishes
    const { data: popularDishesData, error: popularDishesError } =
      await supabase
        .from("menu_analytics")
        .select("dishes(name), dish_id, count(*)")
        .eq("page_viewed", "dish_detail")
        .group("dish_id, dishes(name)")
        .order("count", { ascending: false })
        .limit(5);

    if (popularDishesError) {
      console.error("Error fetching popular dishes:", popularDishesError);
    }

    // Get yearly data
    const { data: yearlyData, error: yearlyError } = await supabase
      .from("menu_analytics")
      .select("year, month, time_chunk, count(*)")
      .group("year, month, time_chunk")
      .order("year, month");

    if (yearlyError) {
      console.error("Error fetching yearly data:", yearlyError);
    }

    // Process time chunks data
    const timeChunks: TimeChunkData = {
      lunch: 0,
      afternoon: 0,
      dinner: 0,
      other: 0,
    };

    timeChunksData?.forEach((item) => {
      timeChunks[item.time_chunk as keyof TimeChunkData] = parseInt(item.count);
    });

    // Process popular dishes data
    const popularDishes: PopularDish[] =
      popularDishesData?.map((item) => ({
        name: item.dishes?.name || "Unknown Dish",
        views: parseInt(item.count),
      })) || [];

    // Process yearly data
    const processedYearlyData: {
      [year: string]: {
        [month: string]: TimeChunkData;
      };
    } = {};

    yearlyData?.forEach((item) => {
      const year = item.year.toString();
      const month = item.month.toString();
      const timeChunk = item.time_chunk as keyof TimeChunkData;
      const count = parseInt(item.count);

      if (!processedYearlyData[year]) {
        processedYearlyData[year] = {};
      }

      if (!processedYearlyData[year][month]) {
        processedYearlyData[year][month] = {
          lunch: 0,
          afternoon: 0,
          dinner: 0,
          other: 0,
        };
      }

      processedYearlyData[year][month][timeChunk] = count;
    });

    // Generate mock data for views (since we don't have this in our schema yet)
    const dailyViews = [42, 38, 55, 47, 53, 65, 71];
    const weeklyViews = [320, 280, 305, 350, 410];
    const monthlyViews = [1200, 1350, 1450, 1320, 1500, 1680];

    return {
      timeChunks,
      dailyViews,
      weeklyViews,
      monthlyViews,
      popularDishes,
      yearlyData: processedYearlyData,
    };
  } catch (error) {
    console.error("Exception fetching analytics data:", error);

    // Return default data structure in case of error
    return {
      timeChunks: { lunch: 0, afternoon: 0, dinner: 0, other: 0 },
      dailyViews: [0, 0, 0, 0, 0, 0, 0],
      weeklyViews: [0, 0, 0, 0, 0],
      monthlyViews: [0, 0, 0, 0, 0, 0],
      popularDishes: [],
      yearlyData: {},
    };
  }
};

export const trackPageView = async (pageName: string): Promise<void> => {
  try {
    // Determine time chunk based on current hour
    const hour = new Date().getHours();
    let timeChunk = "other";

    if (hour >= 11 && hour < 14) {
      timeChunk = "lunch";
    } else if (hour >= 14 && hour < 18) {
      timeChunk = "afternoon";
    } else if (hour >= 18 && hour < 23) {
      timeChunk = "dinner";
    }

    await supabase.from("menu_analytics").insert([
      {
        time_chunk: timeChunk,
        page_viewed: pageName,
        device_type: getDeviceType(),
      },
    ]);
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};

// Helper function to determine device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet/i.test(userAgent)) return "tablet";
  return "desktop";
};
