import httpStatus from "http-status";
import Resources from "../models/resourcesModel.js";
import { resourcesValidationSchema } from "../validations/resourcesValidation.js";

const uploadResources = async (req, res) => {
  // Validate the request data using Joi
  const { error, value } = resourcesValidationSchema.validate(req.body);
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
      message: "Resources cover image is required",
    });
  }

  const { title, summary, author, contents, date } = value;
  const image = req.file.filename;

  try {
    // Check if the resources already exists
    let resources = await Resources.findOne({ title });
    if (resources) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Resources already exists",
      });
    }

    // Create a new resources
    resources = new Resources({
        title, summary, image, author, contents, date 
    });

    // Save the blog to the database
    resources = await resources.save();

    return res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Resources uploaded successfully",
      resourcesData: resources,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while uploading the resources",
    });
  }
};

const getResources = async (req, res) => {
  try {
    let resources = await Resources.find({});

    if (resources) {
      return res.status(200).json({
        message: "All resources returned",
        resourcesData: resources,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// delete blog controller
const deleteResources = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const resources = await Resources.findById(id);

    if (!resources) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Resources not found",
      });
    }

    await Resources.findByIdAndDelete(id);

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

const updateResources = async (req, res) => {
  const { title, author } = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /user/:id

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
          message: "Another blog has this email already",
        });
      }
    }

    // Prepare the update object
    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,                          // The ID of the document you want to update
      { $set: updateData },        // The update operation to apply
      { new: true }                // Options to return the updated document
    );
    
    // Send response with updated user data
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

export { uploadResources, getResources, deleteResources, updateResources };
