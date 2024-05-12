import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req, res, next) => {
    // console.log(req.headers);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            token = req.headers.authorization.split("Bearer ")[1]; 
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
            console.log(decoded.id);
            req.user = await User.findById(decoded.id).select("-password");
            // req.user._id = decoded.id;

            next();
        } catch (error) {
            console.log('hello');
            res.status(401);
            throw new Error("Not authorized, token failed"+error.message);
        }
    }
    // console.log(token);
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});