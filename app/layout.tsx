// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider" // ✅ import
import { BackgroundMusic } from "@/components/BackgroundMusic" // ✅ Import
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Life RPG",
  description: "Turn your life into a game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        {/* ✅ ครอบ ThemeProvider ไว้ตรงนี้ */}
        <ThemeProvider
            attribute="class"
            defaultTheme="dark" // ค่าเริ่มต้นเป็น Dark (เปลี่ยนเป็น system หรือ light ได้)
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <BackgroundMusic />
        </ThemeProvider>
      </body>
    </html>
  );
}