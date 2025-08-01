import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError, CustomAPIError } from "../errors/index.js"
import asyncHandler from '../utils/asyncHandler.js';

const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('No User found');
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new CustomAPIError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const register = asyncHandler(async (req, res, next) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new BadRequestError('"All fields (name, email, and password) are required"')
    }

    const user = await User.create({ name, email, password })
    const { password: removedPassword, ...userWithoutPassword } = user.toObject();


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ "User": userWithoutPassword, accessToken, refreshToken })


})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('All fields (email and password) are required');
    }
   
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('No User Exists');
    }

    const isPasswordCorrect = await user.comparePassword(password.toString());
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Wrong Password');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const { password: removedPassword, refreshToken: removedRefresh, ...loggedInUser } = user.toObject();

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json({ user: loggedInUser, accessToken, refreshToken });
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshtoken) {
        throw new UnauthorizedError('Unauthorized request');
    }

    const decodedToken = jwt.verify(incomingRefreshtoken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    if (incomingRefreshtoken !== user?.refreshToken) {
        throw new UnauthorizedError('Refresh Token Expired');
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', newRefreshToken, options)
        .json({ msg: 'Token Refreshed', accessToken, refreshToken: newRefreshToken });
});

// Logout
const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: null,
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json({ success: 'User Logged Out' });
});

export { register, login, logout, refreshAccessToken };
