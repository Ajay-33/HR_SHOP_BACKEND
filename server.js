import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
// import passport from 'passport';
// import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js"


const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

dotenv.config();
connectDB();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search",searchRoutes);
app.use("/api/v1/candidate",candidateRoutes)

const PORT = process.env.PORT || 800;

// listen
app.listen(PORT, () => {
  console.log(`Node server running on port number ${PORT}`);
});