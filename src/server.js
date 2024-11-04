//JESUS

// importing all dependencies needed for our express server
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import httpStatus from "http-status";
import bodyParser from "body-parser";
import colors from "colors";
import Adminrouter from "./routes/adminRoutes.js";
import Usersrouter from "./routes/usersRoutes.js";
import Blogsrouter from "./routes/blogsRoutes.js";
import Eventsrouter from "./routes/eventsRoutes.js";
import Resourcesrouter from "./routes/resourcesRoutes.js";
import Commentsrouter from "./routes/commentsRoutes.js";

// importing all functions and middlewares
import { dbConnection } from "./config/dbConnection.js";

// creating an instance of express
const app = express();

// load our environment variables from the .env
// 1. configure dotenv
dotenv.config();
// 2. destructure and call our environment variables from .env
const { PORT, NODE_ENV } = process.env;

// declare our servers's or express app general use
app.use(bodyParser.json());
app.use(cors());
// app.use(cors({
//   origin: 'https://mental-space-foundation.vercel.app/', // Change to your frontend URL
//   credentials: true
// }));

app.use('/uploads', express.static('uploads'));

app.use(helmet());
 
// give condition to use morgan
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// specifying different routes for our server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    status: "success",
    message: "Welcome to my organization server!",
  });
});

// admin base routes
app.use("/admins", Adminrouter);

// users base routes 
app.use("/users", Usersrouter);

//books base routes
app.use('/api/blogs', Blogsrouter);

//events base routes
app.use('/api/events', Eventsrouter);

//resources base routes
app.use('/api/resources', Resourcesrouter);

//comments base routes
app.use('/api/comments', Commentsrouter);

//connecting to the database
dbConnection()
  .then(() => {
    console.log("Database connection established".bgMagenta);

    // setting a port for our server to listen on
    app.listen(PORT, () => {
      console.log(`Our sever is listening on ${PORT} in ${NODE_ENV}`.cyan);
    });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error}`);
  });
