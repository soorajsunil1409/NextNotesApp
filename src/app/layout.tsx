import "./globals.css";
import Navbar from "../components/Navbar";
import { NextAuthProvider } from "@/components/Providers";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="font-sans bg-primary text-white overflow-hidden h-full w-full">
                <NextAuthProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={500}
                        limit={1}
                        newestOnTop
                    />
                    <Navbar />

                    {children}
                </NextAuthProvider>
            </body>
        </html>
    );
}
