from llm_service import (
    generate_question,
    evaluate_answer,
    stream_chat_with_ai,
    generate_chat_title,
    stream_online_ai,
    stream_web_search
)
from starlette.middleware.sessions import SessionMiddleware
from fastapi import Response
from fastapi import Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os
from fastapi import UploadFile, File
import shutil
from fastapi.responses import StreamingResponse
from speech_to_text import transcribe_audio
from fastapi import FastAPI
from fastapi import Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import create_database, get_db
from models import create_tables
from security import hash_password, verify_password

load_dotenv()

app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key="ai_interview_secret_key_2026"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv(
        "GOOGLE_CLIENT_ID"
    ),
    client_secret=os.getenv(
        "GOOGLE_CLIENT_SECRET"
    ),
    server_metadata_url=
    "https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)

oauth.register(
    name="github",
    client_id=os.getenv(
        "GITHUB_CLIENT_ID"
    ),
    client_secret=os.getenv(
        "GITHUB_CLIENT_SECRET"
    ),
    access_token_url=
    "https://github.com/login/oauth/access_token",
    authorize_url=
    "https://github.com/login/oauth/authorize",
    api_base_url=
    "https://api.github.com/",
    client_kwargs={
        "scope": "user:email"
    }
)

@app.on_event("startup")
def startup():
    create_database()
    create_tables()

class Register(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str
class InterviewRequest(BaseModel):
    role: str
    difficulty: str
class EvaluationRequest(BaseModel):

    session_id: int

    question: str

    answer: str
class SessionRequest(BaseModel):

    user_id: int

    role: str

    difficulty: str
class ChatSessionRequest(BaseModel):
    user_id: int
    model_type: str = "Offline LLM"
class ChatRequest(BaseModel):
    message: str
    model_type: str
class SaveChatMessage(BaseModel):
    session_id: int
    role: str
    content: str
class ChangePasswordRequest(
    BaseModel
):
    email: str
    old_password: str
    new_password: str
class UpdatePhotoRequest(BaseModel):
    user_id: int
    photo: str

@app.post("/create-session")
def create_session(
    data: SessionRequest
):

    db = get_db()

    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO interview_sessions
        (
            user_id,
            role,
            difficulty
        )

        VALUES (%s, %s, %s)
        """,
        (
            data.user_id,
            data.role,
            data.difficulty
        )
    )

    db.commit()

    session_id = cursor.lastrowid

    db.close()

    return {
        "success": True,
        "session_id": session_id
    }

@app.post("/register")
def register(data: Register):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM users WHERE email=%s", (data.email,))
    if cursor.fetchone():
        return {"success": False, "message": "Email already exists"}

    cursor.execute(
        "INSERT INTO users (name,email,password,provider) VALUES (%s,%s,%s,'local')",
        (data.name, data.email, hash_password(data.password))
    )
    db.commit()
    return {"success": True, "message": "Registration successful"}

@app.post("/login")
def login(
    data: Login,
    response: Response
):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()

    if not user or not verify_password(data.password, user["password"]):
        return {"success": False, "message": "Invalid credentials"}

    response.set_cookie(
    key="user_id",
    value=str(user["id"]),
    max_age=2592000,
    httponly=True,
    samesite="lax"
)
    
    return {
    "success": True,
    "message": "Login successful",
    "user_id": user["id"],
    "name": user["name"],
    "email": user["email"]
}
@app.post("/generate-question")

def generate_ai_question(data: InterviewRequest):

    print("ROLE RECEIVED:", data.role)
    print("DIFFICULTY RECEIVED:", data.difficulty)

    question = generate_question(
        role=data.role,
        difficulty=data.difficulty
    )

    return {
        "success": True,
        "question": question
    }
    


@app.post("/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...)
):

    audio_path = f"temp_{audio.filename}"

    with open(audio_path, "wb") as buffer:

        shutil.copyfileobj(
            audio.file,
            buffer
        )

    text = transcribe_audio(audio_path)

    return {
        "success": True,
        "text": text
    }

@app.post("/evaluate-answer")
def evaluate_ai_answer(
    data: EvaluationRequest
):

    result = evaluate_answer(
        question=data.question,
        answer=data.answer
    )

    db = get_db()

    cursor = db.cursor()

    print(
    "QUESTION RECEIVED:",
    data.question
)
    cursor.execute(
        """
        INSERT INTO interview_answers
        (
            session_id,
            question,
            user_answer,
            ai_feedback,
            ideal_answer,
            score
        )

        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            data.session_id,
            data.question,
            data.answer,
            result["feedback"],
            result["ideal_answer"],
            result["score"]
        )
    )

    db.commit()

    cursor.execute(
    """
    UPDATE interview_sessions

    SET

    total_score =
    total_score + %s,

    total_questions =
    total_questions + 1

    WHERE id = %s
    """,
    (
        result["score"],
        data.session_id
    )
)

    db.commit()

    db.close()

    return {
        "success": True,
        "score": result["score"],
        "feedback": result["feedback"],
        "ideal_answer": result["ideal_answer"]
    }

@app.get(
    "/get-session-details/{session_id}"
)
def get_session_details(
    session_id: int
):

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM interview_answers
        WHERE session_id=%s
        """,
        (session_id,)
    )

    answers = cursor.fetchall()

    db.close()

    return {
        "success": True,
        "answers": answers
    }
@app.get("/user-sessions/{user_id}")
def get_user_sessions(user_id: int):

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM interview_sessions
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    sessions = cursor.fetchall()

    db.close()

    return {
        "success": True,
        "sessions": sessions
    }
class RenameSession(BaseModel):
    session_name: str


@app.put("/rename-session/{session_id}")
def rename_session(
    session_id: int,
    data: RenameSession
):

    db = get_db()

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE interview_sessions
        SET session_name=%s
        WHERE id=%s
        """,
        (
            data.session_name,
            session_id
        )
    )

    db.commit()

    db.close()

    return {
        "success": True
    }
@app.post("/create-chat-session")
def create_chat_session(data: ChatSessionRequest):

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO chat_sessions
        (
            user_id,
            title,
            model_type
        )
        VALUES (%s,%s,%s)
        """,
        (
            data.user_id,
            "New Chat",
            data.model_type
        )
    )

    db.commit()

    session_id = cursor.lastrowid

    db.close()

    return {
        "success": True,
        "session_id": session_id
    }
@app.get("/chat-sessions/{user_id}")
def get_chat_sessions(user_id: int):

    db = get_db()

    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM chat_sessions
        WHERE user_id=%s
        ORDER BY updated_at DESC
        """,
        (user_id,)
    )

    sessions = cursor.fetchall()

    db.close()

    return {
        "success": True,
        "sessions": sessions
    }
@app.post("/chat")
def chat(data: ChatRequest):

    if data.model_type == "Offline LLM":

        return StreamingResponse(
            stream_chat_with_ai(
                data.message
            ),
            media_type="text/plain"
        )

    elif data.model_type == "Online AI":

        return StreamingResponse(
            stream_online_ai(
                data.message
            ),
            media_type="text/plain"
        )

    elif data.model_type == "Web Search":

        return StreamingResponse(
            stream_web_search(
                data.message
            ),
            media_type="text/plain"
        )

    return StreamingResponse(
        stream_chat_with_ai(
            data.message
        ),
        media_type="text/plain"
    )
@app.post("/save-chat-message")
def save_chat_message(
    data: SaveChatMessage
):

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO chat_messages
        (
            session_id,
            role,
            content
        )
        VALUES (%s,%s,%s)
        """,
        (
            data.session_id,
            data.role,
            data.content
        )
    )

    db.commit()
    db.close()

    return {
        "success": True
    }
@app.get("/chat-messages/{session_id}")
def get_chat_messages(
    session_id: int
):

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM chat_messages
        WHERE session_id=%s
        ORDER BY created_at
        """,
        (session_id,)
    )

    messages = cursor.fetchall()

    db.close()

    return {
        "success": True,
        "messages": messages
    }


@app.delete("/delete-all-chat-sessions/{user_id}")
def delete_all_chat_sessions(
    user_id: int
):

    db = get_db()

    cursor = db.cursor()

    cursor.execute(
        """
        DELETE FROM chat_sessions
        WHERE user_id=%s
        """,
        (user_id,)
    )

    db.commit()

    db.close()

    return {
        "success": True
    }


class TitleRequest(BaseModel):
    message: str

@app.put("/generate-chat-title/{session_id}")
def generate_title(
    session_id: int,
    data: TitleRequest
):

    title = generate_chat_title(
        data.message
    )

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE chat_sessions
        SET title=%s
        WHERE id=%s
        """,
        (
            title,
            session_id
        )
    )

    db.commit()
    db.close()

    return {
        "success": True,
        "title": title
    }

@app.put("/change-password")
def change_password(
    data: ChangePasswordRequest
):

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email=%s
        """,
        (data.email,)
    )

    user = cursor.fetchone()

    if not user:

        return {
            "success": False,
            "message": "User not found"
        }

    if not verify_password(
        data.old_password,
        user["password"]
    ):

        return {
            "success": False,
            "message": "Current password incorrect"
        }

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE users
        SET password=%s
        WHERE email=%s
        """,
        (
            hash_password(
                data.new_password
            ),
            data.email
        )
    )

    db.commit()

    db.close()

    return {
        "success": True,
        "message": "Password updated successfully"
    }
@app.put("/update-profile-photo")
def update_profile_photo(
    data: UpdatePhotoRequest
):

    db = get_db()

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE users
        SET profile_photo=%s
        WHERE id=%s
        """,
        (
            data.photo,
            data.user_id
        )
    )

    db.commit()

    db.close()

    return {
        "success": True
    }
@app.get("/user-profile/{user_id}")
def get_user_profile(user_id: int):

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT
        name,
        email,
        profile_photo
        FROM users
        WHERE id=%s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    db.close()

    return {
        "success": True,
        "user": user
    }
@app.get("/check-login")
def check_login(
    user_id: str = Cookie(
        default=None
    )
):

    if not user_id:

        return {
            "logged_in": False
        }

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE id=%s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    db.close()

    if not user:

        return {
            "logged_in": False
        }

    return {
        "logged_in": True,
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"]
    }

@app.get("/analytics/{user_id}")
def get_analytics(user_id: int):

    db = get_db()

    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM interview_sessions
        WHERE user_id=%s
        ORDER BY created_at
        """,
        (user_id,)
    )

    sessions = cursor.fetchall()

    total_interviews = 0

    total_score = 0
    total_questions = 0

    progress_data = []

    role_data = {}

    best_score = 0

    for session in sessions:
        if session["total_questions"] == 0:
            continue
        total_interviews += 1
        avg_score = 0

        if session["total_questions"] > 0:

            avg_score = (
                session["total_score"]
                /
                session["total_questions"]
            )

        progress_data.append(
            {
                "name":
                f"Interview {session['id']}",
                "score":
                round(avg_score, 2)
            }
        )

        role = session["role"] or "Unknown"

        if role not in role_data:

            role_data[role] = {
                "score": 0,
                "count": 0
            }

        role_data[role]["score"] += avg_score
        role_data[role]["count"] += 1

        total_score += session["total_score"]
        total_questions += session["total_questions"]

        best_score = max(
            best_score,
            avg_score
        )

    average_score = 0

    if total_questions > 0:

        average_score = (
            total_score
            /
            total_questions
        )
    

    best_role = "N/A"
    best_role_score = 0

    role_chart = []

    for role in role_data:

        role_avg = round(
        role_data[role]["score"]
        /
        role_data[role]["count"],
        2
        )

        role_chart.append(
        {
            "role": role,
            "score": role_avg
        }
        )

        if role_avg > best_role_score:

            best_role_score = role_avg
            best_role = role

    achievements = []

    if total_interviews >= 5:
        achievements.append(
            "🥉 Completed 5 Interviews"
        )

    if total_interviews >= 10:
        achievements.append(
            "🥈 Completed 10 Interviews"
        )

    if total_interviews >= 25:
        achievements.append(
            "🥇 Completed 25 Interviews"
        )

    if average_score >= 7:
        achievements.append(
            "⭐ Average Score Above 7"
        )

    if average_score >= 8:

        coach_summary = (
        "Excellent performance. "
        "You consistently score well in interviews. "
        "Focus on maintaining consistency and tackling harder questions."
    )

    elif average_score >= 6:

        coach_summary = (
        "Good progress. "
        "You understand most concepts but still have room for improvement. "
        "Practice more role-specific questions to increase your scores."
    )

    else:

        coach_summary = (
        "Your interview performance needs improvement. "
        "Focus on technical fundamentals, communication, and mock interview practice."
    )

    db.close()

    return {
        "success": True,
        "total_interviews": total_interviews,
        "average_score": round(
            average_score,
            2
        ),
        "best_score": round(
            best_score,
            2
        ),
        "strongest_role": best_role,
        "progress_data": progress_data,
        "role_data": role_chart,
        "achievements": achievements,
        "coach_summary": coach_summary
    }


@app.post("/logout")
def logout(
    response: Response
):

    response.delete_cookie(
        "user_id"
    )

    return {
        "success": True
    }

@app.get("/google-login")
async def google_login(
    request: Request
):

    redirect_uri = (
        "https://loving-dream-production-48cc.up.railway.app/google-callback"
    )

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )

@app.get("/github-login")
async def github_login(
    request: Request
):

    return await oauth.github.authorize_redirect(
        request,
        "https://loving-dream-production-48cc.up.railway.app/github-callback"
    )

@app.get("/google-callback")
async def google_callback(
    request: Request
):

    token = await oauth.google.authorize_access_token(
        request
    )

    user_info = token.get(
        "userinfo"
    )

    email = user_info["email"]

    name = user_info["name"]

    picture = user_info.get(
        "picture",
        ""
    )

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if not user:

        cursor = db.cursor()

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                provider,
                profile_photo
            )
            VALUES
            (
                %s,
                %s,
                'google',
                %s
            )
            """,
            (
                name,
                email,
                picture
            )
        )

        db.commit()

        user_id = cursor.lastrowid

    else:

        user_id = user["id"]

    response = RedirectResponse(
            url=
            "http://localhost:5173/dashboard"
        )

    response.set_cookie(
        key="user_id",
        value=str(user_id),
        max_age=2592000,
        httponly=True,
        samesite="lax"
    )

    db.close()

    return response
@app.get("/github-callback")
async def github_callback(
    request: Request
):

    token = await oauth.github.authorize_access_token(
        request
    )

    resp = await oauth.github.get(
        "user",
        token=token
    )

    github_user = resp.json()

    email = github_user.get(
        "email"
    )

    if not email:

        email_resp = await oauth.github.get(
            "user/emails",
            token=token
        )

        emails = email_resp.json()

        for e in emails:

            if e["primary"]:

                email = e["email"]

                break

    name = github_user.get(
        "name"
    ) or github_user["login"]

    picture = github_user.get(
        "avatar_url",
        ""
    )

    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if not user:

        cursor = db.cursor()

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                provider,
                profile_photo
            )
            VALUES
            (
                %s,
                %s,
                'github',
                %s
            )
            """,
            (
                name,
                email,
                picture
            )
        )

        db.commit()

        user_id = cursor.lastrowid

    else:

        user_id = user["id"]

    response = RedirectResponse(
        url=
        "http://localhost:5173/dashboard"
    )

    response.set_cookie(
        key="user_id",
        value=str(user_id),
        max_age=2592000,
        httponly=True,
        samesite="lax"
    )

    db.close()

    return response