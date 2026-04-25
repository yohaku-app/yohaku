export default function StockPage() {
  const stockItems = [
    {
      site: "杉並A現場",
      material: "コンパネ",
      spec: "3×6",
      quantity: 20,
      area: "杉並区",
      note: "余りあり",
    },
    {
      site: "中野B現場",
      material: "スタイロフォーム",
      spec: "30mm",
      quantity: 12,
      area: "中野区",
      note: "今週中引取可",
    },
    {
      site: "新宿C現場",
      material: "軽天材",
      spec: "65",
      quantity: 30,
      area: "新宿区",
      note: "一部使用済みあり",
    },
  ];

  return (
    <main style={{ padding: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 36, marginBottom: 12 }}>現場ストック</h1>

      <p style={{ fontSize: 18, color: "#555", marginBottom: 24 }}>
        現場ごとの余り材や在庫を確認するための試験版です。
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        {stockItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
              {item.material}
            </div>

            <div style={{ fontSize: 16, marginBottom: 4 }}>
              現場名: {item.site}
            </div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>
              規格: {item.spec}
            </div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>
              数量: {item.quantity}
            </div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>
              エリア: {item.area}
            </div>
            <div style={{ fontSize: 16, color: "#666" }}>
              備考: {item.note}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}