"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchStore } from "@/stores/useSearchStore";
import { Moon, Sun, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

const Navbar = () => {
    const { data: session, status } = useSession();
    const { query, setQuery } = useSearchStore();
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const { theme, setTheme } = useTheme();

    const handleSignIn = () => {
        signIn("google");
    };

    return (
        <div className="p-8 px-10 flex text-center justify-between items-center">
            <div className="text-2xl flex text-primary">
                <div className="font-bold">Note</div>Keeper
            </div>
            <input
                type="text"
                className="p-3 px-6 bg-secondary w-[300px] outline-0 text-primary rounded-3xl"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex gap-3">
                {status === "authenticated" ? (
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            className="size-[50px] cursor-pointer bg-secondary text-primary rounded-full overflow-hidden"
                        >
                            <Image
                                src={`${session?.user?.image}`}
                                height={50}
                                width={50}
                                alt="sdf"
                            />
                        </div>
                    </div>
                ) : (
                    <button
                        className="rounded-2xl text-primary"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                    >
                        <UserCircle2 className="size-[50px] font-thin" />
                    </button>
                )}
                {isProfileOpen && (
                    <div className="shadow-md dark:shadow-gray-800/30 bg-card text-card-foreground absolute h-max z-50 right-10 top-[90px] rounded-lg w-48 overflow-hidden border border-border">
                        {session?.user && (
                            <div className="cursor-pointer text-start p-3 border-b border-border  hover:bg-secondary hover:text-primary transition-colors">
                                {session.user?.name}
                            </div>
                        )}
                        <div
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="cursor-pointer text-start p-3 border-b border-border hover:bg-secondary hover:text-primary transition-colors flex items-center justify-between"
                        >
                            <span>Toggle Theme</span>
                            {theme === "dark" ? (
                                <Moon size={16} className="text-primary" />
                            ) : (
                                <Sun size={16} className="text-primary" />
                            )}
                        </div>
                        {status !== "authenticated" ? (
                            <div
                                onClick={handleSignIn}
                                className="cursor-pointer text-start p-3  hover:bg-secondary hover:text-primary transition-colors"
                            >
                                Sign In
                            </div>
                        ) : (
                            <div
                                onClick={() => signOut()}
                                className="cursor-pointer text-start p-3 hover:bg-secondary hover:text-primary transition-colors"
                            >
                                Sign Out
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Navbar;
