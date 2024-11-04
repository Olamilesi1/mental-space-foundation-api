import express from "express";
import upload from "../middlewares/upload.js";
import {
  uploadResources,
  getResources,
  updateResources,
  deleteResources,
} from "../controllers/resourcesControllers.js";

const router = express.Router();

//Route to handle book upload
router.post("/resources-upload", upload.single("image"), uploadResources);

router.get("/all-resources", getResources);

router.delete("/delete-resources/:id", deleteResources);

router.patch("/update-resources/:id", updateResources);

export default router;