import type { Metadata } from "next";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "publicApiFetch",
  description: "Next.js + TanStack Query + Chakra UI + Zod",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
