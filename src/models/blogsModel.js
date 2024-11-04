import mongoose from "mongoose";

 const blogsSchema = new mongoose.Schema({
    // image: {
    //     type: String,
    // },
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        maxlength: 60
    },
    contents: {
        type: String,
        required: true
    },
    // date: {
    //     type: Date,
    //     required: true
    // },
  
}, {timestamps: true})

const Blog = mongoose.model('Blogs', blogsSchema)

export default Blog;