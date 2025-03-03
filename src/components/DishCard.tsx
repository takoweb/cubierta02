import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Dish } from "../types/dish";
import { trackDishView } from "../services/dishService";

type DishCardProps = Partial<Dish> & {
  onClick?: () => void;
};

const DishCard = ({
  image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  name = "Delicious Dish",
  subtitle,
  ingredients,
  onClick,
}: DishCardProps) => {
  return (
    <div className="bg-white w-full max-w-[380px] mx-auto h-auto sm:h-[480px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="relative h-[220px] sm:h-[320px] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 h-auto sm:h-[160px] flex flex-col justify-between">
        <h3
          className="text-lg sm:text-xl font-medium text-gray-800"
          dangerouslySetInnerHTML={{ __html: name.replace(/\n/g, "<br/>") }}
        ></h3>
        {subtitle && (
          <p
            className="text-sm text-gray-500 mt-1"
            dangerouslySetInnerHTML={{
              __html: subtitle.replace(/\n/g, "<br/>"),
            }}
          ></p>
        )}
        <div className="mt-2 flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={onClick}
          >
            詳細を見る
          </Button>
        </div>
      </div>
    </div>
  );
};

// Wrapped version with dialog built-in
const DishCardWithDialog = ({
  id = "1",
  image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  name = "Delicious Dish",
  subtitle,
  ingredients,
  description = "A delicious dish made with the finest ingredients. This dish is perfect for any occasion and will satisfy your taste buds.",
}: DishCardProps) => {
  const handleDishClick = () => {
    // Track dish view in analytics when clicked
    if (id) {
      trackDishView(id);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div onClick={handleDishClick}>
          <DishCard
            id={id}
            image={image}
            name={name}
            subtitle={subtitle}
            ingredients={ingredients}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden h-[200px] md:h-auto">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2
              className="text-xl md:text-2xl font-bold mb-1"
              dangerouslySetInnerHTML={{ __html: name.replace(/\n/g, "<br/>") }}
            ></h2>
            {subtitle && (
              <p
                className="text-gray-500 text-sm mb-2"
                dangerouslySetInnerHTML={{
                  __html: subtitle.replace(/\n/g, "<br/>"),
                }}
              ></p>
            )}
            <p
              className="text-gray-600 mb-4 text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html: (
                  description ||
                  "A delicious dish made with the finest ingredients."
                ).replace(/\n/g, "<br/>"),
              }}
            ></p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Ingredients 🍕 材料 🍕 재료</p>
              <p className="text-xs md:text-sm text-gray-600">
                {ingredients ||
                  "Fresh vegetables, premium meat, aromatic herbs, special sauce"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { DishCardWithDialog };
export default DishCard;
