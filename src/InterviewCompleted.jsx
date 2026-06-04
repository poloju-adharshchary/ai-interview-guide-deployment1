import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

function InterviewCompleted() {

  const navigate = useNavigate();

  const [questions, setQuestions] =
    useState([]);

  const [totalScore, setTotalScore] =
    useState(0);

  const [totalQuestions, setTotalQuestions] =
    useState(0);

  useEffect(() => {

    const fetchSession =
      async () => {

        try {

          const sessionId =
            localStorage.getItem(
              "session_id"
            );

          const response =
            await axios.get(
              `http://127.0.0.1:8000/get-session-details/${sessionId}`
            );

          const answers =
            response.data.answers;

          setQuestions(answers);

          let total = 0;

          answers.forEach((item) => {

            total += item.score;

          });

          setTotalScore(total);

          setTotalQuestions(
            answers.length
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchSession();

  }, []);

  const chartData = [
    {
      name: "Score",
      value: totalScore
    },
    {
      name: "Remaining",
      value:
        totalQuestions * 10 -
        totalScore
    }
  ];

  const COLORS = [
    "#00f5ff",
    "#1e293b"
  ];

  return (

    <div style={containerStyle}>

      <h1 style={titleStyle}>
        Interview Completed
      </h1>

      <div style={chartContainer}>

        <PieChart
          width={300}
          height={300}
        >

          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
          >

            {
              chartData.map(
                (
                  entry,
                  index
                ) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[index]
                    }
                  />

                )
              )
            }

          </Pie>

          <Tooltip />

        </PieChart>

        <h2 style={scoreStyle}>
          {totalScore}
          /
          {totalQuestions * 10}
        </h2>

      </div>

      <div style={questionBox}>

        {
          questions.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                style={questionItem}
              >

                <span>
                  Question {index + 1}
                </span>

                <span>
                  {item.score}/10
                </span>

              </div>

            )
          )
        }

      </div>

      <button
        style={dashboardButton}
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Back To Dashboard
      </button>

    </div>

  );

}

const containerStyle = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const titleStyle = {
  fontSize: "42px",
  marginBottom: "20px"
};

const chartContainer = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const scoreStyle = {
  position: "absolute",
  fontSize: "32px",
  color: "#00f5ff"
};

const questionBox = {
  width: "80%",
  marginTop: "40px",
  background: "#0f172a",
  borderRadius: "14px",
  padding: "20px"
};

const questionItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "16px",
  borderBottom:
    "1px solid #334155",
  fontSize: "18px"
};

const dashboardButton = {
  marginTop: "40px",
  padding: "14px 30px",
  background: "#00f5ff",
  color: "#020617",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default InterviewCompleted;