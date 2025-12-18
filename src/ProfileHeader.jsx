import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuestions } from "./QuestionsContext";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatsByQuestionId } = useQuestions();

  const name = localStorage.getItem("unihelp_name") || "Гость";
  const email = localStorage.getItem("unihelp_email") || "unknown@example.com";
  const role = localStorage.getItem("unihelp_role") || "student";
  const roleLabel = role === "helper" ? "Помощник" : "Новичок";

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("unihelp_token");
    localStorage.removeItem("unihelp_role");
    localStorage.removeItem("unihelp_name");
    localStorage.removeItem("unihelp_email");
    navigate("/");
  };

  const isActive = (pathPrefix) => location.pathname.startsWith(pathPrefix);

  // есть ли непрочитанные сообщения для текущей роли
  const hasUnread = useMemo(() => {
    return Object.values(chatsByQuestionId || {}).some((msgs) =>
      msgs.some((m) => m.unreadFor === role)
    );
  }, [chatsByQuestionId, role]);

  return (
    <header
      style={{
        width: "100%",
        padding: "16px 24px",
        borderBottom: "1px solid #020617",
        background:
          "radial-gradient(circle at 0 0, rgba(148,163,184,0.12), transparent 55%), #020617",
        display: "flex",
        alignItems: "center",
        gap: 16,
        justifyContent: "space-between",
      }}
    >
      {/* блок пользователя */}
      <div
        onClick={goToProfile}
        style={{
          cursor: "pointer",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginTop: 2,
          }}
        >
          {email} • {roleLabel}
        </div>
      </div>

      {/* навигация */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <button
          className={`btn btn-primary ${isActive("/ask") ? "active" : ""}`}
          onClick={() => navigate("/ask")}
        >
          Задать вопрос
        </button>

        <button
          className={`btn btn-outline ${isActive("/chats") ? "active" : ""}`}
          onClick={() => navigate("/chats")}
          style={{ position: "relative" }}
        >
          {/* текст кнопки меняется если есть непрочитанные */}
          {hasUnread ? "Мои чаты 🔔" : "Мои чаты"}

          {/* маленькая точка-индикатор сверху справа на кнопке */}
          {hasUnread && (
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f97373",
                boxShadow: "0 0 8px rgba(248,113,113,0.9)",
              }}
            />
          )}
        </button>

        <button
          className={`btn btn-outline ${
            isActive("/questions") ? "active" : ""
          }`}
          onClick={() => navigate("/questions")}
        >
          Все вопросы
        </button>

        <button
          className="btn btn-chip"
          style={{
            borderColor: "#f97373",
            color: "#fecaca",
          }}
          onClick={handleLogout}
        >
          Выйти
        </button>
      </nav>
    </header>
  );
};

export default ProfileHeader;