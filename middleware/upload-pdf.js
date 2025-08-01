// middlewares/uploadMiddleware.js

import multer from "multer";
import { BadRequestError } from "../errors/index.js";

// Allowed mime types
const allowedMimeTypes = [
    "text/csv",
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
];
const allowedExts = [".csv", ".xlsx", ".xls"];

// File filter function
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new BadRequestError("Only CSV, XLSX, or XLS files are allowed"));
    }
};

// Multer upload configuration
const upload = multer({
    storage: multer.memoryStorage(), // Or diskStorage if needed
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
    fileFilter
});

export default upload;
