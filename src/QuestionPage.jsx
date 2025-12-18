import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestions } from "./QuestionsContext";
import ProfileHeader from "./ProfileHeader";

const QuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("unihelp_role") || "student";
  const name = localStorage.getItem("unihelp_name") || "Вы";

  const {
    questions,
    answersByQuestionId,
    bestAnswers,
    ratings,
    addAnswer,
    chooseBestAnswer,
    markQuestionResolved,
    rateHelper,
  } = useQuestions();

  const questionIdNum = Number(id);
  const question = questions.find((q) => q.id === questionIdNum);
  const answers = answersByQuestionId[questionIdNum] || [];
  const bestAnswerId = bestAnswers[questionIdNum];

  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");

  if (!question) {
    return (
      <div className="app-page">
        <main className="app-main">
          <p>Вопрос не найден</p>
          <button
            onClick={() => navigate("/questions")}
            className="btn btn-outline"
            style={{ marginTop: 12 }}
          >
            ← Назад к вопросам
          </button>
        </main>
      </div>
    );
  }

  const isAuthor = question.author === name;
  const isResolved = !!question.resolved;

  const bestAnswer = answers.find((a) => a.id === bestAnswerId) || null;
  const helperName = bestAnswer?.author || null;

  const currentRating = ratings[questionIdNum]?.value || null;

  const handleAddAnswer = (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      setError("Напиши что-нибудь в ответе");
      return;
    }
    setError("");
    addAnswer(questionIdNum, answerText.trim(), name);
    setAnswerText("");
  };

  const handleChooseBest = (answerId) => {
    if (!(role === "student" && isAuthor)) return;
    chooseBestAnswer(questionIdNum, answerId);
  };

  const handleMarkResolved = () => {
    markQuestionResolved(questionIdNum, true);
  };

  const handleSetRating = (value) => {
    if (!(role === "student" && isAuthor && isResolved && helperName)) return;
    rateHelper(questionIdNum, value, helperName);
  };

  return (
    <div className="app-page">
      <ProfileHeader />

      <main className="app-main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {}
        <button
          onClick={() => navigate("/questions")}
          className="btn btn-outline"
          style={{ alignSelf: "flex-start" }}
        >
          ← Назад к вопросам
        </button>

        {}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="page-title" style={{ marginBottom: 6 }}>
            {question.title}
          </h2>

          <p className="text-muted" style={{ marginBottom: 12, fontSize: 15 }}>
            {question.body}
          </p>

          <p className="text-muted" style={{ fontSize: 13 }}>
            Автор: <strong>{question.author}</strong>
          </p>

          {}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                padding: "4px 12px",
                borderRadius: 999,
                display: "inline-block",
                background: isResolved
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(250,204,21,0.15)",
                border: isResolved ? "1px solid #22c55e" : "1px solid #facc15",
                color: isResolved ? "#86efac" : "#fde047",
              }}
            >
              {isResolved ? "Вопрос решён" : "Ожидает решения"}
            </p>

            {role === "student" &&
              isAuthor &&
              bestAnswerId &&
              !isResolved &&
              answers.length > 0 && (
                <button
                  onClick={handleMarkResolved}
                  className="btn btn-outline"
                  style={{
                    padding: "6px 16px",
                    borderRadius: 999,
                    border: "1px solid #22c55e",
                    background: "transparent",
                    color: "#bbf7d0",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  Отметить решённым
                </button>
              )}
          </div>
        </div>

        {}
        {bestAnswer && helperName && isResolved && (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>
              Помощник: {helperName}
            </h3>

            {currentRating ? (
              <p className="text-muted" style={{ marginBottom: 8 }}>
                Ваша оценка: {currentRating} / 5 ⭐
              </p>
            ) : (
              <p className="text-muted" style={{ marginBottom: 8 }}>
                Оцените, насколько ответ помог:
              </p>
            )}

            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((val) => {
                const active = currentRating >= val;
                const clickable = role === "student" && isAuthor;

                return (
                  <button
                    key={val}
                    onClick={() => clickable && handleSetRating(val)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: "1px solid #4b5563",
                      background: active ? "#fbbf24" : "transparent",
                      color: active ? "#1e1b4b" : "#e5e7eb",
                      cursor: clickable ? "pointer" : "default",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {}
        <p className="text-muted" style={{ fontSize: 14 }}>
          {role === "helper"
            ? "Вы помощник — дайте понятный ответ."
            : "Вы новичок — выберите лучший ответ и отметьте вопрос решённым."}
        </p>

        {}
        {role === "helper" && (
          <div className="card" style={{ padding: 20 }}>
            <form
              onSubmit={handleAddAnswer}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <textarea
                className="textarea"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Напиши понятный ответ..."
                style={{ minHeight: 100 }}
              />

              {error && (
                <p
                  style={{
                    color: "#f87171",
                    background: "rgba(248,113,113,0.1)",
                    borderRadius: 8,
                    padding: 8,
                    border: "1px solid #f87171",
                    fontSize: 13,
                  }}
                >
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary">
                Отправить ответ
              </button>
            </form>
          </div>
        )}

        {}
        <h3 style={{ fontSize: 18 }}>Ответы ({answers.length})</h3>

        {answers.length === 0 ? (
          <p className="text-muted">Пока нет ответов.</p>
        ) : (
          answers.map((ans) => {
            const isBest = ans.id === bestAnswerId;
            return (
              <div
                key={ans.id}
                className="card"
                style={{
                  border: isBest ? "2px solid #22c55e" : "1px solid #1f2937",
                  padding: 16,
                  position: "relative",
                }}
              >
                {isBest && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 12,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(34,197,94,0.2)",
                      border: "1px solid #22c55e",
                      fontSize: 11,
                      color: "#bbf7d0",
                      fontWeight: 600,
                    }}
                  >
                    Лучший ответ
                  </span>
                )}

                <p style={{ fontSize: 15, marginBottom: 6 }}>{ans.text}</p>

                <p className="text-muted" style={{ fontSize: 12 }}>
                  Автор: {ans.author}
                </p>

                {role === "student" && isAuthor && (
                  <button
                    onClick={() => handleChooseBest(ans.id)}
                    className="btn btn-chip"
                    style={{
                      marginTop: 6,
                      borderColor: "#4b5563",
                      background: isBest ? "#16a34a" : "transparent",
                      color: isBest ? "#f9fafb" : "#e5e7eb",
                    }}
                  >
                    {isBest ? "Выбран" : "Выбрать как лучший"}
                  </button>
                )}
              </div>
            );
          })
        )}

        {}
        {bestAnswerId && (
          <button
            onClick={() => navigate(`/chat/${questionIdNum}`)}
            className="btn btn-primary"
            style={{ marginTop: 20, alignSelf: "center" }}
          >
            Открыть чат с помощником
          </button>
        )}
      </main>
    </div>
  );
};

export default QuestionPage;