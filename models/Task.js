// models/Task.js

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            required: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            match: /^[+0-9]+$/
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
