"use client";
import { useState } from "react";

export default function StockPage() {
  const [search, setSearch] = useState("");

  const [address, setAddress] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("siteAddress") || ""
      : ""
  );

  const [material, setMaterial] = useState("");
  const [spec, setSpec] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")



  const handleRegister = async () => {
    const formData = new FormData();

    formData.append("address", address);
    formData.append("material", material);
    formData.append("spec", spec);
    formData.append("quantity", quantity);
    formData.append("deadline", deadline);

    if (photo) {
      formData.append("photo", photo);
    }

    const res = await fetch("/api/add-stock", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("登録できました");
    } else {
      alert("失敗");
    }
  };
  const stockItems = [
    {
      site: "杉並A現場",
      area: "杉並区",
      distance: "徒歩7分",
      distanceMinutes: 7,
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
      distanceMinutes: 10,
      material: "スタイロフォーム 30mm",
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
      distanceMinutes: 12,
      material: "軽天材",
      spec: "65",
      quantity: "30本",
      pickup: "明日引取可",
      note: "一部使用済みあり",
    },
  ];

  const filteredItems = stockItems
    .filter((item) =>
      (item.material + (item.keywords || "") + item.spec)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => a.distanceMinutes - b.distanceMinutes);

  return (
    <main style={{ padding: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>近くのストック材</h1>

      <p style={{ fontSize: 17, color: "#555", marginBottom: 20 }}>
        欲しい材料を検索できます。
      </p>

      <input
        type="text"
        placeholder="例：スタイロ"
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

      <div style={{ marginTop: "24px", padding: "16px", border: "1px solid #ddd", borderRadius: "12px" }}>
        <h2>ストック材登録</h2>

        <label style={{ fontWeight: "bold" }}>住所</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

        <label style={{ fontWeight: "bold" }}>材料名</label>
        <input
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

        <label style={{ fontWeight: "bold" }}>規格</label>

        <select
          onChange={(e) => setSpec(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "8px",
            padding: "8px"
          }}
        >
          <option value="">よくある候補を選択</option>

          {(material.includes("スタイロ") ||
            material.includes("カネライト") ||
            material.includes("ミラフォーム")) && (
              <>
                <option value="30mm 910×1820">30mm 910×1820</option>
                <option value="40mm 910×1820">40mm 910×1820</option>
                <option value="50mm 910×1820">50mm 910×1820</option>
              </>
            )}

          {material.includes("コンパネ") && (
            <>
              <option value="3×6 12mm">3×6 12mm</option>
              <option value="3×6 15mm">3×6 15mm</option>
            </>
          )}

          {(material.includes("スリット")) && (
            <>
              <option value="鉛直スリット">鉛直スリット</option>
              <option value="平行スリット">平行スリット</option>
            </>
          )}

          {(material.includes("軽天") ||
            material.includes("LGS") ||
            material.includes("下地")) && (
              <>
                <option value="65型3m">65型3m</option>
                <option value="65型4m">65型4m</option>
              </>
            )}

          {(material.includes("PB") ||
            material.includes("石膏ボード") ||
            material.includes("ボード")) && (
              <>
                <option value="9.5mm">9.5mm</option>
                <option value="12.5mm">12.5mm</option>
              </>
            )}
        </select>

        <input
          placeholder="候補にない場合は自由入力"
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "8px"
          }}
        />

        <label style={{ fontWeight: "bold" }}>個数</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

        <label style={{ fontWeight: "bold" }}>写真（任意）</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setPhoto(file)

            if (file) {
              setPhotoPreview(URL.createObjectURL(file))
            }
          }}
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "8px"
          }}
        />

        {photoPreview && (
          <img
            src={photoPreview}
            alt="preview"
            style={{
              width: "100%",
              maxWidth: "300px",
              marginBottom: "12px",
              borderRadius: "8px"
            }}
          />
        )}

        <label style={{ fontWeight: "bold" }}>引取期限</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

        <button onClick={handleRegister}>
          登録する
        </button>
      </div>

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