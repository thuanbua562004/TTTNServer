const express = require('express')
const route = express.Router()
const cart = require("../Model/cart")

route.get('/cart/:id',async (req, res) => {
    try {
        const id_Cart = req.params.id
        console.log(id_Cart)
        const result = await cart.findOne({id: id_Cart});
        if (result){
            res.status(200).send(result)
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

route.post('/cart',async (req, res) => {
    const {id_user,id_color_memory ,id_product,color , imgProduct , nameProduct ,number,price ,memory} = req.body

    try {
        const checkCart = await cart.findOne({id : id_user})
        if (!checkCart){
            const newCart = new cart({
                id : id_user,
                details : [{
                    _id : id_color_memory,
                    color : color,
                    id_product : id_product,
                    imgProduct : imgProduct,
                    nameProduct : nameProduct,
                    number : number,
                    price : price,
                    memory : memory
                }]
            })
            const result = await newCart.save()
            if(result){
                return res.status(201).send(result)
            }
        }else{
            const checkProduct = checkCart.details.find((items)=>(items._id ==id_color_memory))
            if(checkProduct){
               return res.status(501).send(`Sản phẩm đã có trong giỏ hàng!`);
            }else{
                checkCart.details.push({
                    _id : id_color_memory,
                    color : color,
                    id_product : id_product,
                    imgProduct : imgProduct,
                    nameProduct : nameProduct,
                    number : number,
                    price : price,
                    memory : memory
                })
                const updatedCart = await checkCart.save();
                if(updatedCart){
                  return  res.status(200).send(updatedCart);
                }
            }
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau!" });
    }
})

//update cart 
route.put('/cart',async (req,res) => {
    try {
        const {id_user,id_color_memory,number} = req.body
        console.log(id_user,id_color_memory,number)
        const result = await cart.findOneAndUpdate({id : id_user, "details._id" : id_color_memory},{
            $set : {
                "details.$.number" : number
            }
        },{new : true})
        if(result){
            res.status(200).send(result)
        }
    } catch (error) {
        return res.status(500).json({ error: "Lỗi vui long thử lại" });
    }
})

route.delete('/cart',async (req,res)=>{
    try {
        const {id_Cart, id_Color_Memory} = req.body
        const findCart =await cart.findOne({id:id_Cart})
        if(findCart){
            findCart.details = findCart.details.filter((item) => item._id !== id_Color_Memory);
        }
        console.log(findCart)
        await findCart.save()
        res.status(200).send('Deleted Successfully')

    } catch (error) {
        res.status(404).json({ error: error.message})
    }
})
module.exports = route