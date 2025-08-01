// middleware/authenticateUser.js

import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new UnauthenticatedError('No token Found')
    }


    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new UnauthenticatedError('Invalid Access Token')
    }

    req.user = user;
    next();

});

const authorizePermissions = (...roles) => {

    return (req, res, next) => {
      

        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route')
        }
        next()
    }
}

export { authenticateUser, authorizePermissions };
