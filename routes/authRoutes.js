
import express from 'express'
import { login, logout, register, refreshAccessToken } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authenticate.js';
const router = express.Router();
router.post("/register", register)
router.post("/login", login)
//secured routes
router.delete("/logout", authenticateUser, logout)
router.post("/refresh-token", refreshAccessToken)


export default router;