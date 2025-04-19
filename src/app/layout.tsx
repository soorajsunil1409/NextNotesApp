"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import { NextAuthProvider } from "@/components/Providers";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans bg-background text-gray-800 overflow-x-hidden h-[100vh]">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                >
                    <NextAuthProvider>
                        {mounted && (
                            <div className="h-[100vh] flex flex-col w-[100vw]">
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={500}
                                    hideProgressBar
                                    newestOnTop
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss={false}
                                    draggable
                                    pauseOnHover={false}
                                    theme="light"
                                />
                                <Navbar />
                                {children}
                            </div>
                        )}
                    </NextAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
