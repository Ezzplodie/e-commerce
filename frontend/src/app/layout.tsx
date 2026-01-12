import "@/shared/styles/normalize.css";
import "@/shared/styles/variables.css";
import "@/shared/styles/globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "My App",
  description: "Next.js app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
