
# AI Interview Simulator & Performance Coach

## Project Overview

AI Interview Simulator & Performance Coach is an AI-powered interview preparation platform that helps users practice interviews, receive AI-generated feedback, track performance, chat with AI assistants, and improve interview skills through intelligent evaluation.

The platform provides:

* AI-generated interview questions
* AI-based answer evaluation
* Interview performance tracking
* Interview history management
* AI Chat Assistant
* Multiple AI modes

  * Offline LLM
  * Online AI
  * Web Search AI
* Speech-to-Text support
* User authentication
* Profile management
* Session history storage
* Analytics and reporting

---

# Main Objectives

The project aims to:

* Simulate real interviews
* Evaluate candidate answers
* Provide realistic feedback
* Track interview performance
* Allow AI-assisted learning
* Support both offline and online AI systems
* Store complete interview and chat history

---

# Technologies Used

## Frontend

* React.js
* React Router DOM
* React Markdown
* Lucide React Icons
* JavaScript
* HTML
* CSS

---

## Backend

* Python
* FastAPI
* Uvicorn

---

## Database

* MySQL

Database Name:

```sql
ai_interview
```

---

## AI Technologies


### Online AI

Provider:

```text
Groq
```

Model:

```text
llama-3.3-70b-versatile
```

Used For:

* Online AI Chat

---

### Web Search AI

Search Engine:

```text
DuckDuckGo Search
```

AI Summarization:

```text
Groq
Llama-3.3-70B-Versatile
```

Used For:

* Internet searching
* AI summarized answers
* Source-aware responses

---

## Speech Processing

### Speech To Text

Library:

```text
Faster Whisper
```

Used For:

* Audio transcription
* Voice answer conversion

---

# AI Modes


## 1. Online AI Mode

Uses:

```text
Groq API
Llama 3.3 70B
```

Features:

* Faster responses
* Larger AI model
* Better reasoning
* Internet-based AI

---

## 2. Web Search Mode

Uses:

```text
DuckDuckGo Search
+
Groq AI
```

Features:

* Searches the internet
* Collects relevant information
* AI summarizes results
* Provides source links

---

# Database Tables

## users

Stores user information.

Fields:

```text
id
name
email
password
provider
created_at
profile_photo
```

---

## interview_sessions

Stores interview sessions.

Fields:

```text
id
user_id
role
difficulty
total_score
total_questions
created_at
```

---

## interview_answers

Stores interview answers.

Fields:

```text
id
session_id
question
user_answer
ai_feedback
ideal_answer
score
created_at
```

---

## chat_sessions

Stores chat history sessions.

Fields:

```text
id
user_id
title
model_type
created_at
updated_at
```

---

## chat_messages

Stores individual chat messages.

Fields:

```text
id
session_id
role
content
created_at
```

---

# Major Features

## Authentication

Features:

* User Registration
* User Login
* Password Hashing
* Cookie-Based Login Persistence

---

## Profile Management

Features:

* User Information
* Profile Photo Upload
* Persistent Profile Photo Storage
* Password Change

---

## AI Interview Module

Features:

* Role-Based Interview
* Difficulty-Based Interview
* AI Question Generation
* AI Answer Evaluation
* Score Generation
* Ideal Answers
* AI Feedback

---

## Interview History

Features:

* Session Storage
* Previous Interview Viewing
* Question Wise Results
* Score Tracking

---

## Analytics

Features:

* Performance Tracking
* Session Analysis
* Score Monitoring

---

## Chat With AI

Features:

* ChatGPT-like Interface
* New Chat
* Chat History
* Session Management
* Auto Chat Title Generation
* Search Chats
* Multiple AI Modes
* Persistent Chat Storage

---

# Backend APIs

## Authentication APIs

### Register

```http
POST /register
```

---

### Login

```http
POST /login
```

---

## Interview APIs

### Create Interview Session

```http
POST /create-session
```

---

### Generate Question

```http
POST /generate-question
```

---

### Evaluate Answer

```http
POST /evaluate-answer
```

---

### Get Session Details

```http
GET /get-session-details/{session_id}
```

---

### Get User Sessions

```http
GET /user-sessions/{user_id}
```

---

## Speech APIs

### Speech To Text

```http
POST /speech-to-text
```

---

## Chat APIs

### Create Chat Session

```http
POST /create-chat-session
```

---

### Get Chat Sessions

```http
GET /chat-sessions/{user_id}
```

---

### Save Chat Message

```http
POST /save-chat-message
```

---

### Get Chat Messages

```http
GET /chat-messages/{session_id}
```

---

### Generate Chat Title

```http
PUT /generate-chat-title/{session_id}
```

---

### Chat

```http
POST /chat
```

Supports:

```text
Offline LLM
Online AI
Web Search
```

---

# Project Workflow

## Interview Workflow

```text
Login
   ↓
Dashboard
   ↓
Select Role
   ↓
Select Difficulty
   ↓
AI Generates Question
   ↓
User Answers
   ↓
AI Evaluation
   ↓
Score + Feedback
   ↓
Store In Database
   ↓
Analytics & History
```

---

## Chat Workflow

```text
Login
   ↓
Chat With AI
   ↓
Select AI Mode
   ↓
Ask Question
   ↓
AI Response
   ↓
Save Chat
   ↓
Generate Title
   ↓
Store Session
   ↓
History Sidebar
```

---

# Current AI Models

| Feature               | Model                      |
| --------------------- | -------------------------- |
| Interview Questions   | Llama 3.3 70B              |
| Interview Evaluation  | Llama 3.3 70B              |
| Offline Chat          | Llama 3.3 70B              |
| Chat Title Generation | Llama 3.3 70B              |
| Online AI             | Llama 3.3 70B              |
| Web Search AI         | DuckDuckGo + Llama 3.3 70B |
| Speech To Text        | Faster Whisper             |

---

# Project Author

**Poloju Adharsh**

Computer Science Engineering (CSE)

AI Interview Simulator & Performance Coach Project


