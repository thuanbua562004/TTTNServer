const express = require('express');
const route = express.Router();
const history = require('../Model/history')
const phonemodel = require("../Model/phone");

route.get('/history/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)

        if (id.length < 10) {
            const resultHistory = await history.findOne({ phone: id })

            return res.status(200).send(resultHistory)
        }
        const resultHistory = await history.findOne({ id: id })
        if (resultHistory) {
            return res.status(200).send(resultHistory)
        }
    } catch (error) {
        return res.status(404).send(error.message)
    }
})
route.get('/history', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const resultHistory = await history.find()
        if (resultHistory) {
            return res.status(200).send(resultHistory)
        }
    } catch (error) {
        return res.status(404).send(error.message)
    }
})

route.post('/history', async (req, res) => {
    try {
        const { id, address, methodPayload, totalPrice, note, phone, nameCustomer, listProduct } = req.body
        const newHistory = new history({
            id,
            adress: address,
            methodPayload,
            totalPrice,
            note,
            phone,
            nameCustomer,
            listProduct
        })
        const result = await newHistory.save()
        console.log(listProduct)
        for (const item of listProduct) {
            const { _id, color, memory, number } = item;
            // Tìm sản phẩm theo ID
            const product = await phonemodel.findOne({ _id: _id.match(/^[0-9a-f]+/i) });
            if (!product) {
                return res.status(404).send(`Product with ID ${_id} not found`);
            }

            // Tìm màu sản phẩm
            const colorVariant = product.image.find(variant => variant.color === color);
            if (!colorVariant) {
                return res.status(404).send(`Color ${color} not found for product ${product.name}`);
            }

            // Tìm bộ nhớ tương ứng
            console.log("check id>>>>" + memory)

            const memoryVariant = colorVariant.memory.find(mem => mem.infoMemory === memory);
            if (!memoryVariant) {
                return res.status(404).send(`Memory ${memory} not found for color ${color}`);
            }

            // Kiểm tra nếu đủ hàng
            if (memoryVariant.quantity < number) {
                return res.status(400).send(`Not enough stock for ${product.name} (${color}, ${memoryType})`);
            }

            // Trừ số lượng trong kho
            memoryVariant.quantity -= number;
            await product.save();
        }

        return res.status(200).send('Successfully')
    } catch (error) {
        return res.status(404).send(error.message)
    }
})
route.put('/history', async (req, res) => {
    try {
        const { id, status } = req.body;
        console.log(status, id)
        const result = await history.findOneAndUpdate({ _id: id }, { stage: status }, { new: true });
        console.log(result)

        return res.status(200).send('Successfully')
    } catch (error) {
        return res.status(404).send(error.message)
    }
})

module.exports = route