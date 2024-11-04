import mongoose from "mongoose";

 const resourcesSchema = new mongoose.Schema({
    image: {
        type: String,
    },
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

const Resources = mongoose.model('Resourcess', resourcesSchema)

export default Resources;