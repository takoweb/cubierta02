import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Dish } from "../types/dish";

interface MenuManagerProps {
  dishes?: Dish[];
  onAddDish?: (dish: Omit<Dish, "id">) => void;
  onEditDish?: (dish: Dish) => void;
  onDeleteDish?: (id: string) => void;
}

const MenuManager = ({
  dishes = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: "12.99",
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Pizza",
    },
    {
      id: "2",
      name: "Caesar Salad",
      description:
        "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
      price: "8.99",
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Salads",
    },
    {
      id: "3",
      name: "Spaghetti Carbonara",
      description: "Pasta with eggs, cheese, pancetta, and black pepper",
      price: "14.99",
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Pasta",
    },
  ],
  onAddDish = () => {},
  onEditDish = () => {
    return true;
  },
  onDeleteDish = () => {},
}: MenuManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [newDish, setNewDish] = useState<Omit<Dish, "id">>({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Pizza",
    subtitle: "",
    ingredients: "",
  });

  const categories = ["All", "Pizza", "Pasta", "Salads", "Desserts", "Drinks"];

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeTab === "all" ||
      dish.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddDish = () => {
    onAddDish(newDish);
    setNewDish({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "Pizza",
      subtitle: "",
      ingredients: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditDish = () => {
    if (editingDish) {
      const success = onEditDish(editingDish);
      if (success) {
        setEditingDish(null);
      }
    }
  };

  const handleDeleteDish = (id: string) => {
    onDeleteDish(id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">メニュー管理</h2>
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                新しい料理を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新しい料理を追加</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="name" className="text-right pt-2">
                    名前
                  </Label>
                  <Textarea
                    id="name"
                    value={newDish.name}
                    onChange={(e) =>
                      setNewDish({ ...newDish, name: e.target.value })
                    }
                    className="col-span-3"
                    rows={2}
                    placeholder="料理名を入力してください。書式設定には改行を使用してください。"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="subtitle" className="text-right pt-2">
                    サブタイトル
                  </Label>
                  <Textarea
                    id="subtitle"
                    value={newDish.subtitle || ""}
                    onChange={(e) =>
                      setNewDish({ ...newDish, subtitle: e.target.value })
                    }
                    className="col-span-3"
                    rows={2}
                    placeholder="料理のサブタイトルを入力してください（任意）。書式設定には改行を使用してください。"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="ingredients" className="text-right pt-2">
                    材料
                  </Label>
                  <Textarea
                    id="ingredients"
                    value={newDish.ingredients || ""}
                    onChange={(e) =>
                      setNewDish({ ...newDish, ingredients: e.target.value })
                    }
                    className="col-span-3"
                    rows={3}
                    placeholder="材料をコンマで区切って入力してください（例：トマト、モッツァレラ、バジル）"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    説明
                  </Label>
                  <Textarea
                    id="description"
                    value={newDish.description}
                    onChange={(e) =>
                      setNewDish({ ...newDish, description: e.target.value })
                    }
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    価格 (¥)
                  </Label>
                  <Input
                    id="price"
                    value={newDish.price}
                    onChange={(e) =>
                      setNewDish({ ...newDish, price: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    カテゴリー
                  </Label>
                  <select
                    id="category"
                    value={newDish.category}
                    onChange={(e) =>
                      setNewDish({ ...newDish, category: e.target.value })
                    }
                    className="col-span-3 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories
                      .filter((cat) => cat !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="image-upload" className="text-right pt-2">
                    画像
                  </Label>
                  <div className="col-span-3 space-y-4">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewDish({
                              ...newDish,
                              image: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    {newDish.image && (
                      <div className="mt-4 border">
                        <p className="text-sm text-gray-500 mb-2 px-2 pt-2">
                          画像プレビュー：
                        </p>
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={newDish.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/600x400?text=Image+Error";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddDish}>
                  料理を追加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="料理を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden border">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3
                    className="font-semibold text-lg"
                    dangerouslySetInnerHTML={{
                      __html: dish.name.replace(/\n/g, "<br/>"),
                    }}
                  ></h3>
                  {dish.subtitle && (
                    <p
                      className="text-sm text-muted-foreground mb-1"
                      dangerouslySetInnerHTML={{
                        __html: dish.subtitle.replace(/\n/g, "<br/>"),
                      }}
                    ></p>
                  )}
                  <p
                    className="text-sm text-muted-foreground line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: (dish.description || "").replace(/\n/g, "<br/>"),
                    }}
                  ></p>
                </div>
                <div className="font-bold">¥{dish.price}</div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs bg-slate-100 px-2 py-1">
                  {dish.category}
                </span>
                <div className="flex gap-2">
                  <Dialog
                    open={editingDish?.id === dish.id}
                    onOpenChange={(open) => {
                      if (!open) setEditingDish(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingDish(dish)}
                      >
                        <Pencil size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>料理を編集</DialogTitle>
                      </DialogHeader>
                      {editingDish && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditDish();
                          }}
                          className="grid gap-4 py-4"
                        >
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label
                              htmlFor="edit-name"
                              className="text-right pt-2"
                            >
                              名前
                            </Label>
                            <Textarea
                              id="edit-name"
                              value={editingDish.name}
                              onChange={(e) =>
                                setEditingDish({
                                  ...editingDish,
                                  name: e.target.value,
                                })
                              }
                              className="col-span-3"
                              rows={2}
                              placeholder="料理名を入力してください。書式設定には改行を使用してください。"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label
                              htmlFor="edit-subtitle"
                              className="text-right pt-2"
                            >
                              サブタイトル
                            </Label>
                            <Textarea
                              id="edit-subtitle"
                              value={editingDish.subtitle || ""}
                              onChange={(e) =>
                                setEditingDish({
                                  ...editingDish,
                                  subtitle: e.target.value,
                                })
                              }
                              placeholder="料理のサブタイトルを入力してください（任意）。書式設定には改行を使用してください。"
                              className="col-span-3"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label
                              htmlFor="edit-ingredients"
                              className="text-right pt-2"
                            >
                              材料
                            </Label>
                            <Textarea
                              id="edit-ingredients"
                              value={editingDish.ingredients || ""}
                              onChange={(e) =>
                                setEditingDish({
                                  ...editingDish,
                                  ingredients: e.target.value,
                                })
                              }
                              className="col-span-3"
                              rows={3}
                              placeholder="材料をコンマで区切って入力してください（例：トマト、モッツァレラ、バジル）"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label
                              htmlFor="edit-description"
                              className="text-right pt-2"
                            >
                              説明
                            </Label>
                            <Textarea
                              id="edit-description"
                              value={editingDish.description}
                              onChange={(e) =>
                                setEditingDish({
                                  ...editingDish,
                                  description: e.target.value,
                                })
                              }
                              className="col-span-3"
                              rows={6}
                              placeholder="料理の説明を入力してください。書式設定には改行を使用してください。"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-price" className="text-right">
                              価格 (¥)
                            </Label>
                            <Input
                              id="edit-price"
                              value={editingDish.price}
                              onChange={(e) =>
                                setEditingDish({
                                  ...editingDish,
                                  price: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-category"
                              className="text-right"
                            >
                              カテゴリー
                            </Label>
                            <select
                              id="edit-category"
                              value={editingDish.category}
                              onChange={(e) =>
                                setEditingDish({
                                  ...editingDish,
                                  category: e.target.value,
                                })
                              }
                              className="col-span-3 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {categories
                                .filter((cat) => cat !== "All")
                                .map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label
                              htmlFor="edit-image-upload"
                              className="text-right pt-2"
                            >
                              画像
                            </Label>
                            <div className="col-span-3 space-y-4">
                              <Input
                                id="edit-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setEditingDish({
                                        ...editingDish,
                                        image: reader.result as string,
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />

                              {editingDish.image && (
                                <div className="mt-4 border">
                                  <p className="text-sm text-gray-500 mb-2 px-2 pt-2">
                                    画像プレビュー：
                                  </p>
                                  <div className="aspect-video w-full overflow-hidden">
                                    <img
                                      src={editingDish.image}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "https://placehold.co/600x400?text=Image+Error";
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button type="submit">変更を保存</Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>よろしいですか？</AlertDialogTitle>
                        <AlertDialogDescription>
                          この操作は元に戻せません。メニューから料理が完全に
                          削除されます。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDish(dish.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          削除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-12 border">
          <p className="text-muted-foreground">
            料理が見つかりません。検索条件を調整するか、新しい料理を追加してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
