function Footer() {
  return (
    <footer
      style={{
        marginTop: "80px",
        padding: "40px 60px",
        background: "#0f172a",
        borderTop: "1px solid #1e293b",
        color: "#cbd5e1",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        {/* Left Side */}
        <div>
          <h2
            style={{
              color: "white",
              marginBottom: "10px",
            }}
          >
            AI Interview Simulator
          </h2>

          <p
            style={{
              maxWidth: "400px",
              lineHeight: "1.8",
            }}
          >
            Practice interviews, improve communication skills,
            analyze performance, and prepare for real-world
            technical interviews using AI.
          </p>
        </div>

        {/* Center */}
        <div>
          <h3 style={{ color: "white" }}>
            Features
          </h3>

          <p>AI Interviews</p>
          <p>Performance Analytics</p>
          <p>Chat With AI</p>
          <p>Interview History</p>
        </div>

        {/* Right */}
        <div>
          <h3 style={{ color: "white" }}>
            Contact
          </h3>

          <p>
            polojuadharshchary@gmail.com
          </p>

          <p>
            +91 6305251605
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #1e293b",
          paddingTop: "20px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        © 2026 AI Interview Simulator & Performance Coach
      </div>
    </footer>
  );
}

export default Footer;