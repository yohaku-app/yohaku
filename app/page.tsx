"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Result = {
  emergency_probability_percent: string;
  overtime_hours_expected: string;
  loss_yen_expected: string;
  missing_arrangements: string[];
  likely_issues: string[];
  decide_today: string[];
  next_missing: string[];
  photo_warnings: string[];
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [totalSavedHours, setTotalSavedHours] = useState(0);
  const [totalSavedMoney, setTotalSavedMoney] = useState(0);
  const [improvementCount, setImprovementCount] = useState(0);

  const [doneItems, setDoneItems] = useState<{ [key: number]: boolean }>({});

  const [todoList, setTodoList] = useState<string[]>([]);
  const [completedList, setCompletedList] = useState<string[]>([]);

  useEffect(() => {
    const savedInputText = localStorage.getItem("latestInputText");
    const savedResult = localStorage.getItem("latestResult");

    if (savedInputText) {
      setInputText(savedInputText);
    }

    if (savedResult) {
      setRes(JSON.parse(savedResult));
    }
  }, []);

  useEffect(() => {
    const savedHours = localStorage.getItem("totalSavedHours");
    const savedMoney = localStorage.getItem("totalSavedMoney");
    const savedCount = localStorage.getItem("improvementCount");

    const savedDone = localStorage.getItem("doneItems");
    if (savedDone) setDoneItems(JSON.parse(savedDone));

    if (savedHours) setTotalSavedHours(Number(savedHours));
    if (savedMoney) setTotalSavedMoney(Number(savedMoney));
    if (savedCount) setImprovementCount(Number(savedCount));
  }, []);

  function getWeight(text: string) {
    if (text.includes("致命") || text.includes("停止")) {
      return { hours: 3, money: 50000 };
    }
    if (text.includes("遅延") || text.includes("手直し")) {
      return { hours: 1, money: 10000 };
    }
    return { hours: 0.5, money: 3000 };
  }

  function handleDone() {
    if (!res) return;

    const addedHours = Number(res.overtime_hours_expected);
    const addedMoney = Number(res.loss_yen_expected);

    const nextHours = totalSavedHours + addedHours;
    const nextMoney = totalSavedMoney + addedMoney;
    const nextCount = improvementCount + 1;

    setTotalSavedHours(nextHours);
    setTotalSavedMoney(nextMoney);
    setImprovementCount(nextCount);

    localStorage.setItem("totalSavedHours", String(nextHours));
    localStorage.setItem("totalSavedMoney", String(nextMoney));
    localStorage.setItem("improvementCount", String(nextCount));
  }

  function handleTaskComplete(item: string) {
    const nextTodoList = todoList.filter((x) => x !== item);
    const nextCompletedList = [...completedList, item];

    setTodoList(nextTodoList);
    setCompletedList(nextCompletedList);

    localStorage.setItem("todoList", JSON.stringify(nextTodoList));
    localStorage.setItem("completedList", JSON.stringify(nextCompletedList));
  }

  function handleItemDone(item: string, index: number) {
    if (doneItems[index]) return;

    const weight = getWeight(item);

    const nextHours = totalSavedHours + weight.hours;
    const nextMoney = totalSavedMoney + weight.money;
    const nextCount = improvementCount + 1;

    setTotalSavedHours(nextHours);
    setTotalSavedMoney(nextMoney);
    setImprovementCount(nextCount);

    setDoneItems({
      ...doneItems,
      [index]: true,
    });

    const nextTodoList = [...todoList, item];
    setTodoList(nextTodoList);
    localStorage.setItem("todoList", JSON.stringify(nextTodoList));



    localStorage.setItem("doneItems", JSON.stringify({
      ...doneItems,
      [index]: true,
    }));

    localStorage.setItem("totalSavedHours", String(nextHours));
    localStorage.setItem("totalSavedMoney", String(nextMoney));
    localStorage.setItem("improvementCount", String(nextCount));
  }


  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageDataUrl(null);
      setImageName("");
      return;
    }

    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit() {
    if (!inputText.trim()) {
      setErr("現場状況を入力してください");
      return;
    }

    setLoading(true);
    setErr(null);


    setDoneItems({});
    localStorage.removeItem("doneItems");

    try {
      const r = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          imageDataUrl,
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "判定に失敗しました");
      const history = JSON.parse(localStorage.getItem("history") || "[]");

      history.unshift({
        inputText,
        result: data,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("history", JSON.stringify(history));


      setRes(data as Result);
    } catch (e: any) {
      setErr(e?.message ?? "unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginBottom: 8 }}>YOHAKU | 段取り予報</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        現場状況を自由記入してください。写真は任意です。
      </p>



      <div style={{ display: "grid", gap: 16 }}>
        <label>
          現場状況（自由記入）
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              width: "100%",
              minHeight: 180,
              padding: 12,
              marginTop: 6,
              resize: "vertical",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
            placeholder="例：明日打設。配筋は終わっているが、設備との干渉がありそう。敷鉄板は一部未確認。重機あり。雨予報。"
          />
        </label>

        <label>
          写真（任意）
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "block", marginTop: 6 }}
          />
        </label>

        {imageName && (
          <div
            style={{
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            添付画像: {imageName}
          </div>
        )}

        {imageDataUrl && (
          <img
            src={imageDataUrl}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: 320,
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        )}

        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            padding: "14px 18px",
            cursor: "pointer",
            borderRadius: 8,
            border: "none",
            background: loading ? "#7dd3fc" : "#38bdf8",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            transition: "0.2s",
            transform: loading ? "scale(0.98)" : "scale(1)",
          }}
        >
          {loading ? "予報中..." : "予報する"}
        </button>
      </div>




      {err && (
        <p style={{ marginTop: 16, color: "crimson" }}>
          エラー: {err}
        </p>
      )}

      {res && (
        <section
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 10,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#3b82f6",
              marginBottom: 16,
            }}
          >
            結果
          </h2>

          <div style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 10, background: "#fafafa" }}>
            <h3 style={{ fontSize: 20, fontWeight: "bold", color: "#3b82f6", marginBottom: 12 }}>累計改善</h3>
            <div style={{ lineHeight: 1.8 }}>
              <div>改善回数：<strong>{improvementCount}回</strong></div>
              <div>
                累計削減時間：
                <strong>
                  {(() => {
                    const hour = Math.floor(totalSavedHours);
                    const min = Math.round((totalSavedHours - hour) * 60);
                    return `${hour}時間${min}分`;
                  })()}
                </strong>
              </div>
              <div>累計削減金額：<strong>{totalSavedMoney.toLocaleString()}円</strong></div>
            </div>
          </div>






          <div

            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "10px",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexDirection: "column" }}>

              <div style={{
                flex: 1,
                background: "linear-gradient(135deg, #dc2626, #ef4444)",
                color: "#fff",
                padding: 16,
                borderRadius: 10,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ fontSize: 14, opacity: 0.8 }}>緊急化確率</h3>
                <div style={{ fontSize: 28, fontWeight: "bold" }}>
                  {res.emergency_probability_percent}%
                </div>
              </div>

              <div style={{ flex: 1, background: "#3b82f6", color: "#fff", padding: 16, borderRadius: 10 }}>
                <h3 style={{ fontSize: 14, opacity: 0.8 }}>余分労働時間</h3>
                <div style={{ fontSize: 28, fontWeight: "bold" }}>
                  {(() => { const h = parseFloat(res.overtime_hours_expected); const hour = Math.floor(h); const min = Math.round((h - hour) * 60); return `${hour}時間${min}分`; })()}
                </div>
              </div>

              <div style={{ flex: 1, background: "#3b82f6", color: "#fff", padding: 16, borderRadius: 10 }}>
                <h3 style={{ fontSize: 14, opacity: 0.8 }}>想定損失</h3>
                <div style={{ fontSize: 28, fontWeight: "bold" }}>
                  {Number(res.loss_yen_expected).toLocaleString()}円
                </div>
              </div>

            </div>
          </div>

          <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginBottom: 8 }}>漏れそうな段取り</h3>
          <div style={{ marginBottom: 24 }}>
            {res.missing_arrangements.map((x, i) =>
              doneItems[i] ? null : (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ lineHeight: 1.6, marginBottom: 10 }}>
                    {x}
                  </div>

                  <button
                    onClick={() => handleItemDone(x, i)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      background: "#f8f8f8",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    やることリストに移動
                  </button>
                </div>
              )
            )}
          </div>

          <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginBottom: 8 }}>起きそうなこと</h3>
          <ul style={{ paddingLeft: 24, lineHeight: 1.8, marginBottom: 24, listStyleType: "disc" }}>{
            res.likely_issues.map((x, i) => (<li key={i} style={{ marginBottom: 10 }}>{x}</li>))}</ul>

          <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginTop: 24 }}>
            次に漏れやすいこと（先回り）
          </h3>

          <div style={{ marginBottom: 24 }}>
            {res.next_missing.map((x, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#f9fafb",
                }}
              >
                {x}
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginBottom: 8 }}>今日決めること</h3>
          <ul style={{ paddingLeft: 24, lineHeight: 1.8, marginBottom: 24, listStyleType: "disc" }}>{
            res.decide_today.map((x, i) => (<li key={i} style={{ marginBottom: 10 }}>{x}</li>))}</ul>

          {imageDataUrl && res.photo_warnings.length > 0 && (<><h3 style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginBottom: 8 }}>写真から見える注意点</h3>
            <ul style={{
              paddingLeft: 24, lineHeight: 1.8, marginBottom: 24, listStyleType: "disc"
            }}>{
                res.photo_warnings.map((x, i) => (<li key={i} style={{ marginBottom: 10 }}>{x}</li>))}</ul></>)}

        </section>
      )}

    </main>
  );
}