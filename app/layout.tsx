import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
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
            href="/done"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            完了済み
          </Link>

          <Link
            href="/history"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            履歴
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
      </body>
    </html>
  );
}