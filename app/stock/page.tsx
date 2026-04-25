"use client";
import { useState } from "react";

export default function StockPage() {
  const [search, setSearch] = useState("");

  const stockItems = [
    {
      site: "杉並A現場",
      area: "杉並区",
      distance: "徒歩7分",
      material: "コンパネ",
      spec: "3×6",
      keywords: "コンパネ ベニヤ 合板 ラワン",
      quantity: "3枚",
      pickup: "今日引取可",
      note: "余りあり",
    },
    {
      site: "中野B現場",
      area: "中野区",
      distance: "徒歩10分",
      material: "スタイロフォーム30",
      keywords: "スタイロ カネライトフォーム ミラフォーム 断熱材 XPS",
      spec: "30mm",
      quantity: "5枚",
      pickup: "今週中",
      note: "屋内保管",
    },
    {
      site: "新宿C現場",
      area: "新宿区",
      distance: "徒歩12分",
      material: "軽天材",
      spec: "65",
      quantity: "30本",
      pickup: "明日引取可",
      note: "一部使用済みあり",
    },
  ];

  const filteredItems = stockItems.filter((item) =>
    (item.material + (item.keywords || "") + item.spec)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>近くの余り材 β</h1>

      <p style={{ fontSize: 17, color: "#555", marginBottom: 20 }}>
        欲しい材料を検索できます。
      </p>

      <input
        type="text"
        placeholder="例：スタイロ30"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 12,
          border: "1px solid #ccc",
          marginBottom: 20,
        }}
      />

      <div style={{ display: "grid", gap: 16 }}>
        {filteredItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: 16,
              padding: 18,
              background: "#fff",
            }}
          >
            <div style={{ color: "#0a7", fontWeight: "bold" }}>
              {item.area} / {item.distance}
            </div>

            <div style={{ fontSize: 26, fontWeight: "bold", marginTop: 8 }}>
              {item.material}
            </div>

            <div style={{ color: "#555", marginTop: 4 }}>
              {item.spec}・{item.quantity}
            </div>

            <div style={{ marginTop: 10 }}>{item.pickup}</div>

            <div style={{ marginTop: 10, color: "#666" }}>
              現場：{item.site}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}