import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "./QuestionsContext";
import ProfileHeader from "./ProfileHeader";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { questions, answersByQuestionId, bestAnswers, ratings } =
    useQuestions();

  const name = localStorage.getItem("unihelp_name") || "Безымянный";
  const email = localStorage.getItem("unihelp_email") || "unknown@example.com";
  const role = localStorage.getItem("unihelp_role") || "student";

  const roleLabel = role === "helper" ? "Помощник" : "Новичок";

  // -------- СТАТИСТИКА ДЛЯ НОВИЧКА --------
  const myQuestions = questions.filter((q) => q.author === name);
  const resolvedMyQuestions = myQuestions.filter((q) => q.resolved);
  const unresolvedMyQuestions = myQuestions.filter((q) => !q.resolved);

  // -------- СТАТИСТИКА ДЛЯ ПОМОЩНИКА --------
  let myAnswersCount = 0;
  let acceptedAnswersCount = 0;
  const myRatings = [];

  questions.forEach((q) => {
    const answers = answersByQuestionId[q.id] || [];
    const myAnswers = answers.filter((a) => a.author === name);
    if (myAnswers.length > 0) {
      myAnswersCount += myAnswers.length;

      const bestId = bestAnswers[q.id];
      const bestFromMe = myAnswers.find((a) => a.id === bestId);
      if (bestFromMe) {
        acceptedAnswersCount += 1;
        if (ratings[q.id]?.value) {
          myRatings.push(ratings[q.id].value);
        }
      }
    }
  });

  const averageRating =
    myRatings.length > 0
      ? (myRatings.reduce((sum, v) => sum + v, 0) / myRatings.length).toFixed(1)
      : null;

  const handleLogout = () => {
    localStorage.removeItem("unihelp_token");
    localStorage.removeItem("unihelp_role");
    localStorage.removeItem("unihelp_name");
    localStorage.removeItem("unihelp_email");
    // можно очистить сохранённое состояние вопросов/чатов, если нужно:
    // localStorage.removeItem("unihelp_state");

    navigate("/");
  };

  return (
    <div className="app-page">
      <ProfileHeader />

      <main className="app-main" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* карточка профиля */}
        <div className="card">
          <h2 className="page-title" style={{ marginBottom: 6 }}>
            Профиль
          </h2>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{name}</p>
          <p className="text-muted" style={{ margin: "2px 0 6px", fontSize: 14 }}>
            {email} • {roleLabel}
          </p>

          <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
            Это демо-профиль внутри UniHelp. В будущем сюда можно добавить
            аватар, описание и ссылки.
          </p>
        </div>

        {/* статистика по роли */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Статистика</h3>

          {role === "student" ? (
            <>
              <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>
                Как <strong>новичок</strong>, вы задаёте вопросы и выбираете
                лучший ответ.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Всего вопросов
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {myQuestions.length}
                  </div>
                </div>

                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Решённые
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {resolvedMyQuestions.length}
                  </div>
                </div>

                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Нерешённые
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {unresolvedMyQuestions.length}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>
                Как <strong>помощник</strong>, вы отвечаете на вопросы и
                получаете оценки за лучшие ответы.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Всего ответов
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {myAnswersCount}
                  </div>
                </div>

                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Ваших ответов выбрано лучшими
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {acceptedAnswersCount}
                  </div>
                </div>

                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Оценок за помощь
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {myRatings.length}
                  </div>
                </div>

                <div>
                  <div className="text-soft" style={{ fontSize: 12 }}>
                    Средний рейтинг
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {averageRating ? `${averageRating} / 5` : "—"}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* действия */}
        <div
          className="card"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => navigate("/questions")}
          >
            ← К ленте вопросов
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/chats")}
          >
            Мои чаты
          </button>

          <div style={{ flexGrow: 1 }} />

          <button
            className="btn btn-chip"
            style={{ borderColor: "#f97373", color: "#fecaca" }}
            onClick={handleLogout}
          >
            Выйти из аккаунта
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;