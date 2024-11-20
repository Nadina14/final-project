import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { SearchContextProvider } from "./context/SearchContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserProvider>
      <SearchContextProvider>
        <App />
      </SearchContextProvider>
    </UserProvider>
  </BrowserRouter>
);
