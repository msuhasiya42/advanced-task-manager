import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../public/common.css";
import App from "./App";
import { QueryClient, QueryClientProvider, } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./components/theme-provider";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootType = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootType);
const queryClient = new QueryClient();

export default App;

root.render(
  // <React.StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <GoogleOAuthProvider clientId="1032180948351-qcskgfti1iibbdhq4tavjmjuq3kl3b0k.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </ThemeProvider>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
