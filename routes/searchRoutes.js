import express from "express";
import { addSearch, getUserSearches, searchGPT } from "../controllers/searchController.js";
import userAuth from "../middlewares/authmiddleware.js";

const router = express.Router();

// REGISTER
router.post("/gpt", searchGPT);

router.post("/add",userAuth,addSearch);

router.get("/get",userAuth,getUserSearches);

export default router;
