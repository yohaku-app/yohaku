"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  inputText: string;
  result: any;
  createdAt: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>
        履歴
      </h1>

      {history.length === 0 ? (
        <div>まだ履歴がありません</div>
      ) : (
        history.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              background: "#fafafa",
            }}
          >
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              {new Date(item.createdAt).toLocaleString("ja-JP")}
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong>入力：</strong>
              {item.inputText}
            </div>

            <div>
              <strong>結果：</strong>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {JSON.stringify(item.result, null, 2)}
              </pre>
            </div>
          </div>
        ))
      )}
    </main>
  );
}