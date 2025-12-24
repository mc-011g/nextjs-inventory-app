import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./context/ToastContext";
import { FirebaseAuthProvider } from "@/components/FirebaseAuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DropdownProvider } from "./context/DropdownContext";
import { NavbarProvider } from "./context/NavbarContext";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"]
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
        className={`${sourceSans3.variable} antialiased relative`}
      >
        <FirebaseAuthProvider>
          <DropdownProvider>
            <ToastProvider>

              <NavbarProvider>
                <ProtectedRoute>
                  {children}
                </ProtectedRoute>
              </NavbarProvider>

            </ToastProvider>
          </DropdownProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
