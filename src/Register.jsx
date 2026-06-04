import { useState } from "react";

function Register({ goLogin, goDashboard }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("https://loving-dream-production-48cc.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        goDashboard(); // AUTO redirect after register
      }

    } catch (err) {
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Join AI Interview Guide</h1>
        <p>
          Create your account and start preparing
          smarter for interviews with AI assistance.
        </p>
      </div>

      <div className="auth-right">
        <h2>Create account</h2>

        <input
          type="text"
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        {message && <p>{message}</p>}

        <div className="switch-text">
          Already have an account?{" "}
          <span onClick={goLogin}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
