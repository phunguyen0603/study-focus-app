from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import datetime

app = FastAPI()

# Cấu hình CORS để Frontend (chạy ở cổng khác hoặc mở trực tiếp) có thể gửi dữ liệu tới Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép mọi nguồn gọi API (Dùng cho môi trường dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo Database SQLite (Tạo bảng nếu chưa có)
def init_db():
    conn = sqlite3.connect("focus_data.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            duration INTEGER,
            mood TEXT,
            date TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Định nghĩa cấu trúc dữ liệu mà Backend mong đợi nhận được
class SessionData(BaseModel):
    duration: int
    mood: str

# Tạo API Endpoint để nhận dữ liệu lưu vào DB
@app.post("/api/sessions")
async def save_session(session: SessionData):
    conn = sqlite3.connect("focus_data.db")
    cursor = conn.cursor()
    
    # Lấy thời gian hiện tại
    current_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute(
        "INSERT INTO sessions (duration, mood, date) VALUES (?, ?, ?)", 
        (session.duration, session.mood, current_date)
    )
    conn.commit()
    conn.close()
    
    return {"message": "Đã lưu kết quả học tập thành công!", "data": session}

@app.get("/api/sessions")
async def get_sessions():
    conn = sqlite3.connect("focus_data.db")
    # Cấu hình này giúp dữ liệu trả về dưới dạng Dictionary (Key-Value) thay vì Tuple (Mảng)
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    
    # Lấy 10 phiên học gần nhất
    cursor.execute("SELECT * FROM sessions ORDER BY id DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    
    # Chuyển đổi dữ liệu thành dạng danh sách (list) để gửi về Frontend
    return [dict(row) for row in rows]

# Tạo API Endpoint để Xóa toàn bộ dữ liệu
@app.delete("/api/sessions")
async def delete_all_sessions():
    conn = sqlite3.connect("focus_data.db")
    cursor = conn.cursor()
    
    # Lệnh SQL để xóa mọi thứ trong bảng sessions
    cursor.execute("DELETE FROM sessions")
    
    conn.commit()
    conn.close()
    
    return {"message": "Đã xóa toàn bộ lịch sử học tập!"}