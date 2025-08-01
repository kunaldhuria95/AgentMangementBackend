import express from "express";
import { authenticateUser } from '../middleware/authenticate.js';
import { showCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.route('/showMe').get(authenticateUser, showCurrentUser)

export default router;
