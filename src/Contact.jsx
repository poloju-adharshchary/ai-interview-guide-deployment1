import Footer from "./Footer";
function Contact() {
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
        Contact Us
      </h1>

      <div
        style={{
          marginTop: "40px",
          background: "#111827",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid #8b5cf6",
        }}
      >
        <h3>Developer Information</h3>

        <p>Email: polojuadharshchary@gmail.com</p>

        <p>Phone: +91 6305251605</p>

        <p>
          Feel free to contact for project collaboration, interview guidance,
          and technical support.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;