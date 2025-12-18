import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_USERS = {
  "nikita@gmail.com": {
    password: "123456",
    name: "Nikita",
    role: "student",
  },
  "helper@gmail.com": {
    password: "123456",
    name: "Helper",
    role: "helper",
  },
};

const AuthPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = DEMO_USERS[email.trim().toLowerCase()];
    if (!user || user.password !== password) {
      setError("Неверный логин или пароль. Используй демо-аккаунты ниже 👇");
      return;
    }

    // сохраняем «сессию»
    localStorage.setItem("unihelp_token", "demo-token");
    localStorage.setItem("unihelp_name", user.name);
    localStorage.setItem("unihelp_role", user.role);
    localStorage.setItem("unihelp_email", email.trim().toLowerCase());

    navigate("/questions");
  };

  const handleDemoFill = (email) => {
    setEmail(email);
    setPassword(DEMO_USERS[email].password);
    setError("");
  };

  return (
    <div className="app-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <main className="app-main" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card" style={{ padding: 24 }}>
          <h1
            style={{
              margin: 0,
              marginBottom: 4,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            UniHelp
          </h1>
          <p className="text-muted" style={{ marginBottom: 18, fontSize: 14 }}>
            Внутренний сервис &quot;помощь новичкам&quot;.
          </p>

          {/* переключатель режимов */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <button
              className={`btn btn-chip ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Вход
            </button>
            <button
              className={`btn btn-chip ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Регистрация
            </button>
          </div>

          {mode === "login" && (
            <form
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 18,
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
                  Почта
                </label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="например, nikita@gmail.com"
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
                  Пароль
                </label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="не менее 6 символов"
                />
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

              <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
                Войти
              </button>
            </form>
          )}

          {mode === "register" && (
            <div style={{ marginBottom: 18, fontSize: 14 }}>
              <p className="text-muted" style={{ marginBottom: 8 }}>
                Пока недоступно.
              </p>
            </div>
          )}

          {/* демо-аккаунты */}
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#020617",
              border: "1px dashed #334155",
              marginBottom: 4,
            }}
          >
            <p style={{ margin: 0, marginBottom: 6, fontSize: 13 }}>
              Для демо входа можно использовать:
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 13,
              }}
            >
              <button
                type="button"
                className="btn btn-chip"
                style={{ justifyContent: "space-between" }}
                onClick={() => handleDemoFill("nikita@gmail.com")}
              >
                <span>Новичок: nikita@gmail.com</span>
                <span className="text-muted">пароль: 123456</span>
              </button>

              <button
                type="button"
                className="btn btn-chip"
                style={{ justifyContent: "space-between" }}
                onClick={() => handleDemoFill("helper@gmail.com")}
              >
                <span>Помощник: helper@gmail.com</span>
                <span className="text-muted">пароль: 123456</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;