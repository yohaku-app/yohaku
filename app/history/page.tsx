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
              <div style={{ marginTop: 8, lineHeight: 1.8 }}>
                <div><strong>緊急化率：</strong>{item.result.emergency_probability_percent}%</div>
                <div><strong>余分労働時間：</strong>{item.result.overtime_hours_expected}時間</div>
                <div><strong>想定損失：</strong>{item.result.loss_yen_expected}円</div>

                {item.result.missing_arrangements?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>先に押さえること：</strong>
                    <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                      {item.result.missing_arrangements.slice(0, 2).map((m: string, i: number) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.result.likely_issues?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>緊急化しそうなこと：</strong>
                    <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                      {item.result.likely_issues.slice(0, 3).map((m: string, i: number) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}



              </div>
            </div>
          </div>
        ))
      )}
    </main>
  );
}