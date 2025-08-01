import { authenticateUser, authorizePermissions } from '../middleware/authenticate.js';
// routes/taskRoutes.js
import express from "express";
import multer from "multer";
import { getDistributedTasks, uploadFile } from "../controllers/taskController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authenticateUser, authorizePermissions('admin'), upload.single("file"), uploadFile);
router.get("/distribution", authenticateUser, authorizePermissions('admin'), getDistributedTasks);

export default router;
