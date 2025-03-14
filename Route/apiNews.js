const express = require('express');
const News = require('../Model/new'); // Import model News
const router = express.Router();



// API HIỂN THỊ TIN TỨC 

router.get('/news', async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
});
router.get('/news/:id', async (req, res) => {
    try {
        const news = await News.findOne({ _id: req.params.id });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
});
// API thêm tin tức
router.post('/news', async (req, res) => {
    try {
        const { title, img, info, details } = req.body;
        const images = img.flat();


        const newNews = new News({
            title,
            img1: images[0] || "",
            img2: images[1] || "",
            img3: images[2] || "",
            img4: images[3] || "",
            info,
            details
        });


        await newNews.save();
        res.status(201).json({ message: "Tin tức đã được thêm", news: newNews });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm tin tức", error: error.message });
    }
});




// API xóa tin tức theo ID
router.delete('/news/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        res.json({ message: "Tin tức đã được xóa", news: deletedNews });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa tin tức", error: error.message });
    }
});

module.exports = router;
