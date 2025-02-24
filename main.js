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

const Middleware = require('./Middleware/Mid');
app.use(express.json());
app.use(bodyParser.json());

app.use('/img', express.static(path.join(__dirname, 'Img')));

app.use(cors())
app.use('*',Middleware)
app.use('/phone',apiPhone)
app.use('/chat',chatBot)
app.use('/user',apiUser)
app.use('/category', category)
app.use('/upload',upload)
app.use('/cart',apiCart)
app.listen(port,()=>{
    console.log('Server started on port 3000')
})