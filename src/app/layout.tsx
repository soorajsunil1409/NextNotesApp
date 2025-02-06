import "./globals.css"
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-primary text-white overflow-hidden">

        <Navbar />

        {children}
      </body>
    </html>
  );
}
