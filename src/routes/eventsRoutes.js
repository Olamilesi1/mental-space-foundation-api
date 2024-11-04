import express from "express";
import upload from "../middlewares/upload.js";
import {
  uploadEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventControllers.js";

const router = express.Router();

//Route to handle event upload
router.post("/events-upload", upload.single("image"), uploadEvent);

router.get("/all-events", getEvents);

router.delete("/delete-event/:id", deleteEvent);

router.patch("/update-event/:id", updateEvent);

export default router;