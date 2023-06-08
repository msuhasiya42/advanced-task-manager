import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/Protected";
// import Auth from "./components/auth";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Auth />}> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* </Route> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aboutus"
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contactus"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />

        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
