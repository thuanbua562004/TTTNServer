const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { WebhookClient, Image, Card } = require('dialogflow-fulfillment');
const phone = require('../Model/phone');
router.post('/webhook',async (req, res) => {
    const userQuestion = req.body.queryResult.queryText;
    const product =await phone.findOne({name:"Xiaomi 13 5G"});
    const agent = new WebhookClient({ request: req, response: res });

    function welcome(agent) {
        agent.add('Xin chào! Tôi là chatbot giúp bạn tìm kiếm sản phẩm trong cửa hàng của chúng tôi.');
    }

    function productList(agent) {
        agent.add('Đây là thông tin về'+ userQuestion);
        agent.add(new Card({
            title: product.name,
            imageUrl: product.image[0].imageUrl,
            text: product.info,
            buttonText: "Xem chi tiết",
            buttonUrl: "https://www.google.com"
        }));
        agent.add(new Card({
            title: product.name,
            imageUrl: product.image[0].imageUrl,
            text: product.info,
            buttonText: "Xem chi tiết",
            buttonUrl: "https://www.google.com"
        }));
    }
    
    function fallback(agent) {
        agent.add('Đây là thông tin về sản phẩm ');
        agent.add(new Card({
            title: product.name,
            imageUrl: product.image[0].imageUrl,
            text: product.info,
            buttonText: "Xem chi tiết",
            buttonUrl: "https://www.google.com"
        }));
    }
    let intentMap = new Map();
    intentMap.set('xinchào', welcome);
    intentMap.set('Danh sách sản phẩm', productList);  
    intentMap.set('FindProduct', fallback);  

    agent.handleRequest(intentMap).catch(error => {
        console.error('Lỗi khi xử lý intent:', error.message);
        res.status(500).send('Lỗi khi xử lý yêu cầu');
    });
});

module.exports = router;