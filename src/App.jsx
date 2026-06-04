import InterviewCompleted from "./InterviewCompleted";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  useState,
  useEffect
} from "react";
import CookieConsent from "./CookieConsent";
import Interview from "./Interview";
import Analytics from "./Analytics";
import History from "./History";
import SessionDetails from "./SessionDetails";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./dashboard";
import About from "./About";
import Contact from "./Contact";
import Services from "./Services";
import Profile from "./Profile";
import ChatWithAi from "./ChatWithAi";
import Confirmation from "./Confirmation";
import MainInterview from "./MainInterview";

function App() {

  const autoLogin = async () => {

  try {

    const res = await fetch(
      "https://loving-dream-production-48cc.up.railway.app/check-login",
      {
        credentials: "include",
      }
    );

    const data =
      await res.json();

    if (data.logged_in) {

      localStorage.setItem(
        "user_id",
        data.user_id
      );

      localStorage.setItem(
        "user_name",
        data.name
      );

      localStorage.setItem(
        "user_email",
        data.email
      );

      setIsLoggedIn(true);
    }

  } catch (err) {

    console.log(err);

  }
};

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

  autoLogin();

}, []);

  return (
    <Router>

  {!isLoggedIn && <CookieConsent />}

  <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                goRegister={() => window.location.replace("/register")}
                goDashboard={() => setIsLoggedIn(true)}
              />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            <Register
              goLogin={() => window.location.replace("/")}
              goDashboard={() => setIsLoggedIn(true)}
            />
          }
        />

        {/* Dashboard */}
        <Route
  path="/dashboard"
  element={
    isLoggedIn ? (
      <Dashboard logout={() => setIsLoggedIn(false)} />
    ) : (
      <Navigate to="/" />
    )
  }
/>


        {/* Other Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/maininterview" element={<MainInterview />} />
        <Route path="/interview-completed" element={<InterviewCompleted />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:sessionId" element={<SessionDetails />} />
        <Route path="/chatwithai" element={<ChatWithAi/>} />
        


      </Routes>
    </Router>
  );
}

export default App;
