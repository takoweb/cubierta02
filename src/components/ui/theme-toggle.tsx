import React from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <Button variant="outline" size="icon" onClick={onToggle}>
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
};

export default ThemeToggle;
