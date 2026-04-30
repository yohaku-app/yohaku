"use client";

import { useState } from "react";

export default function ToolsPage() {
    const [toolName, setToolName] = useState("");
    const [place, setPlace] = useState("");
    const [memo, setMemo] = useState("");

    const toolUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/tools?name=${encodeURIComponent(toolName)}`
            : "";

    const qrUrl = toolUrl
        ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(toolUrl)}`
        : "";

    return (
        <main style={{ padding: 24, paddingBottom: 100 }}>
            <h1 style={{ fontSize: 34, marginBottom: 8 }}>道具QR管理</h1>

            <p style={{ fontSize: 17, color: "#555", marginBottom: 24 }}>
                道具にQRコードを貼って、保管場所や使用状況を確認できます。
            </p>

            <div className="no-print" style={{ border: "1px solid #ddd", borderRadius: 16, padding: 18 }}>
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
                        minHeight: 120,
                        marginBottom: 16,
                    }}
                />


            </div>

            {toolName && (
                <div className="print-area" style={{
                    marginTop: 24,
                    border: "1px solid #ddd",
                    borderRadius: 16,
                    padding: 18,
                    textAlign: "center",
                }}
                >
                    <h2>{toolName}</h2>
                    <p>保管場所：{place || "未入力"}</p>
                    <p>メモ：{memo || "なし"}</p>

                    {qrUrl && (
                        <img
                            src={qrUrl}
                            alt="QRコード"
                            style={{
                                width: 120,
                                height: 120,
                                marginTop: 16,
                                marginBottom: 16,
                            }}
                        />
                    )}

                    <button
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

                    <p style={{ wordBreak: "break-all", color: "#555", fontSize: 12 }}>
                        {toolUrl}
                    </p>
                </div>
            )
            }
        </main >
    );
}