const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Không đọc được dữ liệu' });
  }
});

app.use(express.static(__dirname)); // phục vụ index.html

app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));
