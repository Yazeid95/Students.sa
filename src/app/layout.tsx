import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "SEU Majors Portal - Your Future Starts Here",
  description: "Discover your potential with SEU's comprehensive academic programs across 4 colleges and 12+ majors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-gradient-dark min-h-screen`}>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="pt-20">
              {children}
            </main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
