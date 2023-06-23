import { redirect } from "react-router-dom";

export const Logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  redirect("/login");
};
