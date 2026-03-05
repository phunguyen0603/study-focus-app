# Study Focus Analytics 📈

Một ứng dụng web Full-stack giúp quản lý thời gian học tập, đo lường sự tập trung và theo dõi biến động cảm xúc của người dùng. Dự án được xây dựng với mục tiêu kết hợp các phương pháp quản lý thời gian (như Pomodoro) với góc nhìn từ tâm lý học giáo dục để cá nhân hóa và tối ưu hóa hiệu suất làm việc.

## 🌐 Live Demo
* **Frontend:** https://study-focus-app-phu.vercel.app  
* **Backend:** https://study-focus-api-phu.onrender.com

<img width="1920" height="1020" alt="Screenshot 2026-03-05 110708" src="https://github.com/user-attachments/assets/63062cc7-370b-4cf7-a2d4-3a07e12bcf90" />


## ✨ Tính năng nổi bật (Features)

* **⏳ Quản lý thời gian linh hoạt:** Cho phép thiết lập mục tiêu học tập chi tiết theo Giờ - Phút - Giây, không bị giới hạn ở một mốc thời gian cố định.
* **🧠 Theo dõi trạng thái tâm lý:** Ghi nhận cảm xúc (Tập trung, Mệt mỏi, Xao nhãng) sau mỗi phiên làm việc để đánh giá chất lượng phiên học.
* **📊 Trực quan hóa dữ liệu (Data Visualization):** Sử dụng biểu đồ đường (Trend Line) để vẽ lại biểu đồ phong độ học tập theo thời gian thực.
* **🌓 UI/UX Tối ưu:** Hỗ trợ Light/Dark mode, hệ thống Custom Modal mượt mà không làm gián đoạn luồng thao tác.
* **🗄️ Lưu trữ bền vững:** Hệ thống RESTful API cho phép lưu trữ, trích xuất và quản lý lịch sử học tập cá nhân.

## 🛠️ Công nghệ sử dụng (Tech Stack)

**Frontend (Client)**
* HTML5, CSS3, Vanilla JavaScript (ES6+).
* [Chart.js](https://www.chartjs.org/) để trực quan hóa dữ liệu.
* Triển khai (Deployment): **Vercel**

**Backend (Server)**
* Ngôn ngữ: Python 3.
* Framework: [FastAPI](https://fastapi.tiangolo.com/) (High performance, async support).
* Server: Uvicorn.
* Cơ sở dữ liệu: SQLite.
* Triển khai (Deployment): **Render**

## 📂 Kiến trúc dự án (Project Structure)

Dự án được phân tách rõ ràng giữa Client và Server, tuân thủ nguyên tắc Separation of Concerns:
```text
study-focus-app/
├── frontend/
│   ├── index.html       # Giao diện chính
│   ├── style.css        # Styling & CSS Variables (Theming)
│   └── script.js        # Logic xử lý, gọi API & vẽ biểu đồ
├── backend/
│   ├── main.py          # Khởi tạo FastAPI app & định nghĩa Endpoints
│   ├── models.py        # Pydantic models (Data validation)
│   └── database.py      # Kết nối và thao tác với SQLite
├── requirements.txt     # Danh sách thư viện Python
└── README.md
```
## 🚀 Hướng dẫn cài đặt (Local Development)

Nếu bạn muốn chạy dự án này trên máy tính cá nhân, hãy làm theo các bước sau:

**1. Clone kho lưu trữ:**
```bash
git clone https://github.com/phunguyen0603/study-focus-app.git
cd study-focus-app
```
**2. Cài đặt Backend**

Mở terminal và di chuyển vào thư mục `backend`:
```bash
cd backend
```
Tạo và kích hoạt môi trường ảo
```bash
python -m venv venv
source venv/bin/activate  # Đối với Linux/Mac
# venv\Scripts\activate   # Đối với Windows
```
Cài đặt thư viện
```bash
pip install -r requirements.txt
```
Khởi động server
```bash
uvicorn main:app --reload
```
API sẽ chạy tại: http://localhost:8000

**3. Khởi động Frontend:**

  Mở file frontend/index.html bằng Live Server trên VS Code hoặc truy cập trực tiếp file trên trình duyệt. (Lưu ý: Cần đổi URL fetch trong script.js từ link Render về lại localhost nếu muốn test nội bộ).

## 📌 Kiến trúc hệ thống & Luồng dữ liệu
1. Người dùng tương tác với UI, thiết lập thời gian và bắt đầu phiên.
2. Khi kết thúc, người dùng chọn cảm xúc. JavaScript dùng fetch API gửi HTTP POST request chứa dữ liệu JSON (thời lượng, cảm xúc) xuống Backend.
3. FastAPI tiếp nhận, parse dữ liệu, lưu vào file focus_data.db (SQLite) và trả về response.
4. Khi ấn "Xem thống kê", Frontend gửi HTTP GET request, lấy mảng dữ liệu từ Backend và đẩy vào Chart.js để render biểu đồ.
## 👨‍💻 Tác giả (Author)
Nguyễn Hoàng Minh Phú - Sinh viên Khoa Khoa học và Kỹ thuật Máy tính - Đại học Bách Khoa ĐHQG-HCM.
