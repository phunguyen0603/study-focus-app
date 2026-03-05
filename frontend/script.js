// ==========================================
// HỆ THỐNG MODAL (THÔNG BÁO TỰ CHẾ)
// ==========================================
const modalOverlay = document.getElementById('customModal');
const modalMessage = document.getElementById('modalMessage');
const modalOkBtn = document.getElementById('modalOkBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

let confirmCallback = null; // Biến lưu trữ hành động nếu người dùng chọn OK

// Hàm mở Modal
function showModal(message, type = 'alert', onConfirm = null) {
    modalMessage.textContent = message;
    modalOverlay.classList.remove('hidden');

    if (type === 'confirm') {
        modalCancelBtn.classList.remove('hidden'); // Hiện nút Hủy
        confirmCallback = onConfirm;
    } else {
        modalCancelBtn.classList.add('hidden'); // Ẩn nút Hủy
        confirmCallback = null;
    }
}

// Hàm đóng Modal
function closeModal() {
    modalOverlay.classList.add('hidden');
}

// Bấm OK
modalOkBtn.addEventListener('click', () => {
    closeModal();
    if (confirmCallback) confirmCallback(); // Thực hiện hành động tiếp theo (nếu có)
});

// Bấm Hủy
modalCancelBtn.addEventListener('click', closeModal);

// Bấm ra ngoài vùng Modal để tắt
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Lấy các phần tử từ HTML
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const moodSection = document.getElementById('moodSection');

// Các phần tử cho biểu đồ
const statsBtn = document.getElementById('statsBtn');
const chartContainer = document.getElementById('chartContainer');
let myChartInstance = null; // Biến lưu trữ biểu đồ để tránh vẽ đè

// Lấy các phần tử ô nhập mới
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');

// Hàm tính tổng số giây từ 3 ô nhập
function calculateTotalTime() {
    let h = parseInt(hoursInput.value) || 0;
    let m = parseInt(minutesInput.value) || 0;
    let s = parseInt(secondsInput.value) || 0;
    return (h * 3600) + (m * 60) + s;
}

let totalTime = calculateTotalTime();
let timeLeft = totalTime;
let timerInterval;
let isRunning = false;

// Hàm xử lý khi người dùng thay đổi bất kỳ ô số nào
function handleTimeChange() {
    if (!isRunning) {
        totalTime = calculateTotalTime();
        
        // Tránh việc người dùng nhập 0 giờ 0 phút 0 giây
        if (totalTime <= 0) {
            minutesInput.value = 11; // Trả về mặc định 25 phút
            totalTime = 11 * 60;
        }
        
        timeLeft = totalTime;
        updateDisplay();
    }
}

// Gắn sự kiện cho cả 3 ô nhập
hoursInput.addEventListener('change', handleTimeChange);
minutesInput.addEventListener('change', handleTimeChange);
secondsInput.addEventListener('change', handleTimeChange);

// Hàm cập nhật màn hình hiển thị
function updateDisplay() {
    // Tính toán lại Giờ, Phút, Giây từ tổng số giây (timeLeft)
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Định dạng thêm số 0 đằng trước nếu nhỏ hơn 10 (vd: 09, 05)
    const formattedMins = minutes < 10 ? '0' + minutes : minutes;
    const formattedSecs = seconds < 10 ? '0' + seconds : seconds;

    // Nếu có giờ (> 0) thì hiện H:MM:SS, nếu không thì chỉ hiện MM:SS
    if (hours > 0) {
        timerDisplay.textContent = `${hours}:${formattedMins}:${formattedSecs}`;
    } else {
        timerDisplay.textContent = `${formattedMins}:${formattedSecs}`;
    }
}

// Hàm bắt đầu đếm ngược
function startTimer() {
    if (isRunning) return; // Nếu đang chạy rồi thì không làm gì cả
    isRunning = true;
    
    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    // Ẩn phần chọn cảm xúc đi nếu đang học
    moodSection.classList.add('hidden'); 

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            hoursInput.disabled = false;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
            showModal("Hết giờ! Nghỉ ngơi chút nhé.");
            // Hiện form hỏi cảm xúc
            moodSection.classList.remove('hidden');
        }
    }, 1000); // 1000 mili-giây = 1 giây
}

// Hàm dừng đồng hồ
function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    // Hiện form hỏi cảm xúc để ghi nhận
    moodSection.classList.remove('hidden');
}

// Gắn sự kiện click cho các nút
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

// Hiển thị thời gian ban đầu khi vừa load trang
updateDisplay();

// Lấy các phần tử từ HTML cho việc lưu dữ liệu
const saveBtn = document.getElementById('saveBtn');
const moodSelect = document.getElementById('moodSelect');

// Sự kiện khi nhấn nút "Lưu kết quả"
saveBtn.addEventListener('click', async () => {
    const selectedMood = moodSelect.value;
    
    const sessionDuration = totalTime - timeLeft; // Thời gian thực tế đã trôi qua

    // (Tùy chọn) Chặn không cho lưu nếu người dùng vừa bật lên đã tắt ngay (chưa học được giây nào)
    if (sessionDuration <= 0) {
        showModal("Bạn chưa tập trung được chút nào, hãy thử lại nhé!");
        moodSection.classList.add('hidden'); // Ẩn form
        return; // Dừng hàm, không gửi dữ liệu đi
    } 

    // Gói dữ liệu để gửi đi
    const dataToSend = {
        duration: sessionDuration,
        mood: selectedMood
    };

    try {
        // Dùng Fetch API để gửi POST request tới Backend
        const response = await fetch("https://study-focus-api-phu.onrender.com/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            const result = await response.json();
            showModal(result.message); // Hiển thị thông báo từ Backend
            moodSection.classList.add('hidden'); // Ẩn form đi
            // Cập nhật lại thời gian theo đúng con số đang có trong ô input
            totalTime = calculateTotalTime();
            timeLeft = totalTime; 
            updateDisplay();
        } else {
            showModal("Có lỗi xảy ra khi lưu dữ liệu.");
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        showModal("Không thể kết nối đến server. Hãy kiểm tra xem Backend đã chạy chưa.");
    }
});

// Thêm 2 phần tử mới vào JS
const themeToggle = document.getElementById('themeToggle');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// --- 1. Logic Đổi Light/Dark Mode ---
themeToggle.addEventListener('click', () => {
    // Lấy theme hiện tại
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // Đổi mode
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    // Thay đổi icon của nút
    themeToggle.textContent = newTheme === 'light' ? '🌓' : '☀️';
});

// --- 2. Logic Hiển thị Cảm xúc bằng Icon ---
// Tạo map để chuyển từ tên cảm xúc sang icon tương ứng
const moodIconMap = {
    'good': '😊',
    'tired': '😴',
    'distracted': '🤯',
    'unknown': '❔' // Dự phòng
};

// --- 3. Logic Xem Thống Kê (Đổi sang biểu đồ đường & Hiện nhật ký) ---
statsBtn.addEventListener('click', async () => {
    try {
        const response = await fetch("https://study-focus-api-phu.onrender.com/api/sessions");
        const sessions = await response.json();

        if (sessions.length === 0) {
            showModal("Chưa có dữ liệu nào. Hãy học thử một phiên nhé!");
            return;
        }

        chartContainer.classList.remove('hidden');
        historySection.classList.remove('hidden'); // Hiện phần nhật ký

        // A. CHẾ BIẾN DỮ LIỆU
        // Dữ liệu cho trục X: Chỉ lấy thời gian và icon cảm xúc
        const labels = sessions.map(session => {
            const dateObj = new Date(session.date);
            const moodIcon = moodIconMap[session.mood] || moodIconMap['unknown'];
            return `${dateObj.getHours()}:${dateObj.getMinutes()} ${moodIcon}`;
        }).reverse();

        // Dữ liệu cho trục Y: Thời gian học (Phút)
        const dataPoints = sessions.map(session => session.duration / 60).reverse();

        // B. CẬP NHẬT NHẬT KÝ (Ghi nhật ký học)
        historyList.innerHTML = ''; // Xóa nhật ký cũ
        sessions.slice(0, 5).forEach(session => { // Chỉ lấy 5 phiên gần nhất
            const dateObj = new Date(session.date);
            const moodIcon = moodIconMap[session.mood] || moodIconMap['unknown'];
            const minutes = Math.floor(session.duration / 60);
            const seconds = session.duration % 60;

            const li = document.createElement('li');
            li.style.marginBottom = '8px';
            li.innerHTML = `${dateObj.toLocaleDateString('vi-VN')} - ⏱️ <b>${minutes}:${seconds < 10 ? '0' : ''}${seconds}</b> - Cảm xúc: ${moodIcon}`;
            historyList.appendChild(li);
        });

        // C. VẼ BIỂU ĐỒ ĐƯỜNG (Trend Line)
        const ctx = document.getElementById('focusChart').getContext('2d');
        
        if (myChartInstance) {
            myChartInstance.destroy(); 
        }

        myChartInstance = new Chart(ctx, {
            type: 'line', // ĐỔI SANG BIỂU ĐỒ ĐƯỜNG
            data: {
                labels: labels,
                datasets: [{
                    label: 'Thời gian tập trung (Phút)',
                    data: dataPoints,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)', // Nền xanh nhạt
                    borderColor: 'rgba(41, 128, 185, 1)',      // Viền xanh đậm
                    borderWidth: 2,
                    tension: 0.3,   /* Bo cong đường cho đẹp */
                    fill: true,     /* Tô màu phần dưới đường */
                    pointRadius: 5, /* To radius của điểm */
                    pointBackgroundColor: 'rgba(41, 128, 185, 1)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Phút' }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showModal("Không thể tải thống kê.");
    }
});

// Lấy phần tử nút Reset
const resetBtn = document.getElementById('resetBtn');

// Xử lý sự kiện khi bấm nút Xóa
resetBtn.addEventListener('click', () => {
    // Gọi Modal dạng 'confirm' và truyền đoạn code Xóa vào bên trong
    showModal("⚠️ Bạn có chắc chắn muốn xóa toàn bộ lịch sử và biểu đồ không?", 'confirm', async () => {
        try {
            const response = await fetch("https://study-focus-api-phu.onrender.com/api/sessions", {
                method: "DELETE"
            });
            
            if (response.ok) {
                const result = await response.json();
                showModal(result.message); // Báo thành công
                
                chartContainer.classList.add('hidden');
                historySection.classList.add('hidden');
                historyList.innerHTML = ''; 
                
                if (myChartInstance) {
                    myChartInstance.destroy();
                }
            } else {
                showModal("Có lỗi xảy ra khi xóa dữ liệu.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            showModal("Không thể kết nối đến server để xóa dữ liệu.");
        }
    });
});