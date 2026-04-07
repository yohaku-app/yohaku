"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CompletedItem = {
  text: string;
  completedAt: string;
}

export default function DonePage() {
  const [completedList, setCompletedList] = useState<CompletedItem[]>([]);

  useEffect(() => {
    const savedCompletedList = localStorage.getItem("completedList");
    if (savedCompletedList) {
      setCompletedList(JSON.parse(savedCompletedList));
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#3b82f6",
            margin: 0,
          }}
        >
          完了済み一覧
        </h1>


      </div>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          background: "#fafafa",
        }}
      >
        {completedList.length === 0 ? (
          <div style={{ color: "#666" }}>まだありません</div>
        ) : (
          completedList.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "#f3f4f6",
                color: "#555",
                lineHeight: 1.8,
              }}
            >
              <div style={{ marginBottom: 6 }}>
                {typeof item === "string" ? item : item.text}
              </div>

              {typeof item !== "string" && item.completedAt && (
                <div style={{ fontSize: 12, color: "#666" }}>
                  完了日：{new Date(item.completedAt).toLocaleString("ja-JP")}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}