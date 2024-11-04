import mongoose from 'mongoose';

//define schema for users
const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength:5, maxlength: 10},
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true, minlength:5, maxlength: 70},
}, {timestamps: true})

// Create the users model based on the schema
const Users = mongoose.model('Users', User);

// Export the user model
export default Users;