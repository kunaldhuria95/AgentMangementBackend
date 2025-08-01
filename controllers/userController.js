import asyncHandler from "../utils/asyncHandler.js";

export const showCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({ user: req.user })
})