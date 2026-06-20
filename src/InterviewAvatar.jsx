import { motion } from "framer-motion";

function InterviewAvatar({
  side,
  avatar,
  message,
  speaking
}) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent:
          side === "left"
            ? "flex-start"
            : "flex-end",
        marginBottom: "25px",
        width: "100%"
      }}
    >

      <div
        style={{
          display: "flex",
          flexDirection:
            side === "left"
              ? "row"
              : "row-reverse",
          alignItems: "flex-end",
          gap: "15px",
          maxWidth: "75%"
        }}
      >

        {/* AVATAR */}

        <motion.img
          src={avatar}
          alt=""
          animate={
            speaking
              ? {
                  scale: [1, 1.05, 1]
                }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: 0.7
          }}
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
            borderRadius: "50%",
            background: "white"
          }}
        />

        {/* MESSAGE */}

        <div
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "18px",
            boxShadow:
              "0 5px 15px rgba(0,0,0,0.1)",
            fontSize: "17px",
            lineHeight: "1.6",
            maxWidth: "350px",
            wordBreak: "break-word",
            color: "black"
          }}
        >
          {message}
        </div>

      </div>

    </div>
  );
}

export default InterviewAvatar;