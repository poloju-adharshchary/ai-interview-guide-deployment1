import { useLocation, useNavigate } from "react-router-dom";
import GuideAssistant from "./GuideAssistant";

function Confirmation() {

  const navigate = useNavigate();

  const location = useLocation();

  const { role, difficulty } = location.state || {};

  return (
    <div style={containerStyle}>

      <GuideAssistant
       message="Please review your interview details and instructions before starting."
      />

     <div>

</div>
      <div style={cardStyle}>

        <h1>Interview Confirmation</h1>

        <h3>Selected Role:</h3>
        <p>{role}</p>

        <h3>Difficulty Level:</h3>
        <p>{difficulty}</p>

        <div style={instructionBox}>

          <h2>Instructions</h2>

          <ul>
  <li>Ensure your internet connection remains stable throughout the interview.</li>

  <li>Allow microphone access when prompted by your browser.</li>

  <li>Answer each question clearly, honestly, and professionally.</li>

  <li>The AI interviewer will generate questions based on your selected role and difficulty level.</li>

  <li>Answer independently without using external tools, AI assistants, search engines, books, notes, or reference materials.</li>

  <li>The purpose of this interview is to evaluate your actual knowledge, communication skills, and problem-solving abilities.</li>

  <li>Using external assistance may result in inaccurate scores and feedback.</li>

  <li>Take time to think before answering, but avoid excessive delays.</li>

  <li>Do not refresh, close, or navigate away from the interview page during the session.</li>

  <li>Complete all questions to receive a detailed performance report.</li>

  <li>Your responses will be analyzed automatically, and personalized feedback will be provided after the interview.</li>

  <li>Your interview history and performance records will be saved for future review and progress tracking.</li>

  <li>Treat this session as a real interview experience to obtain the most accurate assessment of your skills.</li>
</ul>

        </div>

        <h2 style={{ marginTop: "30px" }}>
          Shall We Start Interview?
        </h2>

        <div style={btnContainer}>

          <button
            style={yesBtn}
            onClick={() =>
              navigate("/maininterview", {
                state: {
                  role,
                  difficulty
                }
              })
            }
          >
            YES
          </button>

          <button
            style={noBtn}
            onClick={() => navigate("/interview")}
          >
            NO
          </button>

        </div>

      </div>

    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  background: "#c6d9f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 40px",
  overflow: "hidden",
  gap: "30px"
};
const leftSideStyle = {
  width: "28%",
  minWidth: "320px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  alignSelf: "flex-start",
  marginTop: "80px"
};

const cardStyle = {
  flex: 1,
  height: "90vh",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(115, 178, 214, 0.93)",
  padding: "35px",
  overflowY: "auto",
  overflowX: "hidden",
  boxSizing: "border-box",
  minWidth: "700px",
  maxWidth: "1100px"
};
const instructionBox = {
  marginTop: "20px",
  padding: "20px",
  background: "#edf4ff",
  borderRadius: "12px",
  lineHeight: "1.8",
  color: "#000"
};

const btnContainer = {
  marginTop: "40px",
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap"
};

const yesBtn = {
  padding: "12px 30px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px"
};

const noBtn = {
  padding: "12px 30px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px"
};

export default Confirmation;