import xlsx from "xlsx";
import Agent from "../models/Agent.js";
import Task from "../models/Task.js";
import { BadRequestError } from "../errors/index.js";
import asyncHandler from "../utils/asyncHandler.js";
export const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new BadRequestError("No file uploaded");
    }
    console.log("HELLo")
    // Parse buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Filter out rows without phone number
    const filtered = data.filter((row) => row.Phone);

    if (filtered.length === 0) {
        throw new BadRequestError("No valid entries with Phone numbers");
    }

    const agents = await Agent.find();
    if (agents.length === 0) {
        throw new BadRequestError("No agents found in the system");
    }
    // Round-robin distribution
    const distributed = Array.from({ length: agents.length }, () => []);
    filtered.forEach((item, index) => {
        const agentIndex = index % agents.length;
        distributed[agentIndex].push(item);
    });

    const taskDocuments = [];
    agents.forEach((agent, i) => {
        for (const item of distributed[i]) {
            taskDocuments.push({
                agent: agent._id,
                firstName: item.FirstName,
                phone: item.Phone,
                notes: item.Notes || "",
            });
        }
    });

    await Task.insertMany(taskDocuments);

    res.status(200).json({
        success: true,
        message: `Successfully distributed ${taskDocuments.length} items among ${agents.length} agents`,
    });
});


export const getDistributedTasks = asyncHandler(async (req, res) => {
    // Fetch all tasks and populate agent data
    const tasks = await Task.find().populate("agent", "name email");

    // Group tasks by agent
    const grouped = {};

    tasks.forEach(task => {
        const agentId = task.agent._id.toString();
        if (!grouped[agentId]) {
            grouped[agentId] = {
                agent: task.agent,
                tasks: [],
            };
        }
        grouped[agentId].tasks.push({
            _id: task._id,
            firstName: task.firstName,
            phone: task.phone,
            notes: task.notes,
            createdAt: task.createdAt,
        });
    });

    const result = Object.values(grouped); // Convert grouped object to array
    res.status(200).json(result);

});