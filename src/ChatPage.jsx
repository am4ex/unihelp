import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestions } from "./QuestionsContext";
import ProfileHeader from "./ProfileHeader";


const ChatPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const {
    questions,
    chatsByQuestionId,
    addChatMessage,
    markChatRead,
  } = useQuestions();

  const questionIdNum = Number(questionId);
  const question = questions.find((q) => q.id === questionIdNum);

  const role = localStorage.getItem("unihelp_role") || "student";
  const name = localStorage.getItem("unihelp_name") || "Вы";

  const messages = useMemo(() => {
    return chatsByQuestionId[questionIdNum] || [];
  }, [chatsByQuestionId, questionIdNum]);

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!Number.isNaN(questionIdNum)) {
      markChatRead(questionIdNum, role);
    }
  }, [questionIdNum, role, markChatRead]);

  if (!question) {
    return (
      <div className="app-page">
        <main className="app-main">
          <p>Вопрос не найден</p>
          <button
            onClick={() => navigate("/chats")}
            className="btn btn-outline"
            style={{ marginTop: 12 }}
          >
            Назад к чатам
          </button>
        </main>
      </div>
    );
  }

  const isResolved = !!question.resolved;

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addChatMessage(questionIdNum, text.trim(), role, name);
    setText("");
  };

  return (
    <div className="app-page">
      <ProfileHeader />

      <main className="app-main" style={{ paddingBottom: 140 }}>
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/questions/${questionIdNum}`)}
          style={{ marginBottom: 16 }}
        >
          ← К вопросу
        </button>

        {}
        <h2 className="page-title">{question.title}</h2>

        {}
        <p className="text-muted" style={{ marginBottom: 4 }}>
          {question.body}
        </p>

        {}
        <p
          style={{
            fontSize: 13,
            marginBottom: 8,
            color: isResolved ? "#4ade80" : "#facc15",
          }}
        >
          Статус: {isResolved ? "вопрос решён ✅" : "ожидает решения ⏳"}
        </p>

        {}
        <p className="text-muted" style={{ marginBottom: 12 }}>
          Вы общаетесь по этому вопросу с собеседником один на один.
        </p>

        {/* окно сообщений */}
        <div
          style={{
            background: "#0b1120",
            borderRadius: 12,
            border: "1px solid #1f2937",
            padding: 16,
            height: "60vh",
            overflowY: "auto",
            boxShadow: "0 16px 40px rgba(15,23,42,0.45)",
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center" }}>
              Сообщений пока нет. Напишите первое!
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent:
                    m.senderRole === role ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: 12,
                    background:
                      m.senderRole === role ? "#4f46e5" : "#111827",
                    color: m.senderRole === role ? "#f9fafb" : "#e5e7eb",
                    border:
                      m.senderRole === role
                        ? "1px solid #6366f1"
                        : "1px solid #1f2937",
                    boxShadow: "0 4px 14px rgba(15,23,42,0.55)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>{m.text}</p>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 4,
                      fontSize: 11,
                      color: "#9ca3af",
                      textAlign: "right",
                    }}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          <div ref={bottomRef} />
        </div>

        {}
        <form
          onSubmit={handleSend}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 900,
            padding: "0 24px",
            display: "flex",
            gap: 12,
          }}
        >
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите сообщение..."
            style={{ flex: 1, minHeight: 60 }}
          />

          <button type="submit" className="btn btn-primary" style={{ height: 60 }}>
            Отправить
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatPage;