import jwt from 'jsonwebtoken'
import User from '../../models/auth/userModel.js';
import asyncHandler from 'express-async-handler';

export const activityMonitoring = asyncHandler(async (req, res, next) => {
   
        try {
            const currentTime = Date.now();
        const lastActiveTime = req.user.lastActive.getTime();
            const differenceInMinutes = Math.abs(currentTime - lastActiveTime) / (1000 * 60);
            console.log(differenceInMinutes);
            if (differenceInMinutes > 2) {
                

                return res.status(402).send({ 
                    success: false,
                    message:'You were inactive for two minutes login again'
                })
            } else {
                next();
            }
        } catch (error) {
            console.log('hello');
            res.status(401);
            throw new Error("Not authorized, token failed"+error.message);
        }
    
   
});