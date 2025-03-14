const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  comments: [
    {
      _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        required: true
      },
      name_user: { type: String, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
      replies: { type: String, default:"" },
    },
  ],
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
