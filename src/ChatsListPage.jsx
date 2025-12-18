import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "./QuestionsContext";
import ProfileHeader from "./ProfileHeader";

const ChatsListPage = () => {
  const navigate = useNavigate();
  const { questions, chatsByQuestionId } = useQuestions();

  const role = localStorage.getItem("unihelp_role") || "student";
  const name = localStorage.getItem("unihelp_name") || "Вы";

  const chats = Object.entries(chatsByQuestionId)
    .map(([qid, msgs]) => {
      const questionId = Number(qid);
      const question = questions.find((q) => q.id === questionId);
      if (!question || !msgs || msgs.length === 0) return null;

      const lastMessage = msgs[msgs.length - 1];

      // есть ли непрочитанные сообщения для текущей роли
      const hasUnread = msgs.some((m) => m.unreadFor === role);

      // Фильтрация по роли

      // 🔹 Для помощника:
      // показываем чат, если:
      // 1) он уже писал туда (senderName === name или senderRole === "helper")
      //    ИЛИ
      // 2) студент написал ему (unreadFor === "helper")
      if (role === "helper") {
        const isInChat = msgs.some(
          (m) =>
            m.senderName === name ||
            m.senderRole === "helper" ||
            m.unreadFor === "helper"
        );
        if (!isInChat) return null;
      }

      // 🔹 Для новичка:
      // показываем, если он автор вопроса или уже писал в чат
      if (role === "student") {
        const isInChat =
          question.author === name ||
          msgs.some((m) => m.senderName === name || m.senderRole === "student");
        if (!isInChat) return null;
      }

      return {
        questionId,
        questionTitle: question.title,
        questionResolved: !!question.resolved,
        lastMessage,
        hasUnread,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const t1 = new Date(a.lastMessage.createdAt).getTime();
      const t2 = new Date(b.lastMessage.createdAt).getTime();
      return t2 - t1;
    });

  return (
    <div className="app-page">
      <ProfileHeader />

      <main className="app-main">
        <h2 className="page-title">Мои чаты</h2>

        {chats.length === 0 ? (
          <p className="text-muted">
            Пока нет личных чатов. Новичок получает чат после выбора лучшего
            ответа и первого сообщения. Помощник — когда студент написал ему в
            чат.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {chats.map((chat) => (
              <div
                key={chat.questionId}
                onClick={() => navigate(`/chat/${chat.questionId}`)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#111827",
                  border: "1px solid #1f2937",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {/* Верхняя строка: заголовок + статус + "Новое" */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      margin: 0,
                      color: "#e5e7eb",
                      flexGrow: 1,
                    }}
                  >
                    {chat.questionTitle}
                  </h3>

                  <span
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 999,
                      border: chat.questionResolved
                        ? "1px solid #22c55e"
                        : "1px solid #facc15",
                      background: chat.questionResolved
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(250,204,21,0.15)",
                      color: chat.questionResolved ? "#86efac" : "#fde047",
                      marginLeft: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.questionResolved ? "Решён" : "Не решён"}
                  </span>

                  {chat.hasUnread && (
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(99,102,241,0.2)",
                        border: "1px solid #6366f1",
                        color: "#c7d2fe",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Новое
                    </span>
                  )}
                </div>

                {/* Нижняя строка: последнее сообщение + время */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: "#9ca3af",
                      margin: 0,
                      maxWidth: "80%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {chat.lastMessage.text}
                  </p>

                  <span
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      marginLeft: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.lastMessage.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatsListPage;