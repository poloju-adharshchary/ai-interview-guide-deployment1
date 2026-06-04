import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  useNavigate,
  useLocation
} from "react-router-dom";

import InterviewAvatar from "./InterviewAvatar";

import Female1 from "./assets/interview/Female1.png";
import Female2 from "./assets/interview/Female2.png";
import Female3 from "./assets/interview/female3.png";
import Female4 from "./assets/interview/female4.png";

import Male1 from "./assets/interview/male1.png";
import Male2 from "./assets/interview/male2.png";
import Male3 from "./assets/interview/male3.png";
import Male4 from "./assets/interview/male4.png";

import FemaleUser1 from "./assets/interview/femaleuser1.png";
import FemaleUser2 from "./assets/interview/femaleuser2.png";

import MaleUser1 from "./assets/interview/maleuser1.png";
import MaleUser2 from "./assets/interview/maleuser2.png";

function MainInterview() {

  const navigate = useNavigate();

  const location = useLocation();

const {
  role,
  difficulty
} = location.state || {
  role: role,
difficulty: difficulty
};

  const [question, setQuestion] =
    useState("");

  const [userAnswer, setUserAnswer] =
    useState("");
  const [feedback, setFeedback] =
  useState("");

const [score, setScore] =
  useState(0);
  const [sessionId, setSessionId] =
  useState(null);

  const sessionIdRef = useRef(null);

  const questionRef = useRef("");

  const [speaking, setSpeaking] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);
  const recorderRef = useRef(null);

  const streamRef = useRef(null);

  const hasStarted = useRef(false);
  const sessionEnded = useRef(false);


  // INTERVIEWER AVATARS

  const interviewerAvatars = [
    Female1,
    Female2,
    Female3,
    Female4,
    Male1,
    Male2,
    Male3,
    Male4
  ];

  // USER AVATARS

  const userAvatars = [
    FemaleUser1,
    FemaleUser2,
    MaleUser1,
    MaleUser2
  ];

  // RANDOM INTERVIEWER
  // ONLY PER SESSION

  const [randomInterviewer] = useState(
    interviewerAvatars[
      Math.floor(
        Math.random() *
        interviewerAvatars.length
      )
    ]
  );

  // FIXED USER AVATAR

  const randomUser = MaleUser1;

  // SPEAK TEXT

  const speakText = (
    text,
    callback = null
  ) => {

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    setSpeaking(true);

    speech.onend = () => {
      if (sessionEnded.current) return;

      setSpeaking(false);

      if (callback) {

        setTimeout(() => {

          callback();

        }, 1000);

      }

    };

    window.speechSynthesis.speak(speech);
  };

  // GET QUESTION FROM AI

  const getQuestion = async (
  activeSessionId = sessionId
) => {

    try {

      const response =
        await axios.post(
          "http://127.0.0.1:8000/generate-question",
          {
            role: role,
            difficulty: difficulty
          }
        );

      const aiQuestion =
  response.data.question;

questionRef.current = aiQuestion;

setUserAnswer("");
setQuestion(aiQuestion);

      speakText(
        aiQuestion,
        () => {

          startListening();

        }
      );

    } catch (error) {

      console.log(error);

    }

  };

  // RECORD USER AUDIO

  const startListening = async () => {
    
    setUserAnswer("");

    try {

      const stream =
     await navigator.mediaDevices.getUserMedia({
     audio: true
     });

      const recorder =
     new MediaRecorder(stream);
      console.log(
     "Recorder Started:",
      recorder.state
       );
      recorderRef.current = recorder;

     streamRef.current = stream;

      let chunks = [];

      setIsListening(true);

      recorder.ondataavailable =
        (event) => {
          console.log("User Speaking...");
            
          chunks.push(event.data);

        };

      recorder.onstop = async () => {
      
        const audioBlob =
          new Blob(
            chunks,
            {
              type: recorder.mimeType
            }
          );

        const formData =
          new FormData();

        formData.append(
          "audio",
          audioBlob,
          `recording.${recorder.mimeType.includes("webm") ? "webm" : "wav"}`
        );

        try {

          const response =
            await axios.post(
              "http://127.0.0.1:8000/speech-to-text",
              formData
            );

          const text = response.data.text;
          if (!text || text.trim() === "") {

     speakText(
      "No answer detected."
     );

      return;

     }

          setUserAnswer(text);

          setIsListening(false);

          console.log(
  "Question being sent:",
  question
);
          const evaluation =
  await axios.post(
    "http://127.0.0.1:8000/evaluate-answer",
    {
      session_id:
  sessionIdRef.current,
      question: questionRef.current,
      answer: text
    }
  );

const aiFeedback =
  evaluation.data.feedback;

const aiScore =
  evaluation.data.score;

setFeedback(aiFeedback);

setScore(aiScore);

          // AI FEEDBACK

          // AI FEEDBACK

         speakText(
  `Score ${aiScore} out of 10. ${aiFeedback}`,
  () => {

    setUserAnswer("");

    setFeedback("");

    getQuestion();

  }
);

        } catch (error) {

          console.log(error);

        }

      };

      recorder.start();
      


      } 
     catch (error) {

      console.log(error);


}
 };

  // RUN ONLY ONCE

  useEffect(() => {

  if (hasStarted.current)
    return;

  hasStarted.current = true;

  const startInterview =
  async () => {

    try {

      const response =
  await axios.post(
    "http://127.0.0.1:8000/create-session",
    {
      user_id: Number( localStorage.getItem("user_id")),
      role: role,
      difficulty: difficulty 
    }
  );

const newSessionId =
  response.data.session_id;

setSessionId(newSessionId);

sessionIdRef.current =
  newSessionId;
  localStorage.setItem(
  "session_id",
  newSessionId
);

getQuestion(newSessionId);

    } catch (error) {

      console.log(error);

    }

  };

startInterview();

  return () => {
    

  // STOP SPEECH

   window.speechSynthesis.cancel();

  // STOP RECORDER

  if (
  recorderRef.current &&
  recorderRef.current.state !== "inactive"
) {

  recorderRef.current.stop();

}

  // STOP MICROPHONE

  if (streamRef.current) {

    streamRef.current
      .getTracks()
      .forEach((track) =>
        track.stop()
      );

  }

};

}, []);

  return (

    <div style={containerStyle}>
<button
  style={finishButton}
  onClick={() => {
    

    if (recorderRef.current) {

      recorderRef.current.stop();

    }

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

    }

  }}
>
  Finish Answer
</button>
  <button
    style={endButton}
    onClick={() => {

  // STOP AI SPEECH

  window.speechSynthesis.cancel();

  // STOP RECORDING

  if (recorderRef.current) {

    recorderRef.current.stop();

  }

  // STOP MICROPHONE

  if (streamRef.current) {

    streamRef.current
      .getTracks()
      .forEach((track) =>
        track.stop()
      );

  }

  setIsListening(false);

  navigate("/interview-completed");

}}
  >
    End Interview
  </button>
      {/* AI INTERVIEWER */}

      <InterviewAvatar
        side="left"
        avatar={randomInterviewer}
        message={question}
        speaking={speaking}
      />

      {/* USER */}

      <InterviewAvatar
        side="right"
        avatar={randomUser}
        message={
          userAnswer
            ? userAnswer
            : isListening
            ? "Listening..."
            : "Waiting..."
        }
        speaking={isListening}
      />

    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  background: "#c6d9f1",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflowY: "auto"
};

const endButton = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "red",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px"
};

const finishButton = {
  position: "absolute",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px 24px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px"
};

export default MainInterview;
  