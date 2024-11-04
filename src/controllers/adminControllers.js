//import authentication dependencies
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/adminValidation.js";
import adminValidateSchema from "../utils/adminValidateSchema.js";
import { response } from "express";

//admins registration controller using joi validation
const adminReg = async (req, res) => {
  const { error } = adminValidateSchema(registerSchema, req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  const { username, email, password } = req.body;

  //check if the admin is already registered
  try {
    //find out if the admin is already registered
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({
        message: responseMessages.userExists,
      });
    } else {
      // Check if admin username already exists
      admin = await Admin.findOne({ username: username });
      if (admin) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "Username is already in use",
        });
      }

      //create admin and save details to database
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new admin
      admin = new Admin({ username, email, password: hashedPassword });
      await admin.save();

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

//admin login controller
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //checking if the admin exists
    let adminExists = await Admin.findOne({ email });

    if (!adminExists) {
      res.status(404).json({
        message: responseMessages.invalidCredentials,
        
      });
    }

    //checking if password is correct
    const confirmedPassword = await bcrypt.compare(
      password,
      adminExists.password 
    );

    if (!confirmedPassword) {
      res.status(401).json({
        message: responseMessages.invalidCredentials,
      });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: adminExists._id, email: adminExists.email },
      process.env.JWT_SECRET,
      { expiresIn: "2m" } // Token expiration time
    );

    //send success message if credentials are correct
    res.status(200).json({
      message: responseMessages.loginSuccess,
      userData: adminExists,
      authToken: token,
    });
  } catch (error) {
    console.error(error);
  }
};

//admin controller function to get all subscribers
const getUsers = async (req, res) => {
  try {
    //find out if all the user is already registered

    //query the Admin model to return all users and store them in the users variable
    let users = await Admin.find({});

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

//admin controller function to get all subscribers
const getSubscribers = async (req, res) => {
  try {
    //find out if all the user is already registered

    //query the Admin model to return all users and store them in the users variable
    let users = await Admin.find({});

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

//admin controller function to get one subscriber
const getSubscriber = async (req, res) => {
  const { type, id, email, username } = req.query;

  try {
    let user;

    switch (type) {
      case "id":
        if (!id) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "ID parameter is required.",
          });
        }
        user = await Admin.findById(id);
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noId,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      case "email":
        if (!email) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "Email parameter is required.",
          });
        }
        user = await Admin.findOne({ email });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noEmail,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      case "username":
        if (!username) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "Username parameter is required.",
          });
        }
        user = await Admin.findOne({ username });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noUsername,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      default:
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "Error",
          message: "Invalid query type. Use 'id', 'email', or 'username'.",
        });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: "An unexpected error occurred.",
    });
  }
};

//admin controller function to get remove one subscriber
const deleteSubscriber = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const user = await Admin.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Admin not found",
      });
    }

    await Admin.findByIdAndDelete(id);

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

//admin controller function to get update one subscriber
const updateSubscriber = async (req, res) => {
  const { email, password, username } = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /user/:id

  try {
    // Check if the user exists
    const userExists = await Admin.findById(id);
    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "Admin not found",
      });
    }

    // Check if the email address already exists for another user
    if (email) {
      const emailExists = await Admin.findOne({ email });
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
    const updatedUser = await Admin.findByIdAndUpdate(
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

//admin controller function to get all volunteers
const getVolunteers = async (req, res) => {
  try {
    //find out if all the user is already registered

    //query the Admin model to return all users and store them in the users variable
    let users = await Admin.find({});

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

//admin controller function to get one volunteer
const getVolunteer = async (req, res) => {
  const { type, id, email, username } = req.query;

  try {
    let user;

    switch (type) {
      case "id":
        if (!id) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "ID parameter is required.",
          });
        }
        user = await Admin.findById(id);
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noId,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      case "email":
        if (!email) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "Email parameter is required.",
          });
        }
        user = await Admin.findOne({ email });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noEmail,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      case "username":
        if (!username) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "Username parameter is required.",
          });
        }
        user = await Admin.findOne({ username });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noUsername,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      default:
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "Error",
          message: "Invalid query type. Use 'id', 'email', or 'username'.",
        });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: "An unexpected error occurred.",
    });
  }
};

//admin controller function to get remove one volunteer
const deleteVolunteer = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const user = await Admin.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Admin not found",
      });
    }

    await Admin.findByIdAndDelete(id);

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

//admin controller function to get update one volunteer
const updateVolunteer = async (req, res) => {
  const { email, password, username } = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /user/:id

  try {
    // Check if the user exists
    const userExists = await Admin.findById(id);
    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "Admin not found",
      });
    }

    // Check if the email address already exists for another user
    if (email) {
      const emailExists = await Admin.findOne({ email });
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
    const updatedUser = await Admin.findByIdAndUpdate(
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

//admin controller function to get all donations
const getDonations = async (req, res) => {
  try {
    //find out if all the user is already registered

    //query the Admin model to return all users and store them in the users variable
    let users = await Admin.find({});

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

//admin controller function to get one donation
const getDonation = async (req, res) => {
  const { type, id, email, username } = req.query;

  try {
    let user;

    switch (type) {
      case "id":
        if (!id) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "ID parameter is required.",
          });
        }
        user = await Admin.findById(id);
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noId,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      case "email":
        if (!email) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "Email parameter is required.",
          });
        }
        user = await Admin.findOne({ email });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noEmail,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      case "username":
        if (!username) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "Error",
            message: "Username parameter is required.",
          });
        }
        user = await Admin.findOne({ username });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: "Error",
            message: responseMessages.noUsername,
          });
        }
        return res.status(httpStatus.OK).json({
          status: "success",
          userData: user,
        });

      default:
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "Error",
          message: "Invalid query type. Use 'id', 'email', or 'username'.",
        });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: "An unexpected error occurred.",
    });
  }
};

export {
  adminReg,
  adminLogin,
  getUsers,
  getSubscribers,
  getSubscriber,
  updateSubscriber,
  deleteSubscriber,
  getVolunteers,
  getVolunteer,
  deleteVolunteer,
  updateVolunteer,
  getDonations,
  getDonation,
};

// blog: Post blog, delete blog, get all blog, get one blog, update blog
//resources: Post resources, delete resources, update resources, get all resources, get one resource
//event: Post event, delete event, get all events, get one event, update event
//comment: Post comment, delete comment, update comment, get all comment, get one comment
//volunteer: get all volunteers, get one volunteer, block volunteer
//donors: get all donations, get one donation
//subscribers: get all subscribers, get one subscriber, delete subscriber, updatesubscriber
//login register
