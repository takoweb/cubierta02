import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useTheme } from "../context/ThemeContext";
import { Menu } from "lucide-react";
import Logo from "./ui/logo";
import LoginForm from "./LoginForm";
import { isAuthenticated } from "../utils/auth";

interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
  onLoginSuccess?: (isAuthenticated: boolean) => void;
}

const Navbar = ({
  logoSrc,
  logoAlt = "レストランロゴ",
  onLoginSuccess = () => {},
}: NavbarProps) => {
  const { theme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    onLoginSuccess(true);
    setIsLoginOpen(false);
    setIsUserAuthenticated(true);
    window.location.href = "/dashboard";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className="w-full border-b border-gray-100 shadow-sm px-4 md:px-6 py-4 md:py-0 md:h-20 flex flex-col md:flex-row items-center justify-between relative bg-white"
      style={{ backgroundColor: theme.secondaryColor }}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <a href="/" className="flex items-center">
          <Logo src={logoSrc} alt={logoAlt} size="medium" />
        </a>
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <div
          className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0 transition-all duration-300 ease-in-out`}
        >
          {isUserAuthenticated ? (
            <Link to="/dashboard" className="w-full md:w-auto">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                style={{
                  borderColor: theme.buttonColor,
                  color: theme.buttonColor,
                }}
              >
                ダッシュボードに戻る
              </Button>
            </Link>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  style={{
                    borderColor: theme.buttonColor,
                    color: theme.buttonColor,
                  }}
                >
                  スタッフログイン
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto">
                <div className="flex justify-center mb-4">
                  <Logo src={logoSrc} alt={logoAlt} size="large" />
                </div>
                <DialogHeader>
                  <DialogTitle>スタッフログイン</DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                  <LoginForm onSuccess={handleLoginSuccess} />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
