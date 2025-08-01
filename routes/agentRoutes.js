import express from "express";
import Agent from "../models/Agent.js";
import { authenticateUser, authorizePermissions } from "../middleware/authenticate.js";
import { createAgent } from "../controllers/agentController.js";
const router = express.Router();

router.post("/", authenticateUser, authorizePermissions('admin'), createAgent);


export default router;
