let express = require('express');
const phone = require('../Model/phone')
const router = express.Router()

router.post('/phone', async (req, res) => {
    try {
        const newProduct = req.body.data;
        console.log(newProduct.listImages)
        const newPhone = new phone({  // Changed from `phone` to `newPhone`
            name: newProduct.name,
            info: newProduct.info,
            category:newProduct.category,
            Sim:newProduct.Sim,
            Design:newProduct.Design,
            Screen:newProduct.Screen,
            Pixel:newProduct.Pixel,
            Cpu:newProduct.Cpu,
            Ram:newProduct.Ram,
            Rom:newProduct.Rom,
            Camera1:newProduct.Camera1,
            Camera2:newProduct.Camera2,
            Jack:newProduct.Jack,
            Battery:newProduct.Battery,
            image: newProduct.image,
            listImages : newProduct.listImages
        });

        const result = await newPhone.save();  // Use `newPhone` here
        res.send(result);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.get('/phone',async (req, res) => {
try {
    const resultPhone = await phone.find()
    if(resultPhone){
        res.status(200).send(resultPhone)
    }else{
        res.status(404).send(e.message)
    }
} catch (e) {
    res.status(404).send(e.message)
}

})
router.get('/phone/:id',async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const resultPhone = await phone.findById({_id : id})
        if(resultPhone){
            res.status(200).send(resultPhone)
        }else{
            res.status(404).send("Not Found")
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
    
    })

router.put('/phone',async (req, res) =>{
    try {
        const data = req.body.data
        console.log(data.category)
        const updatePhone = await phone.findOneAndUpdate({_id : data.id},{
            name : data.name,
            info : data.info,
            category:data.category,
            Sim:data.Sim,
            Design:data.Design,
            Screen:data.Screen,
            Pixel:data.Pixel,
            Cpu:data.Cpu,
            Ram:data.Ram,
            Rom:data.Rom,
            Camera1:data.Camera1,
            Camera2:data.Camera2,
            Jack:data.Jack,
            Battery:data.Battery,
            image : data.image,
        }, {new : true})
        if(updatePhone){
            res.status(200).send(updatePhone)
        }else{
            res.status(404).send("Not Found")
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
    
 
})

router.delete('/phone/:id',async (req, res) =>{
    const id = req.params.id
    const deletePhone = await phone.deleteOne({_id : id})
    if(deletePhone){
        res.status(200).send('Deleted Successfully')
    }else{
        res.status(404).send(e.message)
    }
})

module.exports = router;
