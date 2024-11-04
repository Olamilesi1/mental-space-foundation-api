import express from "express";
import upload from "../middlewares/upload.js";
import {
  uploadBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blogControllers.js";

const router = express.Router();

//Route to handle blog upload
router.post("/blog-upload", upload.single("image"), uploadBlog);

router.get("/all-blogs", getBlogs);

router.delete("/delete-blog/:id", deleteBlog);

router.patch("/update-blog/:id", updateBlog);

export default router;

