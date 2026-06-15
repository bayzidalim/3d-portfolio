import "../index.css";
import React from "react";

export const metadata = {
  title: "Bayzid Alim - Full Stack Web Developer",
  description: "Portfolio of Bayzid Alim",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
