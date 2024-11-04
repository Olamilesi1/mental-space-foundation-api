import mongoose from "mongoose";

 const commentsSchema = new mongoose.Schema({
    comments: {
        type: String,
        required: true
    },
  
}, {timestamps: true})

const Comment = mongoose.model('Comments', commentsSchema)

export default Comment;