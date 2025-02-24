const express = require('express')
const router = express.Router()
const user = require('../Model/user')
var jwt = require('jsonwebtoken');

//register user
router.post('/register',async (req,res) => {
try{
    const {email , password} = req.body
    const checkUser = await user.findOne({ email: email})
    if(checkUser!=null){
        return res.status(400).send("User already exists")
    }
    const newUser = new user({
        email : email ,
        password : password
    })
    if(await newUser.save()){
        res.status(200).json({message: 'User registered successfully'})
    }else{
        res.status(404).json({message: 'Registration failed'})
    }
}catch(e){
    res.status(500).json({message: e.message})
}
})
// login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Email nhận được:", req.body.email);

        const login = await user.findOne({ email: email });
        if (!login) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }
        if (!login.password == password) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }
        const token = jwt.sign({ 
            id: login._id, 
            email: login.email 
        }, 'shhhhh', { expiresIn: '12h' }); // 12 giờ
        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: e.message });
    }
});


router.post('/loginGG', async (req, res) => {
    try {
        const { email,name,avatar } = req.body;
        console.log("Email nhận được:", req.body.email);

        const login = await user.findOne({ email: email });
        if (!login) {
            const newUser = new user({
                email : email ,
                name : name,
                avatar: avatar
            })
            if(await newUser.save()){
                res.status(200).json({message: 'User registered successfully'})
            }
        }
        res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: e.message });
    }
});
router.put('/update',async (req,res) => {
    const {name , phone, address,avatar , id} = req.body
    const filter = { _id: id };

    const userUpdate ={
        name : name,
        phone : phone,
        address : address,
        avatar : avatar
    }
    const userFill = Object.keys(userUpdate).forEach(key => {
        if (userUpdate[key] === undefined || userUpdate[key] === null || userUpdate[key] === "") {
            delete userUpdate[key];
        }
    });
    const resultUpdate = await user.findOneAndUpdate(filter, userFill,{new : true})
    console.log(resultUpdate)
    if(resultUpdate){
        res.status(200).json({resultUpdate})
    }else{
        res.status(404).json({message: 'User not found'})
    }
});


router.get('/user/:email',async (req,res) => {
    try{
        const email = req.params.email
        const checkUser = await user.findOne({ email: email}).select("-password")
        console.log(email)

        return res.status(200).json(checkUser)
      
    }catch(e){
        res.status(500).json({message: e.message})
    }
    })

module.exports = router