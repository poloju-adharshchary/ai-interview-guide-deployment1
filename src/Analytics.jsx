import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

function Analytics() {

  const navigate = useNavigate();

  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {

    loadAnalytics();

  }, []);

  const loadAnalytics = async () => {

    const userId =
      localStorage.getItem("user_id");

    const res = await fetch(
      `https://loving-dream-production-48cc.up.railway.app/analytics/${userId}`
    );

    const data =
      await res.json();

    setAnalytics(data);
  };

  if (!analytics) {

    return (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        Loading Analytics...
      </div>
    );
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Performance Tracking
      </h1>

      {/* Stats Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}
      >

        <div style={card}>
          <h3>Total Interviews</h3>
          <h1>
            {analytics.total_interviews}
          </h1>
        </div>

        <div style={card}>
          <h3>Average Score</h3>
          <h1>
            {analytics.average_score}
          </h1>
        </div>

        <div style={card}>
          <h3>Best Score</h3>
          <h1>
            {analytics.best_score}
          </h1>
        </div>
        <div style={card}>
  <h3>Strongest Role</h3>
  <h1>
    {analytics.strongest_role}
  </h1>
</div>

      </div>

      {/* Progress Chart */}

      <div style={chartCard}>

        <h2>
          Interview Progress
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart
            data={analytics.progress_data}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* Role Chart */}

      <div
        style={{
          ...chartCard,
          marginTop: "30px"
        }}
      >

        <h2>
          Role Performance
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={analytics.role_data}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="role" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="score"
              fill="#06b6d4"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Achievements */}

      <div
        style={{
          ...chartCard,
          marginTop: "30px"
        }}
      >

        <h2>
          Achievements
        </h2>

        {analytics.achievements.length === 0 ? (

          <p>
            No achievements yet.
          </p>

        ) : (

          analytics.achievements.map(
            (
              achievement,
              index
            ) => (

              <div
                key={index}
                style={{
                  background: "#1e293b",
                  padding: "15px",
                  marginTop: "10px",
                  borderRadius: "10px"
                }}
              >
                {achievement}
              </div>

            )
          )

        )}

      </div>

      {/* AI Coach */}

      <div
        style={{
          ...chartCard,
          marginTop: "30px"
        }}
      >

        <h2>
          AI Coach Summary
        </h2>

        <p
          style={{
            lineHeight: "1.8"
          }}
        >
          {analytics.coach_summary}
        </p>

      </div>

      {/* Back Button */}

      <button
        onClick={() =>
          navigate("/dashboard")
        }
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          background: "#8b5cf6",
          border: "none",
          borderRadius: "10px",
          color: "white",
          cursor: "pointer"
        }}
      >
        Back To Dashboard
      </button>

    </div>
  );
}

const card = {
  background: "#111827",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow:
    "0 0 20px rgba(139,92,246,0.35)"
};

const chartCard = {
  background: "#111827",
  padding: "25px",
  borderRadius: "15px",
  boxShadow:
    "0 0 20px rgba(139,92,246,0.35)"
};

export default Analytics;