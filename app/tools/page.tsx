"use client";

import { useState } from "react";

export default function ToolsPage() {
    const [toolName, setToolName] = useState("");
    const [place, setPlace] = useState("");
    const [memo, setMemo] = useState("");

    const toolUrl =
        typeof window !== "undefined" && toolName
            ? `${window.location.origin}/tools?name=${encodeURIComponent(toolName)}`
            : "";

    const qrUrl = toolUrl
        ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
            toolUrl
        )}`
        : "";

    return (
        <main style={{ padding: 24, paddingBottom: 100 }}>
            <div className="no-print">
                <h1 style={{ fontSize: 34, marginBottom: 8 }}>道具QR管理</h1>

                <p style={{ fontSize: 17, color: "#555", marginBottom: 24 }}>
                    道具にQRコードを貼って、保管場所を確認できます。
                </p>

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 16,
                        padding: 18,
                    }}
                >
                    <label style={{ fontWeight: "bold" }}>道具名</label>
                    <input
                        value={toolName}
                        onChange={(e) => setToolName(e.target.value)}
                        placeholder="例：インパクトドライバー"
                        style={{
                            width: "100%",
                            padding: 12,
                            fontSize: 16,
                            marginBottom: 16,
                        }}
                    />

                    <label style={{ fontWeight: "bold" }}>保管場所</label>
                    <input
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        placeholder="例：資材置き場A棚"
                        style={{
                            width: "100%",
                            padding: 12,
                            fontSize: 16,
                            marginBottom: 16,
                        }}
                    />

                    <label style={{ fontWeight: "bold" }}>メモ</label>
                    <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="例：使用後は充電器横に戻す"
                        style={{
                            width: "100%",
                            padding: 12,
                            fontSize: 16,
                            minHeight: 100,
                            marginBottom: 16,
                        }}
                    />
                </div>
            </div>

            {toolName && (
                <div className="print-area">
                    <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>{toolName}</h2>

                    {qrUrl && (
                        <img
                            src={qrUrl}
                            alt="QRコード"
                            style={{
                                width: 120,
                                height: 120,
                            }}
                        />
                    )}

                    <p style={{ fontSize: 12, margin: "6px 0 0" }}>
                        {place || "保管場所未入力"}
                    </p>

                    {memo && (
                        <p style={{ fontSize: 11, margin: "4px 0 0" }}>{memo}</p>
                    )}

                    <button
                        className="no-print"
                        onClick={() => window.print()}
                        style={{
                            width: "100%",
                            padding: 14,
                            fontSize: 16,
                            fontWeight: "bold",
                            background: "#111",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            marginTop: 12,
                        }}
                    >
                        印刷する
                    </button>
                </div>
            )}
        </main>
    );
}