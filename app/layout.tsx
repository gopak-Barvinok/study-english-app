import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import FooterWrapper from "@/components/FooterWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";

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
            <header>
              <HeaderWrapper/>
            </header>
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>
            <footer className="mt-auto inset-shadow-sm">
              <FooterWrapper />
            </footer>
        </Providers>
      </body>
    </html>
  );
}
