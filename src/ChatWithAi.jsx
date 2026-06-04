import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Search } from "lucide-react";

function ChatWithAi() {
  const navigate = useNavigate();
  
 const [sessions, setSessions] = useState([]);

const loadSessions = async () => {

  const userId =
    localStorage.getItem("user_id");

  const res = await fetch(
    `https://loving-dream-production-48cc.up.railway.app/chat-sessions/${userId}`
  );

  const data =
    await res.json();

  setSessions(
    data.sessions || []
  );
};
useEffect(() => {
  loadSessions();
}, []);

  const [selectedModel, setSelectedModel] = useState("Online AI");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

const [messages, setMessages] = useState([
  {
    role: "assistant",
    content: "Hello! How can I help you today?",
  },
]);

   const [input, setInput] = useState("");
   

   const filteredSessions =
  sessions.filter((chat) =>
    chat.title
      ?.toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )
  );

   return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0a0a0a",
        color: "white",
      }}
    >
      {/* Sidebar */}
<div
  style={{
    width: "320px",
    background: "#111827",
    borderRight: "1px solid #1f2937",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "100vh"
  }}
>
      
        <button onClick={() => {

   setMessages([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
   ]);

   setTypingText("");
   setInput("");

   setCurrentSessionId(null);

}}

          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "#7c3aed",
            color: "white",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          <Plus size={18} /> New Chat
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1f2937",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <Search size={16} />
          <input
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  placeholder="Search chats..."
  style={{
              marginLeft: "10px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "white",
              width: "100%",
            }}
          />
        </div>
       
        <button
  onClick={async () => {

    const confirmed =
      window.confirm(
        "Delete all chat history?"
      );

    if (!confirmed) return;

    const userId =
      localStorage.getItem(
        "user_id"
      );

    await fetch(
      `https://loving-dream-production-48cc.up.railway.app/delete-all-chat-sessions/${userId}`,
      {
        method: "DELETE",
      }
    );

    setSessions([]);

    setMessages([
      {
        role: "assistant",
        content:
          "Hello! How can I help you today?",
      },
    ]);

    setCurrentSessionId(null);

  }}
  style={{
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    cursor: "pointer",
    marginBottom: "15px",
    fontWeight: "bold",
  }}
>
  Clear Chat History
</button>

        <h3 style={{ color: "#9ca3af" }}>Recent Chats</h3>

<div
  style={{
    flex: 1,
    overflowY: "auto",
    marginTop: "10px",
  }}
>
  {filteredSessions.map((chat) => (
    <div
      key={chat.id}
      onClick={async () => {

        setCurrentSessionId(chat.id);

        const res = await fetch(
          `https://loving-dream-production-48cc.up.railway.app/chat-messages/${chat.id}`
        );

        const data = await res.json();

        setMessages(
          data.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
        );
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px",
        marginTop: "10px",
        borderRadius: "10px",
        cursor: "pointer",
        background: "#1f2937",
      }}
    >
      <MessageSquare size={16} />
      <span>{chat.title}</span>
    </div>
  ))}
</div>
      </div>

      {/* Main Area */}
      <div
   style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#0a0a0a",
   } 
      }
>
  {/* Header */}

  <div
    style={{
      padding: "15px 25px",
      borderBottom: "1px solid #222",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h2>New Chat</h2>

    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
      style={{
        padding: "10px",
        borderRadius: "10px",
        background: "#111827",
        color: "white",
      }}
    >
      {/*<option> Offline LLM</option>   for deployment purpose*/}
      <option>Online AI</option>
      <option>Web Search</option>
    </select>
  </div>



  <div
    style={{
      flex: 1,
      overflowY: "auto",
      padding: "20px",
    }}
  >
    {messages.map((message, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent:
            message.role === "user"
              ? "flex-end"
              : "flex-start",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            maxWidth: "70%",
            padding: "15px",
            borderRadius: "15px",
            background:
              message.role === "user"
                ? "#7c3aed"
                : "#1f2937",
          }}
        >
          <ReactMarkdown>
  {String(message.content || "")}
   </ReactMarkdown>
        </div>
      </div>
    ))}

    {isThinking && (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: "15px",
    }}
  >
    <div
      style={{
        background: "#1f2937",
        padding: "15px",
        borderRadius: "15px",
        fontSize: "24px",
      }}
    >
      ● ● ●
    </div>
  </div>
)}

{typingText && (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: "15px",
    }}
  >
    <div
      style={{
        maxWidth: "70%",
        padding: "15px",
        borderRadius: "15px",
        background: "#1f2937",
      }}
    >
      {typingText}
    </div>
  </div>
)}

  </div>

  {/* Input */}

  <div
    style={{
      padding: "20px",
      borderTop: "1px solid #222",
      display: "flex",
      gap: "10px",
    }}
  >
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message..."
      style={{
        flex: 1,
        padding: "15px",
        borderRadius: "12px",
        border: "none",
        outline: "none",
        background: "#111827",
        color: "white",
      }}
    />

    <button
      onClick={async () => {
  if (!input.trim()) return;

  const userMessage = input;

  let sessionId = currentSessionId;

if (!sessionId) {

  const createRes = await fetch(
    "https://loving-dream-production-48cc.up.railway.app/create-chat-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        model_type: selectedModel,
      }),
    }
  );

  const createData =
    await createRes.json();

  sessionId =
    createData.session_id;

  setCurrentSessionId(
    sessionId
  );
}

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userMessage,
    },
  ]);

  await fetch(
  "https://loving-dream-production-48cc.up.railway.app/save-chat-message",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      role: "user",
      content: userMessage,
    }),
  }
);

  setInput("");

  try {

  setIsThinking(true);

  const res = await fetch(
    "https://loving-dream-production-48cc.up.railway.app/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  message: userMessage,
  model_type: selectedModel
}),
    }
  );

  const reader =
    res.body.getReader();

  const decoder =
    new TextDecoder();

  let fullResponse = "";

  setTypingText("");

  setTypingText("");


  let firstChunk = true;

while (true) {

  const { done, value } =
    await reader.read();

  if (done) break;

  const chunk =
    decoder.decode(value);

  if (firstChunk) {

    setIsThinking(false);

    firstChunk = false;

  }

  fullResponse += chunk;

  setTypingText(fullResponse);

}

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: fullResponse,
    },
  ]);

  await fetch(
  "https://loving-dream-production-48cc.up.railway.app/save-chat-message",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      role: "assistant",
      content: fullResponse,
    }),
  }
);

await fetch(`https://loving-dream-production-48cc.up.railway.app/generate-chat-title/${sessionId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  message: userMessage,
  model_type: selectedModel
}),
  }
);
await loadSessions();

  setTypingText("");

} catch (err) {

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content:
        "Failed to connect to AI.",
    },
  ]);

  setIsThinking(false);

}
}}
      style={{
        padding: "15px 25px",
        borderRadius: "12px",
        border: "none",
        background: "#7c3aed",
        color: "white",
        cursor: "pointer",
      }}
    >
      Send
    </button>
  </div>
</div>
    </div>
  );
}

export default ChatWithAi;