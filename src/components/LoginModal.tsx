import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import Logo from "./ui/logo";
import LoginForm from "./LoginForm";

interface LoginModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLogin?: (credentials: { username: string; password: string }) => void;
}

const LoginModal = ({
  isOpen = true,
  onOpenChange = () => {},
  onLogin = () => console.log("Login attempted"),
}: LoginModalProps) => {
  const handleLoginSuccess = () => {
    onLogin({ username: "stefano", password: "admin6044" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            スタッフログイン
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <LoginForm onSuccess={handleLoginSuccess} showIcons={true} />
        </div>

        <DialogFooter>
          <div className="text-center text-sm text-gray-500 w-full">
            <p>スタッフ専用アクセス</p>
            <p className="mt-1">
              ログイン認証情報については管理者にお問い合わせください
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
