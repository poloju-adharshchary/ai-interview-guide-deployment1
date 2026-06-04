import { useState, useEffect } from "react";

function CookieConsent() {

  const [show, setShow] = useState(false);

  useEffect(() => {

    const consent =
      localStorage.getItem("cookie_consent");

    if (!consent) {
      setShow(true);
    }

  }, []);

  const acceptCookies = () => {
    const consent =
localStorage.getItem(
  "cookie_consent"
);

if (consent === "accepted") {
  return null;
}

    localStorage.setItem(
      "cookie_consent",
      "accepted"
    );

    setShow(false);
  };

  const rejectCookies = () => {

    localStorage.setItem(
      "cookie_consent",
      "rejected"
    );

    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        background: "#111827",
        border: "1px solid #8b5cf6",
        borderRadius: "15px",
        padding: "20px",
        zIndex: 9999,
        color: "white",
        boxShadow:
          "0 0 25px rgba(139,92,246,.5)"
      }}
    >
      <h3>
        🍪 Cookie Preferences
      </h3>

      <p>
        We use cookies to keep you signed in,
        remember your preferences, and improve
        your experience.
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px"
        }}
      >
        <button
          onClick={acceptCookies}
          style={{
            background: "#8b5cf6",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Accept All Cookies
        </button>

        <button
          onClick={rejectCookies}
          style={{
            background: "#374151",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default CookieConsent;