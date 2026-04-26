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
  const [mode, setMode] = useState("search");
  const [comment, setComment] = useState("")



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
      alert(data.error || data.message || "登録失敗");
    }
  };




  return (
    <main style={{ padding: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>近くの余り材</h1>

      <p style={{ fontSize: 17, color: "#555", marginBottom: 20 }}>
        余った材料を、近くの現場同士で活用できます。
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setMode("search")}
          style={{
            flex: 1,
            padding: "14px",
            fontSize: 16,
            fontWeight: "bold",
            borderRadius: 10,
            border: mode === "search" ? "none" : "1px solid #ccc",
            background: mode === "search" ? "#0f766e" : "white",
            color: mode === "search" ? "white" : "#0f766e",
          }}
        >
          探す
        </button>

        <button
          onClick={() => setMode("register")}
          style={{
            flex: 1,
            padding: "14px",
            fontSize: 16,
            fontWeight: "bold",
            borderRadius: 10,
            border: mode === "register" ? "none" : "1px solid #ccc",
            background: mode === "register" ? "#0f766e" : "white",
            color: mode === "register" ? "white" : "#0f766e",
          }}
        >
          登録する
        </button>
      </div>

      {mode === "search" && (
        <>
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
        </>
      )}


      {mode === "register" && (
        <>

          <div style={{ marginTop: "24px", padding: "16px", border: "1px solid #ddd", borderRadius: "12px" }}>
            <h2>余り材登録</h2>

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



            <label style={{ fontWeight: "bold" }}>数量</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}



            />



            <label style={{ fontWeight: "bold" }}>コメント（自由）</label>
            <input
              placeholder="例：30mmです、未使用、屋内保管"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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

            <button
              onClick={handleRegister}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: 18,
                fontWeight: "bold",
                background: "#0f766e",
                color: "white",
                border: "none",
                borderRadius: 10,
                marginTop: 12,
                cursor: "pointer"
              }}
            >
              登録する
            </button>
          </div>

        </>
      )}

      {mode === "search" && (
        <div style={{ display: "grid", gap: 16 }}>
          <p style={{ color: "#666", fontSize: 16 }}>
            近くの余り材を検索してください。
          </p>

          <p style={{ color: "#999", fontSize: 14 }}>
            現在登録された材料はまだありません。
          </p>
        </div>
      )}
    </main >
  );
}