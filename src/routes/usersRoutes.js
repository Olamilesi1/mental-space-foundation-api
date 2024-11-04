import express from 'express';

import {usersReg, usersLogin, getUsers, updateUser, deleteUser} from "../controllers/usersControllers.js"

import { authenticate } from "../middlewares/usersAuthenticate.js";


const router = express.Router()
//CRUD OPERATIONS

//POST-CREATE
//define users registration route
router.post('/register', usersReg)

//define users login route
router.post('/login', usersLogin)


//GET-READ
//define users route to get themselves
// router.get("/user", getUsers);
// router.get("/user", getUser);
// Define route to get a user by id, email, or username using query parameters
router.route("/user").get(authenticate, getUsers);


//UPDATE
//define users route to update themselves
// router.patch("/update-user/:id", updateUser);
// Define route to update a user by ID, protected by authentication
router.route("/update-user/:id").patch(authenticate, updateUser);


//DELETE
//define users route to delete themselves
// router.delete("/delete-user/:id", deleteUser);
// Define route to delete a user by ID, protected by authentication
router.route("/delete-user/:id").delete(authenticate, deleteUser);


//JESUS

export default router;

