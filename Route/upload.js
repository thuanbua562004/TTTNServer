const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const PORT = 3000

// Tạo thư mục 'img' nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../Img');
router.use('/img', express.static(uploadDir));

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Lưu vào thư mục 'img'
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Giữ lại phần mở rộng file
    }
});

var upload = multer({ storage: storage });

router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files;
    console.log(files);
    
    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Please choose files' });
    }
    
    const fileUrls = req.files.map(file => ({
        filename: file.filename,
        url: `http://localhost:${PORT}/img/${file.filename}`
    }));

    res.json({ message: 'Files uploaded successfully', files: fileUrls });
});

module.exports = router;
