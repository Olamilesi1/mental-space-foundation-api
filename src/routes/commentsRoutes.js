import express from "express";
import {
  uploadComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/commentControllers.js";

const router = express.Router();

//Route to handle book upload
router.post("/comment-upload", uploadComment);

router.get("/all-comments", getComments);

router.delete("/delete-comment/:id", deleteComment);

router.patch("/update-comment/:id", updateComment);

export default router;