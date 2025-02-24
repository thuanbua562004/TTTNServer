const express = require('express');
const route = express.Router();
const category = require('../Model/category')
route.get('/category',async (req, res) => {
   try {
    const result =await category.find()
    res.status(200).send(result)
   } catch (error) {
    res.status(404).send(error.message)
   }
});

route.post('/category',async (req, res) => {
    try {
        const {name , img ,description} = req.body
        console.log( img)
        const findDuplicate = await category.findOne({ name: name });
        console.log("Check Duplicate >>>>> ", findDuplicate);
        
        if (findDuplicate) {
            return res.status(400).send("Duplicate category");
        }
        
        const newCategory = new category({
            name: name,
            img : img ,
            description: description
        })
        const result =await newCategory.save()
        return  res.status(200).send(result)
    } catch (error) {
        return res.status(404).send(error)

    }
})

route.put('/category',async (req, res) => {
    try {
        const {id , name} = req.body
        const result = await category.findOneAndUpdate({_id:id},{name:name},{new : true})
        return  res.status(201).send(result)
    } catch (error) {
        return res.status(404).send(error)

    }
})
route.delete('/category/:id',async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const result =await category.deleteOne({_id:id})
        return  res.status(201).send(result)
    } catch (error) {
        return res.status(404).send(error)

    }
})
module.exports = route