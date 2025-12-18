import React, { createContext, useContext, useEffect, useState } from "react";
import { mockQuestions } from "./mockQuestions";

const QuestionsContext = createContext(null);

// state: { questions, answers, bestAnswers, chats, ratings }

export const QuestionsProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("unihelp_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const questions =
          parsed.questions?.filter(
            (q) => q && q.title && q.title.trim().length > 0
          ) || [];
        const answers = parsed.answers || {};
        const bestAnswers = parsed.bestAnswers || {};
        const chats = parsed.chats || {};
        const ratings = parsed.ratings || {};

        if (questions.length > 0) {
          return { questions, answers, bestAnswers, chats, ratings };
        }
      } catch {
        // ignore
      }
    }
    return {
      questions: mockQuestions,
      answers: {},
      bestAnswers: {},
      chats: {},
      ratings: {},
    };
  });

  useEffect(() => {
    localStorage.setItem("unihelp_state", JSON.stringify(state));
  }, [state]);

  
  const addQuestion = (title, body, author, category = "other") => {
    const id = Date.now();
    const newQuestion = {
      id,
      title,
      body,
      author,
      category,
      answersCount: 0,
      resolved: false,
    };

    setState((prev) => ({
      ...prev,
      questions: [newQuestion, ...prev.questions],
    }));

    return id;
  };

  
  const addAnswer = (questionId, text, author) => {
    setState((prev) => {
      const prevAnswers = prev.answers[questionId] || [];
      const newAnswer = {
        id: Date.now(),
        questionId,
        text,
        author,
        createdAt: new Date().toISOString(),
      };
      const newAnswers = [newAnswer, ...prevAnswers];

      return {
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, answersCount: newAnswers.length } : q
        ),
        answers: {
          ...prev.answers,
          [questionId]: newAnswers,
        },
        bestAnswers: prev.bestAnswers,
        chats: prev.chats,
        ratings: prev.ratings,
      };
    });
  };

  
  const chooseBestAnswer = (questionId, answerId) => {
    setState((prev) => ({
      ...prev,
      bestAnswers: {
        ...prev.bestAnswers,
        [questionId]: answerId,
      },
    }));
  };

  
  const markQuestionResolved = (questionId, resolved = true) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, resolved } : q
      ),
    }));
  };

  
  const addChatMessage = (questionId, text, senderRole, senderName) => {
    setState((prev) => {
      const prevMessages = prev.chats[questionId] || [];

     
      const recipientRole = senderRole === "student" ? "helper" : "student";

      const now = new Date();
      const newMsg = {
        text,
        senderName,
        senderRole,
        createdAt: now.toISOString(),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unreadFor: recipientRole,
      };

      return {
        ...prev,
        chats: {
          ...prev.chats,
          [questionId]: [...prevMessages, newMsg],
        },
      };
    });
  };

  
  const markChatRead = (questionId, role) => {
    setState((prev) => {
      const msgs = prev.chats[questionId] || [];
      let changed = false;
      const updated = msgs.map((m) => {
        if (m.unreadFor === role) {
          changed = true;
          return { ...m, unreadFor: null };
        }
        return m;
      });

      if (!changed) return prev;

      return {
        ...prev,
        chats: {
          ...prev.chats,
          [questionId]: updated,
        },
      };
    });
  };

  
  const getUnreadCountForRole = (role) => {
    let count = 0;
    Object.values(state.chats).forEach((msgs) => {
      msgs.forEach((m) => {
        if (m.unreadFor === role) count += 1;
      });
    });
    return count;
  };

  
  const rateHelper = (questionId, value, helperName) => {
    setState((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [questionId]: { value, helperName },
      },
    }));
  };

  const value = {
    questions: state.questions,
    answersByQuestionId: state.answers,
    bestAnswers: state.bestAnswers,
    chatsByQuestionId: state.chats,
    ratings: state.ratings,
    addQuestion,
    addAnswer,
    chooseBestAnswer,
    markQuestionResolved,
    addChatMessage,
    markChatRead,
    getUnreadCountForRole,
    rateHelper,
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const ctx = useContext(QuestionsContext);
  if (!ctx) {
    throw new Error("useQuestions must be used within QuestionsProvider");
  }
  return ctx;
};