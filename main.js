const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('./Connect/Mongo');
const apiPhone = require('./Route/apiPhone');
const apiUser = require('./Route/apiUser');
const chatBot = require('./Route/chatBot');
const upload = require('./Route/upload');
const category = require('./Route/apiCategory');
const apiCart = require('./Route/apiCart');
const apiHistory = require('./Route/apiHistory');
const comment = require('./Route/apiComment');
const apiNews = require('./Route/apiNews');
const apiReset = require('./Route/apiResetPass');
const apiMomo = require('./Route/apiMomo');
const apiVnPay = require('./Route/apiVnpay');

const Middleware = require('./Middleware/Mid');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('*', Middleware);

app.use('/img', express.static(path.join(__dirname, 'Img')));
app.use('/phone', apiPhone);
app.use('/chat', chatBot);
app.use('/user', apiUser);
app.use('/category', category);
app.use('/upload', upload);
app.use('/cart', apiCart);
app.use('/history', apiHistory);
app.use('/comment', comment);
app.use('/news', apiNews);
app.use('/reset', apiReset);
app.use('/pay', apiMomo);
app.use('/payvn', apiVnPay);

// 🛠️ Serve React build folder
app.use(express.static(path.join(__dirname, 'client', 'build')));

// 🔥 Fix lỗi reload: Chuyển hướng mọi route không phải API về React
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/img/')) {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
