import httpStatus from "http-status";
import Blog from "../models/blogsModel.js";
import { blogValidationSchema } from "../validations/blogsValidation.js";

const uploadBlog = async (req, res) => {
  console.log('Request Body:', req.body); // Check if all fields are received
  console.log('Uploaded File:', req.file); // Check if the file is received
  
  // Validate the request data using Joi
  const { error, value } = blogValidationSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: error.details[0].message,
    });
  }
 
  // Check if the file was uploaded  
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Blog cover image is required",
    });
  }

  const { title, summary, author, contents, date } = value;
  const image = req.file.filename;

  try {
    // Check if the blog already exists
    let blog = await Blog.findOne({ title });
    if (blog) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Blog already exists",
      });
    }

    // Create a new blog
    blog = new Blog({
      title,
      summary,
      image,
      author,
      contents,
      date: date || new Date() // Default to current date if not provided
    });

    // Save the blog to the database
    blog = await blog.save();

    return res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Blog uploaded successfully",
      blogData: blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while uploading the blog",
    });
  }

  
};

const getBlogs = async (req, res) => {
  try {
    let blogs = await Blog.find({});

    if (blogs) {
      return res.status(200).json({
        message: "All blogs returned",
        blogData: blogs,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// delete blog controller
const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: User not found",
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
}; 

const updateBlog = async (req, res) => {
  const { title, summary, author, contents } = req.body;
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  console.log("Request Body:", req.body); // Debugging line
  console.log("Uploaded File:", req.file); // Debugging line
   
  try {
    // Check if the blog exists
    const blogExists = await Blog.findById(id); 
    if (!blogExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "Blog not found",
      });
    }

    // Check if the title already exists for another blog
    if (title) {
      const titleExists = await Blog.findOne({ title });
      if (titleExists && titleExists._id.toString() !== id) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "Another blog has this title already",
        });
      }
    }

    // Prepare the update object
    const updateData = {};
    if (image) updateData.image = image;
    if (title) updateData.title = title;
    if (summary) updateData.summary = summary;
    if (author) updateData.author = author;
    if (contents) updateData.contents = contents;

    console.log("Update Data:", updateData); // Debugging line

    // Check if there's data to update
    // if (Object.keys(updateData).length === 0) {
    //   return res.status(httpStatus.BAD_REQUEST).json({
    //     status: "error",
    //     message: "No valid fields to update",
    //   });
    // }

    // Update the blog data
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // Send response with updated blog data
    return res.status(httpStatus.OK).json({
      status: "success",
      updatedData: updatedBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export { uploadBlog, getBlogs, deleteBlog, updateBlog };
