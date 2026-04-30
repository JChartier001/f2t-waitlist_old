import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "./app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farm2Table — Vendor Portal",
  description: "Vendor portal for Farm2Table.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
