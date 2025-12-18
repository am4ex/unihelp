import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./AuthPage";
import QuestionsPage from "./QuestionsPage";
import QuestionPage from "./QuestionPage";
import AskPage from "./AskPage";
import ChatPage from "./ChatPage";
import ChatsListPage from "./ChatsListPage";
import ProfilePage from "./ProfilePage";
import FloatingChatButton from "./FloatingChatButton";

function App() {
  const token = localStorage.getItem("unihelp_token");
  const isAuthed = !!token;

  return (
    <>
      {/* плавающая кнопка — только когда пользователь авторизован */}
      {isAuthed && <FloatingChatButton />}

      <Routes>
        {/* логин/регистрация */}
        <Route path="/" element={<AuthPage />} />

        {/* ЛЕНТА ВОПРОСОВ */}
        <Route
          path="/questions"
          element={isAuthed ? <QuestionsPage /> : <Navigate to="/" replace />}
        />

        {/* КОНКРЕТНЫЙ ВОПРОС ПО ID */}
        <Route
          path="/questions/:id"
          element={isAuthed ? <QuestionPage /> : <Navigate to="/" replace />}
        />

        {/* Задать вопрос */}
        <Route
          path="/ask"
          element={isAuthed ? <AskPage /> : <Navigate to="/" replace />}
        />

        {/* Личный чат */}
        <Route
          path="/chat/:questionId"
          element={isAuthed ? <ChatPage /> : <Navigate to="/" replace />}
        />

        {/* Список чатов */}
        <Route
          path="/chats"
          element={isAuthed ? <ChatsListPage /> : <Navigate to="/" replace />}
        />

        {/* Профиль */}
        <Route
          path="/profile"
          element={isAuthed ? <ProfilePage /> : <Navigate to="/" replace />}
        />

        {/* Всё остальное → на логин */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </>

    );
}

export default App;