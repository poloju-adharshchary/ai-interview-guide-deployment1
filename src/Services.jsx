import Footer from "./Footer";
function Services() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#8b5cf6",
          marginBottom: "20px",
          textShadow: "0 0 20px #8b5cf6",
        }}
      >
        Our Services
      </h1>

      <p
        style={{
          color: "#9ca3af",
          fontSize: "18px",
          marginBottom: "40px",
        }}
      >
        AI-powered interview preparation ecosystem designed to help candidates
        succeed in technical and HR interviews.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "25px",
        }}
      >
        {[
          "AI Mock Interviews",
          "Performance Analytics",
          "Resume Review",
          "Skill Assessment",
          "AI Feedback",
          "Career Roadmaps",
        ].map((item) => (
          <div
            key={item}
            style={{
              background: "#111827",
              border: "1px solid #8b5cf6",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 0 20px rgba(139,92,246,.3)",
            }}
          >
            <h3>{item}</h3>
            <p style={{ color: "#9ca3af" }}>
              Professional AI-driven assistance for interview preparation and
              career growth.
            </p>
          </div>
        ))}
      </div>
       <Footer />
    </div>
  );
}

export default Services;