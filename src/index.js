import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { QuestionsProvider } from "./QuestionsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QuestionsProvider>
        <App />
      </QuestionsProvider>
    </BrowserRouter>
  </React.StrictMode>
);