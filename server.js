import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(`Node server running on port number ${PORT}`);
});