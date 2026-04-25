import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "TaskFlow";

export const metadata: Metadata = {
  title: `${appName} | Simple Full-Stack Task Manager`,
  description: "A polished full-stack task manager with authentication, CRUD APIs, and local SQLite storage."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
