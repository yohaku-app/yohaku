"use client";

import { useState } from "react";
import Link from "next/link";

export default function FailurePage() {
    const [process, setProcess] = useState("");
    const [event, setEvent] = useState("");
    const [missedCheck, setMissedCheck] = useState("");
    const [idealTiming, setIdealTiming] = useState("");
    const [nextDecision, setNextDecision] = useState("");
    const [result, setResult] = useState<any>(null);

    const handleSave = async () => {
        const res = await fetch("/api/failure", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                process,
                happened: event,
                missed: missedCheck,
                timing: idealTiming,
                next: nextDecision,
            }),
        });

        const data = await res.json();
        console.log("AI結果👇", data.text);

        setResult(data.text);

        setProcess("");
        setEvent("");
        setMissedCheck("");
        setIdealTiming("");
        setNextDecision("");
    };

    return (
        <main
            style={{
                maxWidth: 760,
                margin: "40px auto",
                padding: 24,
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1
                style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#3b82f6",
                    marginBottom: 8,
                }}
            >
                失敗記録
            </h1>

            <p style={{ color: "#555", marginBottom: 24 }}>
                段取り失敗をAIが読める形で残します。
            </p>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 20,
                    background: "#fafafa",
                    display: "grid",
                    gap: 16,
                }}
            >
                <label>
                    <div style={{ fontWeight: "bold", marginBottom: 6 }}>工程</div>
                    <input
                        value={process}
                        onChange={(e) => setProcess(e.target.value)}
                        placeholder="例：打設"
                        style={{
                            width: "100%",
                            padding: 10,
                            border: "1px solid #ccc",
                            borderRadius: 8,
                        }}
                    />
                </label>

                <label>
                    <div style={{ fontWeight: "bold", marginBottom: 6 }}>起きたこと</div>
                    <textarea
                        value={event}
                        onChange={(e) => setEvent(e.target.value)}
                        placeholder="例：配筋変更が当日発覚して打設が遅れた"
                        rows={4}
                        style={{
                            width: "100%",
                            padding: 10,
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            resize: "vertical",
                        }}
                    />
                </label>

                <label>
                    <div style={{ fontWeight: "bold", marginBottom: 6 }}>未確認だったこと</div>
                    <textarea
                        value={missedCheck}
                        onChange={(e) => setMissedCheck(e.target.value)}
                        placeholder="例：配筋図の最終確認、設備との干渉確認"
                        rows={3}
                        style={{
                            width: "100%",
                            padding: 10,
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            resize: "vertical",
                        }}
                    />
                </label>

                <label>
                    <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                        本来いつ決めるべきだったか
                    </div>
                    <input
                        value={idealTiming}
                        onChange={(e) => setIdealTiming(e.target.value)}
                        placeholder="例：打設1週間前"
                        style={{
                            width: "100%",
                            padding: 10,
                            border: "1px solid #ccc",
                            borderRadius: 8,
                        }}
                    />
                </label>

                <label>
                    <div style={{ fontWeight: "bold", marginBottom: 6 }}>次からの判断</div>
                    <textarea
                        value={nextDecision}
                        onChange={(e) => setNextDecision(e.target.value)}
                        placeholder="例：配筋変更は打設1週間前までに確定する"
                        rows={3}
                        style={{
                            width: "100%",
                            padding: 10,
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            resize: "vertical",
                        }}
                    />
                </label>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 8,
                            border: "none",
                            background: "#38bdf8",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        記録する
                    </button>

                    <Link
                        href="/"
                        style={{
                            padding: "12px 18px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            textDecoration: "none",
                            color: "#111",
                            background: "#fff",
                        }}
                    >
                        戻る
                    </Link>
                </div>
            </div>

            {result && (
                <div
                    style={{
                        marginTop: 24,
                        border: "1px solid #ddd",
                        borderRadius: 12,
                        padding: 20,
                        background: "#fff",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#3b82f6",
                            marginBottom: 16,
                        }}
                    >
                        AI整理結果
                    </h2>

                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.8,
                        }}
                    >
                        {result?.replace(/```json|```/g, "")}
                    </pre>
                </div>
            )}
        </main>
    );
}