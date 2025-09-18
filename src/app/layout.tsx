import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Toast notifications
import { AuthProvider } from "@/contexts/AuthContext";

// Configure the font
const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "TravelMate.lk",
  description: "AI-Powered Comprehensive Travel Planner for Sri Lanka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font class to the body */}
  <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}