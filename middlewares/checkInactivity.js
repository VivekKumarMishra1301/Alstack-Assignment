import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

export const activityMonitoring = asyncHandler(async (req, res, next) => {
   
        try {
            const currentTime = new Date().toISOString();;
            console.log(currentTime);
            
            const lastActiveTime = req.user.lastActive;
            console.log(lastActiveTime);
            const differenceInMinutes = Math.abs(currentTime - lastActiveTime) / (1000 * 60);
            console.log(differenceInMinutes);
            if (differenceInMinutes > 2) {
                

                 await User.findByIdAndUpdate(
         req.user._id,
         {
             $unset: {
                 refreshToken: "" 
             }
         },
         {
             new: true
         }
     )
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     return res
     .status(200)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
         .send({
             success: true,
             message:'User logged out successfully due to inactivity of more than two minutes'
     })
            } else {
                const changeActivity = await User.findOneAndUpdate(
             { email: req.user.email }, 
            { $set: { lastActive: Date.now() } }, 
          { new: true }
           );
                next();
            }
        } catch (error) {
            console.log('hello');
            res.status(401);
            throw new Error("Some unexpected error"+error.message);
        }
    
   
});