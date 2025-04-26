// File: src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/header";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { HistorySidebar } from "@/components/history-sidebar";
import { ChatHistoryProvider } from "@/components/chat-history-context";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "AI Chatbot";
const description = "A fully open-source AI-powered chatbot with a generative UI.";

export const metadata: Metadata = {
  metadataBase: new URL("http://rabbi.work"),
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChatHistoryProvider>
            <div className="flex">
              <HistorySidebar />
              <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </ChatHistoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}