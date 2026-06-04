import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GuideAssistant from "./GuideAssistant";

function Interview() {
  const navigate = useNavigate();

  // ADDED
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Easy");

  return (
    <div style={containerStyle}>
      <GuideAssistant
       message="Welcome to the interview setup page. Please select your role and difficulty."
      />

      <div>

<h1>Interview Setup</h1>

<p>
  Select role, difficulty level,
  and start your AI interview session.
</p>

<div style={cardStyle}>

        <label>Role:</label>

        {/* MODIFIED */}
        <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option>Frontend Developer</option>
  <option>Backend Developer</option>
  <option>Full Stack Developer</option>
  <option>Java Developer</option>
  <option>Python Developer</option>
  <option>React Developer</option>
  <option>Node.js Developer</option>
  <option>Software Engineer</option>
  <option>Data Analyst</option>
  <option>Data Scientist</option>
  <option>Machine Learning Engineer</option>
  <option>AI Engineer</option>
  <option>Cyber Security Analyst</option>
  <option>Network Engineer</option>
  <option>Cloud Engineer</option>
  <option>DevOps Engineer</option>
  <option>QA Engineer</option>
  <option>Business Analyst</option>
  <option>System Administrator</option>
  <option>Android Developer</option>
  <option>iOS Developer</option>
</select>

        <label style={{ marginTop: "15px" }}>Difficulty:</label>

        {/* MODIFIED */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        {/* MODIFIED */}
        <button
          style={primaryBtn}
          onClick={() =>
            navigate("/confirmation", {
              state: {
                role,
                difficulty
              }
            })
          }
        >
          Next
        </button>
      </div>
    </div>
      <button style={backBtn} onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  background: "#c6d9f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "40px",
  gap: "40px"
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
  marginTop: "20px",
  boxShadow: "0 5px 15px rgba(115, 178, 214, 0.93)",
  display: "flex",
  flexDirection: "column"
};

const primaryBtn = {
  marginTop: "20px",
  padding: "10px",
  background: "#3d8eeb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const backBtn = {
  marginTop: "30px",
  padding: "8px 15px",
  background: "#3d8eeb",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Interview;