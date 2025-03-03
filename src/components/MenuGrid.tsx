import React from "react";
import { DishCardWithDialog } from "./DishCard";
import { Dish } from "../types/dish";

interface MenuGridProps {
  dishes?: Dish[];
}

const MenuGrid = ({ dishes = [] }: MenuGridProps) => {
  return (
    <div className="bg-white w-full mx-auto p-4 md:p-6 overflow-x-hidden">
      {dishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {dishes.map((dish) => (
            <DishCardWithDialog
              key={dish.id}
              image={dish.image}
              name={dish.name}
              subtitle={dish.subtitle}
              ingredients={dish.ingredients}
              description={dish.description || ""}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">現在、料理はありません。</p>
          <p className="text-sm text-gray-400">
            後ほど再度確認するか、レストランにお問い合わせください。
          </p>
        </div>
      )}
    </div>
  );
};

// Default dishes are now imported from types/dish.ts

export default MenuGrid;
