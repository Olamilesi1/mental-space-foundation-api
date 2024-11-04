import express from 'express';

import { adminReg,
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
    getDonation,} from "../controllers/adminControllers.js"

import { authenticate } from "../middlewares/adminAuthenticate.js";

const router = express.Router()
//CRUD OPERATIONS

//POST-CREATE
//define admin registration route
router.post('/register', adminReg)

//define admin login route
router.post('/login', adminLogin)

//GET-READ
// Define route to get a subscriber by id, email, or username using query parameters
router.route("/all-users").get(authenticate, getUsers);


//GET-READ
// Define route to get a subscriber by id, email, or username using query parameters
router.route("/subscriber").get(authenticate, getSubscriber);

// Define route to get all subscribers, protected by authentication
router.route("/all-subscribers").get(authenticate, getSubscribers);


//UPDATE
// Define route to update a subscriber by ID, protected by authentication
router.route("/update-subscriber/:id").patch(authenticate, updateSubscriber);


//DELETE
// Define route to delete a subscriber by ID, protected by authentication
router.route("/delete-subscriber/:id").delete(authenticate, deleteSubscriber);


//GET-READ
// Define route to get a subscriber by id, email, or username using query parameters
router.route("/volunteer").get(authenticate, getVolunteer);

// Define route to get all volunteers, protected by authentication
router.route("/all-volunteers").get(authenticate, getVolunteers);


//UPDATE
// Define route to update a volunteer by ID, protected by authentication
router.route("/update-volunteer/:id").patch(authenticate, updateVolunteer);


//DELETE
// Define route to delete a volunteer by ID, protected by authentication
router.route("/delete-volunteer/:id").delete(authenticate, deleteVolunteer);


//GET-READ
// Define route to get a donation by id, email, or username using query parameters
router.route("/donation").get(authenticate, getDonation);

// Define route to get all donations, protected by authentication
router.route("/all-donations").get(authenticate, getDonations);

//JESUS

export default router;

