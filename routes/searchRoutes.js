import express from "express";
import { searchGPT } from "../controllers/searchController.js";

const router = express.Router();

// REGISTER
router.post("/gpt", searchGPT);

export default router;
