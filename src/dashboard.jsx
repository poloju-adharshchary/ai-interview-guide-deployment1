import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useState } from "react";
import "./dashboard.css";
import laptopImage from "./assets/img1.jpeg";


function Dashboard({ logout })
 {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  return (
    <div className="dashboard dashboard-full">


      {/* TOP BAR */}
      <header className="topbar">
        <div className="brand">AI Interview</div>

        <nav className="top-actions">
          <button onClick={() => navigate("/services")}>Services</button>
<button onClick={() => navigate("/contact")}>Contact</button>
<button onClick={() => navigate("/about")}>About</button>
<button onClick={() => navigate("/profile")}>Profile</button>
<button
  className="logout"
  onClick={() => {
    logout();
  }}
>
  Sign Out
</button>

        </nav>
      </header>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <button
            className={active === "start" ? "active" : ""}
            onClick={() => setActive("start")}
          >
            Start Interview
          </button>

          <button
            className={active === "performance" ? "active" : ""}
            onClick={() => setActive("performance")}
          >
            Performance Tracking
          </button>

          <button
            className={active === "history" ? "active" : ""}
            onClick={() => setActive("history")}
          >
            Interview History
          </button>
          <button
            className={active === "chatwithai" ? "active" : ""}
            onClick={() => setActive("chatwithai")}
          >
            Chat With Ai
          </button>
        </aside>

        {/* CONTENT */}
        <main className="content content-layout">

  <div className="content-left">
    {active === "home" && (
      <div className="card">
        <h1>Dashboard Overview</h1>
        <p>Manage interviews, analyze performance, and improve continuously.</p>
        <button className="primary">Get Started</button>
      </div>
    )}

    {active === "start" && (
      <div className="card">
        <h2>Start Interview</h2>
        <p>Configure and begin your AI session.</p>
        <button
  className="primary"
  onClick={() => navigate("/interview")}
>
  Begin Setup
</button>

      </div>
    )}

    {active === "performance" && (
      <div className="card">
        <h2>Performance Tracking</h2>
        <p>Analyze weekly, monthly and yearly growth.</p>
        <button
  className="primary"
  onClick={() => navigate("/analytics")}
>
  View Analytics
</button>

      </div>
    )}

    {active === "history" && (
      <div className="card">
        <h2>Interview History</h2>
        <p>Review past sessions and feedback reports.</p>
        <button
  className="primary"
  onClick={() => navigate("/history")}
>
  View History
</button>

      </div>
    )}

     {active === "chatwithai" && (
      <div className="card">
        <h2>Ask your doubts & Questions with ai</h2>
        <p>Ask your questions and improve your skills</p>
        <button
  className="primary"
  onClick={() => navigate("/ChatWithAi")}
>
  Chat with ai
</button>

      </div>
    )}

  </div>

  <div className="content-right">
  <img src={laptopImage} alt="Professional working" />
</div>


</main>

      </div>

      <Footer />
      
    </div>
  );
}

export default Dashboard;