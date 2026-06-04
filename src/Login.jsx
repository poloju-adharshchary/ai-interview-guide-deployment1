import { useState, useEffect } from "react";

function Login({ goRegister, goDashboard }) {

  // STATE

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [showCookies, setShowCookies] =
  useState(false);

useEffect(() => {

  const consent =
    localStorage.getItem(
      "cookie_consent"
    );

  if (!consent) {

    setShowCookies(true);

  }

}, []);

  // LOGIN HANDLER

  const handleLogin = async () => {

    try {

      const res = await fetch(
        "http://localhost:8000/login",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      setMessage(data.message);

      if (data.success) {

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

  goDashboard();
}

    } catch (err) {

      setMessage("Server error. Try again.");

    }
  };

  if (showCookies) {

  return (

    <div
      style={{
        height: "100vh",
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >

      <div
        style={{
          width: "500px",
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          border:
            "1px solid #8b5cf6",
        }}
      >

        <h2>
          🍪 Cookie Preferences
        </h2>

        <p>
          We use cookies to keep you
          signed in and improve your
          experience.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >

          <button
            onClick={() => {

              localStorage.setItem(
                "cookie_consent",
                "accepted"
              );

              setShowCookies(false);

            }}
          >
            Accept All Cookies
          </button>

          <button
            onClick={() => {

              localStorage.setItem(
                "cookie_consent",
                "rejected"
              );

              setShowCookies(false);

            }}
          >
            Reject
          </button>

        </div>

      </div>

    </div>

  );

}
  
  return (

    <div className="auth-container">

      {/* LEFT SIDE */}

      <div className="auth-left">

        <h1>AI Interview Guide</h1>

        <p>
          Prepare smarter for interviews with AI-driven questions,
          instant feedback, and performance tracking.
        </p>

        <div className="feature-list">

          <div className="feature-item">
            <span>🎯</span>
            Real interview questions
          </div>

          <div className="feature-item">
            <span>📊</span>
            Instant AI feedback
          </div>

          <div className="feature-item">
            <span>🧠</span>
            Skill-wise performance analysis
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">

        <h2>Sign in</h2>

        <input
          type="email"
          placeholder="Email address"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        {message && <p>{message}</p>}

        <div className="social-divider">
          or continue with
        </div>

        <div className="social-buttons">

          <button
  onClick={() => {
    window.location.href =
      "http://localhost:8000/google-login";
  }}
>
  Continue with Google
</button>

          <button
  onClick={() => {
    window.location.href =
      "http://localhost:8000/github-login";
  }}
>
  Continue with GitHub
</button>

        </div>

        <div className="switch-text">

          Don’t have an account?{" "}

          <span onClick={goRegister}>
            Create one
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;