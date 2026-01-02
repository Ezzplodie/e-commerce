import type { ReactNode } from "react";
import "@/styles/normalize.css";
import "@/styles/globals.css";

export const metadata = {
  title: "My App",
  description: "Next.js app",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
