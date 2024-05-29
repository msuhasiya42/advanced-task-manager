import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import ContactUs from "./components/ContactUs/ContactUs";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ProtectedRoute from "./components/Protected/Protected";
import Home from "./components/Home/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import React from "react";
import HeaderPage from "./components/HeaderPage/HeaderPage";
import AboutMe from "./components/AboutMe/AboutMe";

function App() {


  return (
    <Router>
      <div className="flex h-full">
        <HeaderPage />
        <div className="flex-1 w-screen mt-12">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoute>
                  <ContactUs />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
