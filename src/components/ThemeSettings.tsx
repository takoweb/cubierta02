import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Settings, Upload } from "lucide-react";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl: string;
  headerFontColor: string;
  textFontColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

interface ThemeSettingsProps {
  onSave: (settings: ThemeSettings) => void;
  initialSettings?: Partial<ThemeSettings>;
}

const defaultSettings: ThemeSettings = {
  primaryColor: "#1e293b", // slate-800
  secondaryColor: "#f8fafc", // slate-50
  accentColor: "#0ea5e9", // sky-500
  fontFamily: "'Inter', sans-serif",
  logoUrl: "/vite.svg",
  headerFontColor: "#1e293b", // slate-800
  textFontColor: "#475569", // slate-600
  buttonColor: "#0ea5e9", // sky-500
  buttonTextColor: "#ffffff", // white
};

const ThemeSettings = ({
  onSave,
  initialSettings = {},
}: ThemeSettingsProps) => {
  const [settings, setSettings] = useState<ThemeSettings>({
    ...defaultSettings,
    ...initialSettings,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({
          ...prev,
          logoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Try to save to Supabase first
      const { updateThemeSettings } = await import("../services/themeService");
      await updateThemeSettings(settings);

      // Call the onSave callback
      onSave(settings);
    } catch (error) {
      console.error("Error saving theme settings:", error);
      // Still call onSave to handle localStorage fallback
      onSave(settings);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings size={16} />
          テーマ設定
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>レストランテーマ設定</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="colors">色</TabsTrigger>
            <TabsTrigger value="typography">文字</TabsTrigger>
            <TabsTrigger value="branding">ブランディング</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">プライマリカラー</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.primaryColor}
                    name="primaryColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">セカンダリカラー</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.secondaryColor}
                    name="secondaryColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">アクセントカラー</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    name="accentColor"
                    type="color"
                    value={settings.accentColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.accentColor}
                    name="accentColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonColor">ボタンの色</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonColor"
                    name="buttonColor"
                    type="color"
                    value={settings.buttonColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.buttonColor}
                    name="buttonColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">フォントファミリー</Label>
                <select
                  id="fontFamily"
                  name="fontFamily"
                  value={settings.fontFamily}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      fontFamily: e.target.value,
                    }))
                  }
                  className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="'Inter', sans-serif">Inter</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                  <option value="'Playfair Display', serif">
                    Playfair Display
                  </option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Lato', sans-serif">Lato</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Raleway', sans-serif">Raleway</option>
                  <option value="'Oswald', sans-serif">Oswald</option>
                  <option value="'Merriweather', serif">Merriweather</option>
                  <option value="'Lora', serif">Lora</option>
                  <option value="'Nunito', sans-serif">Nunito</option>
                  <option value="'Quicksand', sans-serif">Quicksand</option>
                  <option value="'Dancing Script', cursive">
                    Dancing Script
                  </option>
                  <option value="'Pacifico', cursive">Pacifico</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headerFontColor">ヘッダーフォントの色</Label>
                <div className="flex gap-2">
                  <Input
                    id="headerFontColor"
                    name="headerFontColor"
                    type="color"
                    value={settings.headerFontColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.headerFontColor}
                    name="headerFontColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textFontColor">テキストフォントの色</Label>
                <div className="flex gap-2">
                  <Input
                    id="textFontColor"
                    name="textFontColor"
                    type="color"
                    value={settings.textFontColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.textFontColor}
                    name="textFontColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">ボタンテキストの色</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonTextColor"
                    name="buttonTextColor"
                    type="color"
                    value={settings.buttonTextColor}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.buttonTextColor}
                    name="buttonTextColor"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 border rounded-md">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: settings.headerFontColor }}
              >
                文字プレビュー
              </h3>
              <p
                className="mb-2"
                style={{
                  color: settings.textFontColor,
                  fontFamily: settings.fontFamily,
                }}
              >
                これはウェブサイト上でのテキストの表示方法です。フォント
                ファミリーは {settings.fontFamily.split("'")[1]}{" "}
                に設定されています。
              </p>
              <Button
                style={{
                  backgroundColor: settings.buttonColor,
                  color: settings.buttonTextColor,
                }}
              >
                サンプルボタン
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUpload">レストランロゴ</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center bg-slate-50">
                    {settings.logoUrl && (
                      <img
                        src={settings.logoUrl}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-gray-200"></div>
                      <span className="text-sm text-gray-500">または</span>
                      <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <Input
                      type="text"
                      placeholder="ロゴURLを入力"
                      value={
                        typeof settings.logoUrl === "string" &&
                        !settings.logoUrl.startsWith("data:")
                          ? settings.logoUrl
                          : ""
                      }
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          logoUrl: e.target.value,
                        }))
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleReset}>
            デフォルトにリセット
          </Button>
          <Button onClick={handleSave}>変更を保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSettings;
