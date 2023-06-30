import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../public/common.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootType = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootType);
const queryClient = new QueryClient();

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
