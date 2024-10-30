import express from "express";
import { addSearch, getShortlistedCandidates, getUserSearches, searchGPT, updateShortlist } from "../controllers/searchController.js";
import userAuth from "../middlewares/authmiddleware.js";

const router = express.Router();

// REGISTER
router.post("/gpt", searchGPT);

router.post("/add",userAuth,addSearch);

router.get("/get",userAuth,getUserSearches);

router.post("/updateShortlist/:searchId",userAuth,updateShortlist);

router.get("/getShortlist", userAuth, getShortlistedCandidates);

export default router;
