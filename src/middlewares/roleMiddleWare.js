import httpStatus from "http-status"
import User from "../models/usersModel.js"

// Create a middleware function to check users roles
// Create a middleware function to check users roles
export const checkRole = (roles) => {
    return async (req, res, next) => {
        //get the user by his/her id from the req.user
        const userId = req.users.id; 
        
        // Extract user ID from the request (authenticated user)
        try {
            const user = await User.findById(userId);
           
  
        if (!user || !roles.includes(user.role)) {
          return res.status(httpStatus.FORBIDDEN).json({
            status: "error",
            // message: "Access denied",
            message: `You are not authorized to the ${user.role} role`,
          });
        }
  
        next();
      } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Error checking user role",
        });
      }
    };
  };
  