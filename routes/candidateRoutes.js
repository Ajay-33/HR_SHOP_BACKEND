import express from "express";

import userAuth from "../middlewares/authmiddleware.js";
import { updateCandidateStatus } from "../controllers/candidateController.js";

const router = express.Router();

// REGISTER
router.put("/updateStatus/:searchId/:candidateId", userAuth, updateCandidateStatus);

export default router;
