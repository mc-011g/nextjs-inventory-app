import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./context/ToastContext";
import { FirebaseAuthProvider } from "@/components/FirebaseAuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DropdownProvider } from "./context/DropdownContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJS Inventory App",
  description: "An inventory management app that allows users to manage their own inventory, tracking products, categories, orders, and displaying metrics.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <FirebaseAuthProvider>
          <DropdownProvider>
            <ToastProvider>

              <ProtectedRoute>
                {children}
              </ProtectedRoute>

            </ToastProvider>
          </DropdownProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
