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
        return   res.status(200).json({message: 'User registered successfully'})
    }else{
        return   res.status(404).json({message: 'Registration failed'})
    }
}catch(e){
    return   res.status(500).json({message: e.message})
}
})
// login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const login = await user.findOne({ email: email });
        console.log('checkkk login'+password)
        if (!login) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }
        if (login.password !== password) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }else{
            const token = jwt.sign({ 
                id: login._id, 
                email: login.email 
            }, 'shhhhh', { expiresIn: '12h' }); // 12 giờ
            return   res.status(200).json({ message: 'Đăng nhập thành công', token });
        }
        
    } catch (e) {
        return  res.status(500).json({ message: 'Lỗi máy chủ', error: e.message });
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
                return res.status(200).json({message: 'User registered successfully'})
            }
        }
        return res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi máy chủ', error: e.message });
    }
});
router.put('/update',async (req,res) => {
    const {name , phone, address,avatar ,date, id} = req.body
    const filter = { _id: id };
    console.log(filter);
    const userUpdate ={
        name : name,
        phone : phone,
        address : address,
        date:date,
        avatar : avatar
    }
    const resultUpdate = await user.findOneAndUpdate(filter, userUpdate,{new : true})
    console.log(resultUpdate)
    if(resultUpdate){
        return  res.status(200).json({resultUpdate})
    }else{
        return  res.status(404).json({message: 'User not found'})
    }
});


router.get('/user/:email',async (req,res) => {
    try{
        const email = req.params.email
        const checkUser = await user.findOne({ email: email}).select("-password")
        console.log(email)

        return res.status(200).json(checkUser)
      
    }catch(e){
        return  res.status(500).json({message: e.message})
    }
    })

module.exports = router