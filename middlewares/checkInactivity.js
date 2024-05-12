import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

export const activityMonitoring = asyncHandler(async (req, res, next) => {
   
        try {
            const currentTime = new Date(); // Current time as a Date object
console.log(currentTime);

const lastActiveTime = new Date(req.user.lastActive); // Convert lastActive to a Date object
console.log(lastActiveTime);

const differenceInMilliseconds = Math.abs(currentTime - lastActiveTime); // Difference in milliseconds
const differenceInMinutes = differenceInMilliseconds / (1000 * 60); // Convert milliseconds to minutes
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