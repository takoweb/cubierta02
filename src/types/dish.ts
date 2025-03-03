export interface Dish {
  id: string;
  name: string;
  image: string;
  subtitle?: string;
  description?: string;
  price?: string;
  category?: string;
  ingredients?: string;
}

export const defaultDishes: Dish[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: "12.99",
    category: "Pizza",
  },
  {
    id: "2",
    name: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
    description:
      "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    price: "8.99",
    category: "Salads",
  },
  {
    id: "3",
    name: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    description: "Pasta with eggs, cheese, pancetta, and black pepper",
    price: "14.99",
    category: "Pasta",
  },
];
