import Footer from "./Footer";
function About() {
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
          textShadow: "0 0 20px #8b5cf6",
        }}
      >
        About AI Interview Simulator
      </h1>

      <div
        style={{
          marginTop: "30px",
          background: "#111827",
          padding: "30px",
          borderRadius: "15px",
          lineHeight: "1.8",
        }}
      >
        <p>
          AI Interview Simulator & Performance Coach is an advanced interview
          preparation platform powered by Artificial Intelligence.
        </p>

        <p>
          The platform generates role-specific interview questions, evaluates
          answers, provides detailed feedback, tracks performance, and helps
          users improve their interview skills.
        </p>

        <p>
          Features include Offline AI, Online AI, Web Search AI, Chat History,
          Performance Analytics, and Personalized Learning.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default About;