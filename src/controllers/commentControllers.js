import httpStatus from "http-status";
import Comment from "../models/commentsModel.js";
import { commentValidationSchema } from "../validations/commentsValidation.js";

const uploadComment = async (req, res) => {
  // Validate the request data using Joi
  const { error, value } = commentValidationSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { comments } = value;

  try {
     // Create a new comment
  const  comment = new Comment({
        comment: comments
    });

    // Save the book to the database
    await comment.save();

    return res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Comment uploaded successfully",
      commentData: comment,
    });

  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while uploading the comment",
    });
  }
};

const getComments = async (req, res) => {
  try {
    let comments = await Comment.find({});

    if (comments) {
      return res.status(200).json({
        message: "All comments returned",
        commentData: comments,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// delete book controller
const deleteComment = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Comment not found",
      });
    }

    await Comment.findByIdAndDelete(id);

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

const updateComment = async (req, res) => {
  const { comments} = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /user/:id

  try {
    // Check if the book exists
    const commentExists = await Comment.findById(id);
    if (!commentExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "Comment not found",
      });
    }

    // Check if the title already exists for another book
    // if (title) {
    //   const titleExists = await Book.findOne({ title });
    //   if (titleExists && titleExists._id.toString() !== id) {
    //     return res.status(httpStatus.CONFLICT).json({
    //       status: "error",
    //       message: "Another book has this email already",
    //     });
    //   }
    // }

    // Prepare the update object
    const updateData = {};
    if (comments) updateData.comment = comment;

    const updatedComment= await Comment.findByIdAndUpdate(
      id,                          // The ID of the document you want to update
      { $set: updateData },        // The update operation to apply
      { new: true }                // Options to return the updated document
    );
    
    // Send response with updated user data
    return res.status(httpStatus.OK).json({
      status: "success",
      updatedData: updatedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export { uploadComment, getComments, deleteComment, updateComment };
