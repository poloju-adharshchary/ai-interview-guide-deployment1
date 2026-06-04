from database import get_db

def create_tables():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255),
            provider VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            profile_photo LONGTEXT
        )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interview_sessions (

        id INT AUTO_INCREMENT PRIMARY KEY,

        user_id INT,

        role VARCHAR(100),

        difficulty VARCHAR(50),

        total_score FLOAT DEFAULT 0,

        total_questions INT DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

       )
      """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interview_answers (

        id INT AUTO_INCREMENT PRIMARY KEY,

        session_id INT,

        question TEXT,

        user_answer LONGTEXT,

        ai_feedback LONGTEXT,

        ideal_answer LONGTEXT,

        score FLOAT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (session_id)
        REFERENCES interview_sessions(id)
        ON DELETE CASCADE

        )
     """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) DEFAULT 'New Chat',
    model_type VARCHAR(50) DEFAULT 'Offline LLM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
   )
   """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
    id INT NOT NULL AUTO_INCREMENT,
    session_id INT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX (session_id),
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
)
   """)

    db.commit()
    db.close()

