"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ToolDetailPage() {
    const [toolName, setToolName] = useState("");
    const [place, setPlace] = useState("");
    const [user, setUser] = useState("未使用");
    const [lastUpdated, setLastUpdated] = useState("未更新");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const name = params.get("name") || "";
        const placeValue = params.get("place") || "";

        setToolName(name);
        setPlace(placeValue);

        loadData(name, placeValue);
    }, []);

    async function loadData(name: string, place: string) {
        if (!name || !place) return;

        const { data, error } = await supabase
            .from("tools")
            .select("*")
            .eq("name", name)
            .eq("place", place)
            .maybeSingle();

        if (error) {
            alert("読込エラー: " + error.message);
            console.error(error);
            return;
        }

        if (!data) return;

        setUser(data.user_name || "未使用");
        setLastUpdated(data.updated_at || "未更新");
    }

    async function saveStatus(nextUser: string) {
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("tools")
            .upsert(
                {
                    name: toolName,
                    place: place,
                    user_name: nextUser,
                    updated_at: now,
                },
                {
                    onConflict: "name,place",
                }
            )
            .select();

        if (error) {
            alert("保存エラー: " + error.message);
            console.error(error);
            return;
        }

        console.log("保存成功", data);

        setUser(nextUser);
        setLastUpdated(now);
    }

    function borrowTool() {
        const name = window.prompt("使用者名を入力してください");

        if (!name) return;

        saveStatus(name);
    }

    function returnTool() {
        saveStatus("未使用");
    }

    return (
        <main style={{ padding: 24, paddingBottom: 100 }}>
            <h1 style={{ fontSize: 34, marginBottom: 8 }}>道具QR管理</h1>

            <p style={{ fontSize: 17, color: "#555", marginBottom: 24 }}>
                道具の保管場所と使用状況を確認できます。
            </p>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 16,
                    padding: 20,
                    background: "white",
                }}
            >
                <h2 style={{ fontSize: 28, marginBottom: 20 }}>{toolName}</h2>

                <p style={{ fontSize: 18 }}>
                    <strong>管理場所：</strong>
                    {place}
                </p>

                <p style={{ fontSize: 18 }}>
                    <strong>使用者：</strong>
                    {user}
                </p>

                <p style={{ fontSize: 18 }}>
                    <strong>最終更新：</strong>
                    {lastUpdated}
                </p>

                <button
                    onClick={borrowTool}
                    style={{
                        width: "100%",
                        padding: 16,
                        fontSize: 18,
                        fontWeight: "bold",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        marginTop: 20,
                    }}
                >
                    借りる
                </button>

                <button
                    onClick={returnTool}
                    style={{
                        width: "100%",
                        padding: 16,
                        fontSize: 18,
                        fontWeight: "bold",
                        background: "#111",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        marginTop: 12,
                    }}
                >
                    返した
                </button>
            </div>
        </main>
    );
}