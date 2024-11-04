//import authentication dependencies
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/usersModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/usersValidation.js";
import usersValidateSchema from "../utils/usersValidateSchema.js";
import { response } from "express";

//users registration controller using joi validation
const usersReg = async (req, res) => {
  const { error } = usersValidateSchema(registerSchema, req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  const { username, email, password } = req.body;

  //check if the user is already registered
  try {
    //find out if the admin is already registered
    let user = await Users.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        message: responseMessages.userExists,
      });
    } else {
      // Check if username already exists
      user = await Users.findOne({ username: username });
      if (user) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "Username is already in use",
        });
      }

      //create user and save details to database
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      user = new Users({ username, email, password: hashedPassword });
      await user.save();

      res.status(201).json({
        message: responseMessages.userRegistered,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred during registration",
    });
  }
};

// users login controller
const usersLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //checking if the user exists
    let userExists = await Users.findOne({ email });

    if (!userExists) {
      res.status(404).json({
        message: responseMessages.invalidCredentials,
      });
    }

    //checking if password is correct
    const confirmedPassword = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!confirmedPassword) {
      res.status(401).json({
        message: responseMessages.invalidCredentials,
      });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: userExists._id, email: userExists.email },
      process.env.JWT_SECRET,
      { expiresIn: "2m" } // Token expiration time
    );

    //send success message if credentials are correct
    res.status(200).json({
      message: responseMessages.loginSuccess,
      userData: userExists,
      authToken: token,
    });
  } catch (error) {
    console.error(error);
  }
};

//users delete controller
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Users not found",
      });
    }

    await Users.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: responseMessages.deletedSuccessfully,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};

//users update controller
const updateUser = async (req, res) => {
  const { email, password, username } = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /user/:id

  try {
    // Check if the user exists
    const userExists = await Users.findById(id);
    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "Users not found",
      });
    }

    // Check if the email address already exists for another user
    if (email) {
      const emailExists = await Users.findOne({ email });
      if (emailExists && emailExists._id.toString() !== id) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "Another user has this email already",
        });
      }
    }

    // Prepare the update object
    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // Send response with updated user data
    return res.status(httpStatus.OK).json({
      status: "success",
      updatedData: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

//users controller function to get all users
const getUsers = async (req, res) => {
  try {
    //find out if all the user is already registered
    //query the Admin model to return all users and store them in the users variable
    let users = await Users.find({});

    if (users) {
      return res.status(200).json({
        message: responseMessages.registeredUsers,
        userData: users,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export { usersReg, usersLogin, updateUser, deleteUser, getUsers };
