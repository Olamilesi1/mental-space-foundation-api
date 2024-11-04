import mongoose from "mongoose";

 const eventsSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    // description: {
    //     type: String,
    //     required: true,
    // },
    contents: {
        type: String,
        required: true
    },
    // date: {
    //     type: Date,
    //     required: true
    // },
  
}, {timestamps: true})

const Event = mongoose.model('Events', eventsSchema)

export default Event;