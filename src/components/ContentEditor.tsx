import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { FileEdit } from "lucide-react";

interface ContentEditorProps {
  onSave: (content: ContentSettings) => void;
  initialContent?: ContentSettings;
}

export interface ContentSettings {
  pageTitle: string;
  pageDescription: string;
  footerText: string;
}

const defaultContent: ContentSettings = {
  pageTitle: "メニュー",
  pageDescription:
    "最高の食材で作られた美味しい料理の数々をご覧ください。すべての料理は、特別な食事体験を提供するために丁寧に作られています。",
  footerText: "Cubierta. 全著作権所有。",
};

const ContentEditor = ({
  onSave,
  initialContent = defaultContent,
}: ContentEditorProps) => {
  const [content, setContent] = useState<ContentSettings>(initialContent);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    try {
      // Try to save to Supabase first
      const { updatePageContent } = await import("../services/contentService");
      const success = await updatePageContent(content);

      // Always save to localStorage as fallback
      localStorage.setItem("restaurantContent", JSON.stringify(content));

      // Call the onSave callback
      onSave(content);
      setOpen(false);

      if (!success) {
        console.warn(
          "Failed to save content to Supabase, but saved to localStorage",
        );
      }
    } catch (error) {
      console.error("Error saving content:", error);
      // Fallback to localStorage only
      localStorage.setItem("restaurantContent", JSON.stringify(content));
      onSave(content);
      setOpen(false);
    }
  };

  const handleReset = () => {
    setContent(defaultContent);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileEdit size={16} />
          コンテンツを編集
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ページコンテンツを編集</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pageTitle">ページタイトル</Label>
            <Input
              id="pageTitle"
              name="pageTitle"
              value={content.pageTitle}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pageDescription">ページ説明</Label>
            <Textarea
              id="pageDescription"
              name="pageDescription"
              value={content.pageDescription}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerText">フッターテキスト</Label>
            <Input
              id="footerText"
              name="footerText"
              value={content.footerText}
              onChange={handleChange}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-2">プレビュー：</h3>
            <div className="space-y-2">
              <h4 className="text-lg font-bold">{content.pageTitle}</h4>
              <p className="text-sm text-gray-600">{content.pageDescription}</p>
              <div className="text-xs text-gray-500 pt-2 border-t mt-2">
                &copy; {new Date().getFullYear()} {content.footerText}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            デフォルトにリセット
          </Button>
          <Button onClick={handleSave}>変更を保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditor;
