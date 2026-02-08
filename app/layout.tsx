import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import TabBarWrapper from "@/components/TabBarWrapper";

export const metadata: Metadata = {
  title: "AI English Study App",
  description: "App to learning English",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>
            <footer className="inset-shadow-sm">
              <TabBarWrapper />
            </footer>
        </Providers>
      </body>
    </html>
  );
}
