import Agent from "../models/Agent.js";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError, CustomAPIError } from "../errors/index.js"
import asyncHandler from "../utils/asyncHandler.js";

const createAgent = asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
        throw new BadRequestError("All fields are required");
    }

    const exists = await Agent.findOne({ email });
    if (exists) throw new BadRequestError("Agent already exists");

    const agent = await Agent.create({ name, email, mobile, password });

    const { password: _, ...agentData } = agent.toObject();
    res.status(201).json(agentData);
})


const getAllAgents = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "", sort = "createdAt" } = req.query;

    const query = {
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const agentsPromise = Agent.find(query)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    const countPromise = Agent.countDocuments(query);

    const [agents, total] = await Promise.all([agentsPromise, countPromise]);

    if (!agents || agents.length === 0) {
        throw new NotFoundError("No agents found");
    }

    res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
        agents,
    });
});

export { getAllAgents, createAgent }