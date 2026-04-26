"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CompletedItem = {
  text: string;
  completedAt: string;
};


export default function TasksPage() {
  const [todoList, setTodoList] = useState<string[]>([]);
  const [completedList, setCompletedList] = useState<CompletedItem[]>([]);
  const [manualTodo, setManualTodo] = useState("");

  useEffect(() => {
    const savedTodoList = localStorage.getItem("todoList");
    const savedCompletedList = localStorage.getItem("completedList");

    if (savedTodoList) setTodoList(JSON.parse(savedTodoList));
    if (savedCompletedList) setCompletedList(JSON.parse(savedCompletedList));
  }, []);

  function handleTaskComplete(item: string) {
    const nextTodoList = todoList.filter((x) => x !== item);
    const nextCompletedList = [
      ...completedList,
      {
        text: item,
        completedAt: new Date().toISOString(),
      },
    ];

    setTodoList(nextTodoList);
    setCompletedList(nextCompletedList);

    localStorage.setItem("todoList", JSON.stringify(nextTodoList));
    localStorage.setItem("completedList", JSON.stringify(nextCompletedList));
  }


  const deleteTask = (index: number) => {
    const newList = todoList.filter((_, i) => i !== index);
    setTodoList(newList);
    localStorage.setItem("todoList", JSON.stringify(newList));
  };


  function handleManualTodoAdd() {
    const text = manualTodo.trim();
    if (!text) return;

    setTodoList((prev) => {
      const next = prev.includes(text) ? prev : [...prev, text];
      localStorage.setItem("todoList", JSON.stringify(next));
      return next;
    });

    setManualTodo("");
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#3b82f6", margin: 0 }}>
          やること管理
        </h1>


      </div>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          background: "#fafafa",
        }}

      >



        <h2 style={{ fontSize: 24, fontWeight: "bold", marginTop: 0, marginBottom: 16, color: "#3b82f6" }}>
          やることリスト
        </h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={manualTodo}
            onChange={(e) => setManualTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleManualTodoAdd();
            }}
            placeholder="やることを入力"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />

          <button
            onClick={handleManualTodoAdd}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#38bdf8",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            追加
          </button>
        </div>

        {todoList.length === 0 ? (
          <div style={{ color: "#666" }}>まだありません</div>
        ) : (
          todoList.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <div style={{ lineHeight: 1.8, marginBottom: 8 }}>{item}</div>

              <button
                onClick={() => handleTaskComplete(item)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                完了
              </button>

              <button
                onClick={() => deleteTask(index)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "#eee",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: 8
                }}
              >
                削除
              </button>
            </div>
          ))
        )}
      </section>
      <Link
        href="/done"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 16px",
          background: "#f3f4f6",
          borderRadius: 10,
          textDecoration: "none",
          color: "#111",
          fontWeight: "bold",
          fontSize: 14,
          border: "1px solid #ddd"
        }}
      >
        完了済みを見る →
      </Link>
    </main>
  );
}
