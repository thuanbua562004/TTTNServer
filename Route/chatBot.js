const express = require('express');
const router = express.Router();
const { WebhookClient, Card } = require('dialogflow-fulfillment');
const phone = require('../Model/phone');
const Fuse = require('fuse.js');
const diacritics = require('diacritics');
const axios = require('axios');
const { text } = require('body-parser');

const GEMINI_API_KEY = "AIzaSyBKXbXubb9N6Evd3WkDW8WNvmnact7ExRA";
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// 🔍 Chuẩn hóa văn bản
function normalizeText(text) {
    return diacritics.remove(text.toLowerCase().trim());
}

// 🚀 Gọi API Gemini để trả lời câu hỏi AI
async function callGeminiAPI(query) {
    try {
        const response = await axios.post(
            url,
            { contents: [{ parts: [{ text: query }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );

        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa tìm thấy thông tin bạn cần.";
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error.message);
        return "Xin lỗi, có lỗi khi xử lý yêu cầu của bạn.";
    }
}

router.post('/webhook', async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    async function findProduct(agent) {
        const userQuery = req.body.queryResult.parameters['any'] || req.body.queryResult.queryText;
        console.log("🔍 [findProduct] User Query:", userQuery);
    
        if (!userQuery) {
            agent.add("Bạn có thể nói rõ hơn về sản phẩm bạn muốn tìm không?");
            return;
        }
    
        const normalizedQuery = normalizeText(userQuery);
        const allProducts = await phone.find();
        console.log("📦 [findProduct] Total products fetched:", allProducts.length);
    
        // 🔍 Chuẩn hóa dữ liệu sản phẩm
        const normalizedProducts = allProducts.map(product => ({
            ...product._doc,
            normalized_name: normalizeText(product.name),
            minPrice: Math.min(
                ...product.image.flatMap(color => color.memory.map(mem => mem.price || Infinity))
            ),
            detailUrl: `https://tttn-pn1v.onrender.com/product/${product._id}`
        }));
    
    
        // 🔎 Tìm kiếm sản phẩm gần đúng nhất
        const fuse = new Fuse(normalizedProducts, { keys: ['normalized_name'], threshold: 0.15 });
        const result = fuse.search(normalizedQuery);
        console.log("🔍 [findProduct] Fuse.js search result:", result);
    
        const bestMatch = result.length > 0 ? result[0].item : null;
    
        if (bestMatch) {
            console.log("✅ [findProduct] Found:", bestMatch.name);
            agent.add(new Card({
                title: `📱 ${bestMatch.name}`,
                imageUrl: bestMatch.image[0]?.imageUrl || "https://yourwebsite.com/default-image.jpg",
                text: `💰 Giá: ${bestMatch.minPrice.toLocaleString()} VND`,
                buttonText: "🔗 Xem chi tiết",
                buttonUrl: bestMatch.detailUrl
            }));
            return;
        }
    
        try {
            const geminiResponse = await callGeminiAPI(
                `Nếu người dùng yêu cầu tư vấn về điện thoại, hãy cung cấp thông tin ngắn gọn về mẫu điện thoại đó.
                Nếu người dùng muốn tìm sản phẩm, hãy tìm trong danh sách sản phẩm mà tôi đã cung cấp và gửi kèm đường link sau:
                https://tttn-pn1v.onrender.com/product/'id'. 
                Nếu không thuộc hai trường hợp trên, hãy trả lời bằng thông tin ngắn gọn về điện thoại và thông báo rằng không có sản phẩm phù hợp.
              
                Dưới đây là danh sách các điện thoại hiện có:
                ${normalizedProducts.map(p => `- **${p.name}**, ID = ${p._id}, Giá: ${p.minPrice.toLocaleString()} VND`).join("\n")}
              
                Đây là câu hỏi của người dùng: ${userQuery}
                Hãy tư vấn cho họ!`
              );
              
            agent.add(geminiResponse);

        } catch (error) {
            console.error("❌ [findProduct] Error calling Gemini AI:", error);
            agent.add("Có lỗi xảy ra khi lấy thông tin từ Gemini AI, vui lòng thử lại.");
        }
        
    }
    

    async function fallback(agent) {
        console.log("🔥 [fallback] Default Fallback Intent triggered!");

        const userQuery = req.body.queryResult.queryText;
        console.log("🔍 [fallback] User Query:", userQuery);

        if (!userQuery) {
            agent.add("Xin lỗi, tôi chưa hiểu rõ. Bạn có thể thử lại với câu khác không?");
            return;
        }

        console.log("🤖 [fallback] Sending request to Gemini AI...");
        const geminiResponse = await callGeminiAPI(`trả lời ngắn gọn về câu hỏi này cho người dùng : ${userQuery} `);
        agent.add(geminiResponse);
    }

    let intentMap = new Map();
    intentMap.set('FindProduct', findProduct);
    intentMap.set('Default Fallback Intent', fallback);

    try {
        agent.handleRequest(intentMap);
    } catch (error) {
        console.error('🚨 [ERROR] Lỗi khi xử lý intent:', error.message);
        res.status(500).send('Lỗi khi xử lý yêu cầu');
    }
});


module.exports = router;
