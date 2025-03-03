import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface DishModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  dish?: {
    id?: string;
    name?: string;
    subtitle?: string;
    description?: string;
    price?: string;
    image?: string;
    ingredients?: string[];
    dietaryInfo?: string[];
  };
}

const DishModal = ({
  isOpen = true,
  onClose = () => {},
  dish = {
    id: "1",
    name: "Margherita Pizza",
    description:
      "Classic Italian pizza with fresh tomatoes, mozzarella cheese, and basil on a thin, crispy crust. Made with locally sourced ingredients and baked in our wood-fired oven.",
    price: "14.99",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    ingredients: [
      "San Marzano tomatoes",
      "Fresh mozzarella",
      "Basil leaves",
      "Extra virgin olive oil",
      "Sea salt",
    ],
    dietaryInfo: ["Vegetarian", "Contains gluten", "Contains dairy"],
  },
}: DishModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-[95%] sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sm:text-left">
          <DialogTitle
            className="text-xl md:text-2xl font-bold"
            dangerouslySetInnerHTML={{
              __html: dish.name.replace(/\n/g, "<br/>"),
            }}
          ></DialogTitle>
          {dish.subtitle && (
            <p
              className="text-gray-500 text-sm mt-1"
              dangerouslySetInnerHTML={{
                __html: dish.subtitle.replace(/\n/g, "<br/>"),
              }}
            ></p>
          )}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">閉じる</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
          <div className="overflow-hidden h-[200px] sm:h-[300px] md:h-[400px]">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-semibold">
                  ¥{dish.price}
                </span>
              </div>

              <p
                className="text-gray-700 text-sm md:text-base mb-4 md:mb-6"
                dangerouslySetInnerHTML={{
                  __html: (
                    dish.description ||
                    "A delicious dish made with the finest ingredients."
                  ).replace(/\n/g, "<br/>"),
                }}
              ></p>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium mb-1 md:mb-2">
                    Ingredients 🍕 材料 🍕 재료
                  </h3>
                  <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                    {typeof dish.ingredients === "string" && dish.ingredients
                      ? dish.ingredients.split(",").map((ingredient, index) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-2">•</span>
                            {ingredient.trim()}
                          </li>
                        ))
                      : Array.isArray(dish.ingredients) &&
                        dish.ingredients?.map((ingredient, index) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-2">•</span>
                            {ingredient}
                          </li>
                        ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8">
              <Button className="w-full" size="lg">
                注文に追加
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishModal;
