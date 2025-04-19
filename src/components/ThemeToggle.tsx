import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="size-[50px] rounded-full bg-secondary text-contrast p-3"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === "dark" && <Moon className="size-full" />}
            {theme === "light" && <Sun className="size-full" />}
        </button>
    );
};

export default ThemeToggle;
