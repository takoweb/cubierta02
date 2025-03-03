import { supabase } from "../lib/supabase";
import { Dish } from "../types/dish";

export const fetchDishes = async (): Promise<Dish[]> => {
  try {
    const { data, error } = await supabase
      .from("dishes")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching dishes:", error);
      return [];
    }

    return data.map((dish) => ({
      id: dish.id,
      name: dish.name,
      subtitle: dish.subtitle || undefined,
      description: dish.description || undefined,
      price: dish.price,
      image: dish.image,
      category: dish.category,
      ingredients: dish.ingredients || undefined,
    }));
  } catch (error) {
    console.error("Exception fetching dishes:", error);
    return [];
  }
};

export const addDish = async (dish: Omit<Dish, "id">): Promise<Dish | null> => {
  try {
    const { data, error } = await supabase
      .from("dishes")
      .insert([
        {
          name: dish.name,
          subtitle: dish.subtitle,
          description: dish.description,
          price: dish.price,
          image: dish.image,
          category: dish.category,
          ingredients: dish.ingredients,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding dish:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      subtitle: data.subtitle || undefined,
      description: data.description || undefined,
      price: data.price,
      image: data.image,
      category: data.category,
      ingredients: data.ingredients || undefined,
    };
  } catch (error) {
    console.error("Exception adding dish:", error);
    return null;
  }
};

export const updateDish = async (dish: Dish): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("dishes")
      .update({
        name: dish.name,
        subtitle: dish.subtitle,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        category: dish.category,
        ingredients: dish.ingredients,
        updated_at: new Date(),
      })
      .eq("id", dish.id);

    if (error) {
      console.error("Error updating dish:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception updating dish:", error);
    return false;
  }
};

export const deleteDish = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("dishes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting dish:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception deleting dish:", error);
    return false;
  }
};

export const trackDishView = async (dishId: string): Promise<void> => {
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
        page_viewed: "dish_detail",
        dish_id: dishId,
        device_type: getDeviceType(),
      },
    ]);
  } catch (error) {
    console.error("Error tracking dish view:", error);
  }
};

// Helper function to determine device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet/i.test(userAgent)) return "tablet";
  return "desktop";
};
