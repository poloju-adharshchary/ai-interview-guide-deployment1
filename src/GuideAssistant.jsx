import Lottie from "lottie-react";

import { useEffect, useRef } from "react";

import guideAnimation from "./assets/lottie/guide.json";

function GuideAssistant({ message }) {
  const hasSpoken = useRef(false);

  useEffect(() => {

  if (hasSpoken.current) return;

  hasSpoken.current = true;

  speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(message);

  speech.rate = 1;

  speechSynthesis.speak(speech);

}, []);

  return (

    <div style={containerStyle}>

      {/* AVATAR */}

      <div style={avatarStyle}>

        <Lottie
          animationData={guideAnimation}
          loop={true}
        />

      </div>

      {/* MESSAGE */}

      <div style={messageStyle}>

        {message}

      </div>

    </div>
  );
}

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "20px",
  width: "100%",
  marginBottom: "30px"
};

const avatarStyle = {
  width: "180px",
  height: "180px",
  flexShrink: 0
};

const messageStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  maxWidth: "400px",
  fontSize: "16px",
  textAlign: "left",
  color: "black"
};

export default GuideAssistant;