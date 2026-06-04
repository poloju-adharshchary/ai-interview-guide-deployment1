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
            <li>Make sure microphone works properly.</li>
            <li>Stay in quiet environment.</li>
            <li>Do not refresh during interview.</li>
            <li>Answer clearly and confidently.</li>
            <li>Offline AI model will conduct interview.</li>
            <li>Complete all questions carefully.</li>
            <li>Stay focused until session ends.</li>
            <li>Performance will be analyzed.</li>
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
  lineHeight: "1.8"
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