import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "YOHAKU",
  description: "現場の段取り予報",
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YOHAKU",
  },

  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="apple-touch-startup-image"
          href="/startup.png"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <div style={{ paddingBottom: 90 }}>
          {children}
        </div>

        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            borderTop: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            段取り予報
          </Link>

          <Link
            href="/tasks"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            やること
          </Link>

        

          <Link
            href="/stock"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            余り材
          </Link>


          <Link
            href="/failure"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            失敗記録
          </Link>




        </nav>
        <Analytics />
      </body>
    </html>
  );
}