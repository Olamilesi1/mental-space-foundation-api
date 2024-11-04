import httpStatus from "http-status";
import Event from "../models/eventsModel.js";
import { eventValidationSchema } from "../validations/eventsValidation.js";

const uploadEvent = async (req, res) => {
  // Validate the request data using Joi
  const { error, value } = eventValidationSchema.validate(req.body);
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

  const { title, description, contents, date } = value;
  const image = req.file.filename;

  try {
    // Check if the event already exists
    let event = await Event.findOne({ title });
    if (event) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Event already exists",
      });
    }

    // Create a new event
    event = new Event({
     image, title, description, contents, date
    });

    // Save the event to the database
    event = await event.save();

    return res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Event uploaded successfully",
      eventData: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while uploading the event",
    });
  }
};

const getEvents = async (req, res) => {
  try {
    let events = await Event.find({});

    if (events) {
      return res.status(200).json({
        message: "All events returned",
        eventData: events,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// delete event controller
const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: User not found",
      });
    }

    await Event.findByIdAndDelete(id);

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

const updateEvent = async (req, res) => {
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


export { uploadEvent, getEvents, deleteEvent, updateEvent };
