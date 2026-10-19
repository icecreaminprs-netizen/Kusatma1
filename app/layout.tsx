import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuşatma | Parkur Kulesi",
  description: "Zombilerle dolu 40 katlı kulede arkadaşlarınla hayatta kal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
