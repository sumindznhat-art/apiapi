const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* Cho phép cache 5 giây để giảm tải */
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=5');
  next();
});

/* ---------- Đọc dữ liệu an toàn ---------- */
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi đọc data.json:', err.message);
    return { list: [], typeStat: { TAI: 0, XIU: 0 } };
  }
}

/* ---------- Endpoint chính ---------- */
app.get('/api', (req, res) => {
  const data = readData();

  /* Hỗ trợ tham số ?limit=20 để giới hạn số phiên */
  const limit = parseInt(req.query.limit, 10);
  if (!isNaN(limit) && limit > 0 && Array.isArray(data.list)) {
    data.list = data.list.slice(0, limit);
  }

  res.json(data);
});

/* Endpoint phụ trả về đúng 1 phiên mới nhất */
app.get('/api/latest', (req, res) => {
  const data = readData();
  const latest = (data.list && data.list[0]) || null;
  res.json(latest || {});
});

/* Endpoint health check cho Render */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* Phục vụ file tĩnh (index.html, data.json…) */
app.use(express.static(__dirname));

/* Route mặc định -> index.html */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ---------- Khởi động ---------- */
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại cổng ${PORT}`);
  console.log(`   → http://localhost:${PORT}/api`);
});
