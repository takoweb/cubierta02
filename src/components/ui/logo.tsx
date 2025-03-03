import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface LogoProps {
  src?: string;
  alt?: string;
  size?: "small" | "medium" | "large";
}

const Logo = ({ src, alt = "Restaurant Logo", size = "medium" }: LogoProps) => {
  const { theme } = useTheme();

  const sizeClasses = {
    small: "h-6 w-auto",
    medium: "h-10 w-auto",
    large: "h-16 w-auto",
  };

  return (
    <img src={src || theme.logoUrl} alt={alt} className={sizeClasses[size]} />
  );
};

export default Logo;
