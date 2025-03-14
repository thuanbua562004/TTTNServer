const express = require('express');
const route = express.Router();
const comment = require('../Model/comment');


route.get('/comment', async (req, res) => {
    try {
        const result = await comment.find()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json(error);
    }


})

route.get('/comment/:postId', async (req, res) => {
    try {
        const id = req.params.postId;
        console.log("checccc>>>>>>"+id)
        const result = await comment.findOne({postId:id });
        console.log(result)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json(error);
    }


})

//người dùng bình luận về sản phẩm
route.post('/comment', async (req, res) => {
    try {
        const { postId, comments } = req.body;
        const check_Post = await comment.findOne({ "postId": postId });
        console.log(comments)
        if (check_Post) {
            check_Post.comments.push(comments);
            console.log(check_Post)
            const result = await check_Post.save();
            return res.status(200).json('Success')
        }

        const newComment = new comment({
            postId: postId,
            comments
        })
        const result = await newComment.save();
        return res.status(200).json(result)
    } catch (error) {
        console.error(error)
        return res.status(404).json(error);
    }

})

route.put('/comment/reply', async (req, res) => {
    try {
        const { postId, id, reply } = req.body;
        const result = await comment.findOneAndUpdate(
            { "postId": postId  ,"comments._id":id},
            {
             "comments.$.replies": reply
            },            { new: true }
        );
        console.log(result);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Comment not found or reply not added" });
        }

        return res.status(200).json({ message: "Reply added successfully", result });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error adding reply", error });
    }
});


route.delete('/comment/:postId/:id_comment', async (req, res) => {
    try {
        const { postId, id_comment } = req.params;
        const result = await comment.findOne({ "postId": postId  ,"comments._id":id_comment} );
        console.log(result);
        result.comments = result.comments.filter(comment => comment._id.toString() !== id_comment);
        await result.save();

        return res.status(200).json({ message: "Reply added successfully", result });
    } catch (error) {
        return res.status(500).json({ message: "Error adding reply", error });
    }
});

module.exports = route;