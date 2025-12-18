import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import { useQuestions } from "./QuestionsContext";

const AskPage = () => {
  const navigate = useNavigate();
  const { addQuestion } = useQuestions();

  const role = localStorage.getItem("unihelp_role") || "student";
  const name = localStorage.getItem("unihelp_name") || "Аноним";

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("other");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Добавь понятный заголовок вопроса.");
      return;
    }
    if (!body.trim()) {
      setError("Опиши суть проблемы хотя бы в двух-трёх предложениях.");
      return;
    }

    const author = name || "Аноним";
    const id = addQuestion(title.trim(), body.trim(), author, category);

    setTitle("");
    setBody("");
    setCategory("other");

    navigate(`/questions/${id}`);
  };

  return (
    <div className="app-page">
      <ProfileHeader />

      <main className="app-main">
        <button
          className="btn btn-outline"
          onClick={() => navigate("/questions")}
          style={{ marginBottom: 16 }}
        >
          ← К ленте вопросов
        </button>

        <h2 className="page-title">Задать вопрос</h2>

        <p className="page-subtitle" style={{ marginBottom: 16 }}>
          Напиши, что именно тебе непонятно. Помощник увидит вопрос и ответит
          человеческим языком. {role === "helper"
            ? "Сейчас вы залогинены как помощник, но задать вопрос всё равно можно."
            : "Не бойся формулировок — лучше задать «тупой» вопрос, чем ничего не спросить."}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 700,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Заголовок
            </label>
            <input
              className="input"
              placeholder="Например: «Не понимаю, как работают двойные интегралы»"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Описание
            </label>
            <textarea
              className="textarea"
              placeholder="Опиши задачу, что именно ты уже пробовал, на каком месте всё ломается. Чем больше контекста — тем проще помощнику объяснить по-человечески."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Предмет / категория
            </label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="math">Математика</option>
              <option value="physics">Физика</option>
              <option value="programming">Программирование</option>
              <option value="other">Другое</option>
            </select>
          </div>

          {error && (
            <p
              style={{
                fontSize: 13,
                color: "#f87171",
                background: "rgba(248,113,113,0.08)",
                borderRadius: 8,
                padding: 8,
                border: "1px solid #f87171",
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn btn-primary">
              Отправить вопрос
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/questions")}
            >
              Отменить
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AskPage;