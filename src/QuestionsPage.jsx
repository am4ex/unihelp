import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "./QuestionsContext";
import ProfileHeader from "./ProfileHeader";

const categoryLabels = {
  math: "Математика",
  physics: "Физика",
  programming: "Программирование",
  other: "Другое",
};

const QuestionsPage = () => {
  const navigate = useNavigate();
  const { questions, answersByQuestionId } = useQuestions();

  const role = localStorage.getItem("unihelp_role") || "student";
  const myName = localStorage.getItem("unihelp_name") || "";

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("all"); // all | mine | resolved | open

  // мои вопросы (для новичка)
  const myQuestions = questions.filter((q) => q.author === myName);

  // вопросы, где помощник отвечал
  const myAnsweredQuestionIds = new Set(
    Object.entries(answersByQuestionId)
      .filter(([, answers]) => answers.some((a) => a.author === myName))
      .map(([qid]) => Number(qid))
  );
  const myAnsweredQuestions = questions.filter((q) =>
    myAnsweredQuestionIds.has(q.id)
  );

  // решённые / нерешённые
  const resolvedQuestions = questions.filter((q) => q.resolved);
  const openQuestions = questions.filter((q) => !q.resolved);

  // выбираем базовый список по режиму
  let baseList = questions;
  if (viewMode === "mine") {
    baseList = role === "student" ? myQuestions : myAnsweredQuestions;
  } else if (viewMode === "resolved") {
    baseList = resolvedQuestions;
  } else if (viewMode === "open") {
    baseList = openQuestions;
  }

  // поиск + фильтр по предмету
  const filtered = baseList.filter((q) => {
    const title = (q.title || "").toLowerCase();
    const body = (q.body || "").toLowerCase();
    const query = search.toLowerCase();

    const matchSearch =
      query === "" || title.includes(query) || body.includes(query);

    const matchCategory =
      categoryFilter === "all" ||
      (q.category && q.category === categoryFilter);

    return matchSearch && matchCategory;
  });

  return (
    <div className="app-page">
      <ProfileHeader />

      <main className="app-main">
        <h2 className="page-title">Лента вопросов</h2>

        <p className="page-subtitle">
          {role === "helper"
            ? "Вы помощник: можете смотреть все вопросы, только те, где вы уже отвечали, решённые или нерешённые."
            : "Вы новичок: можете смотреть все вопросы, только свои, решённые или ещё нерешённые."}
        </p>

        {/* режимы просмотра */}
        <div className="chips-row">
          <button
            onClick={() => setViewMode("all")}
            className={`btn btn-chip ${viewMode === "all" ? "active" : ""}`}
          >
            Все вопросы
          </button>

          <button
            onClick={() => setViewMode("mine")}
            className={`btn btn-chip ${
              viewMode === "mine" ? "active" : ""
            }`}
          >
            {role === "student" ? "Мои вопросы" : "Мои ответы"}
          </button>

          <button
            onClick={() => setViewMode("resolved")}
            className={`btn btn-chip success ${
              viewMode === "resolved" ? "active" : ""
            }`}
          >
            Решённые
          </button>

          <button
            onClick={() => setViewMode("open")}
            className={`btn btn-chip warning ${
              viewMode === "open" ? "active" : ""
            }`}
          >
            Нерешённые
          </button>
        </div>

        {/* поиск + предмет */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по заголовку и описанию..."
            className="input"
            style={{ flex: 1, minWidth: 220 }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
            style={{ maxWidth: 220 }}
          >
            <option value="all">Все предметы</option>
            <option value="math">Математика</option>
            <option value="physics">Физика</option>
            <option value="programming">Программирование</option>
            <option value="other">Другое</option>
          </select>
        </div>

        {/* список вопросов */}
        <div className="card-list">
          {filtered.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 14 }}>
              Ничего не найдено. Попробуйте изменить поисковый запрос или
              фильтры.
            </p>
          ) : (
            filtered.map((q) => {
              const answers = answersByQuestionId[q.id] || [];
              const hasMyAnswer =
                role === "helper" &&
                answers.some((a) => a.author === myName);
              const isResolved = !!q.resolved;

              return (
                <div
                  key={q.id}
                  onClick={() => navigate(`/questions/${q.id}`)}
                  className="card card-hover"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 4,
                      alignItems: "center",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 18,
                        margin: 0,
                      }}
                    >
                      {q.title}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      {q.category && (
                        <span className="badge badge-soft">
                          {categoryLabels[q.category] || "Предмет не указан"}
                        </span>
                      )}

                      {isResolved && (
                        <span className="badge badge-success">Решён</span>
                      )}

                      {hasMyAnswer && (
                        <span className="badge badge-info">Вы отвечали</span>
                      )}
                    </div>
                  </div>

                  <p
                    className="text-muted"
                    style={{ marginBottom: 8, fontSize: 14 }}
                  >
                    {q.body.length > 140
                      ? q.body.slice(0, 140) + "..."
                      : q.body}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      margin: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      color: "#6b7280",
                    }}
                  >
                    <span>Автор: {q.author}</span>
                    <span>Ответов: {q.answersCount ?? 0}</span>
                  </p>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionsPage;