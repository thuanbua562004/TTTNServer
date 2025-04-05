const express = require('express')
const app = express()
const port  =3000;
const path = require('path');
const bodyParser = require("body-parser");

const cors = require('cors')
const mongoose = require('./Connect/Mongo')
const apiPhone = require('./Route/apiPhone')
const apiUser = require('./Route/apiUser')
const chatBot = require('./Route/chatBot');
const upload  = require('./Route/upload');
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

app.use('/img', express.static(path.join(__dirname, 'Img')));

app.use(cors('*'))
app.use('*',Middleware)
app.use('/phone',apiPhone)
app.use('/chat',chatBot)
app.use('/user',apiUser)
app.use('/category', category)
app.use('/upload',upload)
app.use('/cart',apiCart)
app.use('/history',apiHistory)
app.use('/comment',comment)
app.use('/news',apiNews)
app.use('/reset',apiReset)
app.use('/pay',apiMomo)
app.use('/payvn',apiVnPay)

app.listen(port,()=>{
    console.log('Server started on port 3000')
})