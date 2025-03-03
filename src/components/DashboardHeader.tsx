import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  onLogout?: () => void;
}

const DashboardHeader = ({
  title = "メニューダッシュボード",
  onLogout = () => console.log("Logout clicked"),
}: DashboardHeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          <span>ログアウト</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
