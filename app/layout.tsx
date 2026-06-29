import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import FooterWrapper from "@/components/FooterWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";
import { classNameBody, classNameMain } from "@/lib/classNames";

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
    <html lang="en" data-theme="night">
      <body className={classNameBody}>
        <Providers>
            <header>
              <HeaderWrapper/>
            </header>
            <main className={classNameMain}>
              {children}
            </main>
            <footer>
              <FooterWrapper />
            </footer>
        </Providers>
      </body>
    </html>
  );
}
