import requests
from groq import Groq
from duckduckgo_search import DDGS
from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = Groq(
    api_key=GROQ_API_KEY
)

OLLAMA_URL = "http://localhost:11434/api/generate"

"""def generate_question(role, difficulty):    commenting for deployment

    prompt = f """

"""You are a professional technical interviewer.

Role: {role}

Difficulty: {difficulty}

Conduct a realistic industry interview.

Rules:

- Ask only ONE question.
- Ask naturally like a real interviewer.
- Focus on practical and real-world scenarios.
- Focus on current industry practices and technologies.
- Prefer implementation, debugging, design, optimization, security, testing, deployment, and problem-solving questions.
- Avoid simple textbook definitions whenever possible.
- Avoid repeating common interview questions.
- Match the selected role.
- Match the selected difficulty.
- Keep the question under 30 words.
- Do not provide answers.
- Do not provide explanations.
- Return only the question.

Question:


    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "qwen2.5:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    return data["response"]  """



def generate_question(role, difficulty):

    prompt = f"""
You are a professional technical interviewer.

Role: {role}

Difficulty: {difficulty}

Conduct a realistic industry interview.

Rules:

- Ask only ONE question.
- Ask naturally like a real interviewer.
- Focus on practical and real-world scenarios.
- Focus on current industry practices and technologies.
- Prefer implementation, debugging, design, optimization, security, testing, deployment, and problem-solving questions.
- Avoid simple textbook definitions whenever possible.
- Avoid repeating common interview questions.
- Match the selected role.
- Match the selected difficulty.
- Keep the question under 30 words.
- Do not provide answers.
- Do not provide explanations.
- Return only the question.

Question:
"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content.strip()


import json

"""def evaluate_answer(question, answer):

    prompt = f"""
"""You are a strict professional interviewer.

Evaluate the candidate answer genuinely.

Question:
{question}

Candidate Answer:
{answer}

Rules:
- Be strict and realistic
- Give honest feedback
- Score properly
- Do NOT motivate unnecessarily
- Do NOT be soft

Return ONLY valid JSON.

Format:

{{
    "score": 0-10,
    "feedback": "short genuine feedback",
    "ideal_answer": "professional ideal answer"
}}


    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "qwen2.5:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    raw_text = data["response"]

    try:

        parsed = json.loads(raw_text)

        return parsed

    except:

        return {
            "score": 5,
            "feedback": "Evaluation failed properly.",
            "ideal_answer": "No ideal answer generated."
        }


OLLAMA_URL = "http://localhost:11434/api/generate"
"""



def evaluate_answer(question, answer):

    prompt = f"""
You are a strict professional interviewer.

Evaluate the candidate answer genuinely.

Question:
{question}

Candidate Answer:
{answer}

Rules:
- Be strict and realistic
- Give honest feedback
- Score properly
- Do NOT motivate unnecessarily
- Do NOT be soft

Return ONLY valid JSON.

Format:

{{
    "score": 0-10,
    "feedback": "short genuine feedback",
    "ideal_answer": "professional ideal answer"
}}
"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    raw_text = response.choices[0].message.content

    try:
        return json.loads(raw_text)

    except:
        return {
            "score": 5,
            "feedback": "Evaluation parsing failed.",
            "ideal_answer": "No ideal answer generated."
        }



def stream_chat_with_ai(message):
    return stream_online_ai(message)
                

def generate_chat_title(
    first_message
):

    prompt = f"""
Generate a short chat title.

Rules:
- Maximum 5 words
- No quotes
- No explanation

Message:
{first_message}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "qwen2.5:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"].strip()

def stream_online_ai(message):
    print("ONLINE AI MODE ACTIVATED")
    print("QUESTION:", message)
    stream = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": message
            }
        ],
        stream=True
    )

    for chunk in stream:

        content = (
            chunk.choices[0]
            .delta
            .content
        )

        if content:

            yield content

def stream_web_search(message):
    print("WEB SEARCH MODE ACTIVATED")
    print("QUESTION:", message)
    results = []
    
    with DDGS() as ddgs:

        search_results = list(
            ddgs.text(
                message,
                max_results=5
            )
        )

    for item in search_results:

        title = item.get("title", "")
        body = item.get("body", "")
        href = item.get("href", "")

        results.append(
            f"Title: {title}\n"
            f"Content: {body}\n"
            f"Source: {href}\n"
        )

    search_context = "\n\n".join(results)

    prompt = f"""
Answer the question using the search results.

Question:
{message}

Search Results:
{search_context}

Rules:
- Give a complete answer.
- Use markdown formatting.
- Mention important sources.
- If information is missing, say so.
"""

    stream = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        stream=True
    )

    for chunk in stream:

        content = (
            chunk.choices[0]
            .delta
            .content
        )

        if content:

            yield content