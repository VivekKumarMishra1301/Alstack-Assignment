
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import { comparePassword, encryptPassword } from '../utils/encrypterDecrypter.js'

import {generateAccessToken, generateRefreshToken} from '../config/generateToken/generateToken.js'


export const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(401).send({ 
                success: false,
                message: 'No email Provided'
                
            })
        }


        if (!password) {
            return res.status(401).send({
                success: false,
                message: 'Password Required'
            })
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message:'User Does not Exist'
            })
        }


          const matchPassword = await comparePassword(password, user.password);
        if (!matchPassword) {
            return res.status(404).send({
                success: false,
                message: 'Password is Incorrect'
            })
        }

        const accessToken = await generateAccessToken(user._id, user.email, user.username);
        const refreshToken = await generateRefreshToken(user._id);
        const options = {
        httpOnly: true,
        secure: true
        }
        
        const updateRefreshToken = await User.findByIdAndUpdate(user._id, {
            $set:{refreshToken:refreshToken,lastActive:Date.now()}
        })

        return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options).send({
            success: true,
            message: 'Now You Are Logged In ',
            user: {
                _id:user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePic
                
            },
        accessToken,
            refreshToken
        })



    } catch (error) {
         console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
})






export const registerUser = asyncHandler(async (req, res) => {
    try {
        
        const { name, email,username, password, confirmPassword, profilePic } = req.body;
        if (!name||!username || !email || !password || !confirmPassword) {
            return res.status(401).send({ 
                success: false,
                message:'Please enter All Details'
            })
        }
        if (password !== confirmPassword) {
            return res.status(401).send({
                success: false,
                message: 'Password and Confirm Password must be same'
            });
        }


        const checkIfEmailExist = await User.findOne({ email: email });
        if (checkIfEmailExist) {
             return res.status(403).send({
                success: false,
                message: 'Email Already Exist'
            });
        }

         const checkIfUserExist = await User.findOne({ username: username });
        if (checkIfUserExist) {
             return res.status(403).send({
                success: false,
                message: 'Username Already Exist'
            });
        }

         const hashedPassword = await encryptPassword(password);

        const user = await User.create({ name: name, email: email, password: hashedPassword, username: username, profilePic: profilePic });
        return res.status(201).send({
            success: true,
            message:'User Registered SuccessFully'
        })



    } catch (error) {
         console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
})






export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =  req.body.refreshToken

    if (!incomingRefreshToken) {
       
        return res.status(401).send({
            success: false,
            message: "Unauthorized Request"
        })
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_KEY
        )
    
        const user = await User.findById(decodedToken?.id).select("-password ");
        console.log(user?.refreshToken);
        console.log(incomingRefreshToken)
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Invalid Refresh Token"
            })
     
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).send({
                success: false,
                message: "Refresh token is expired."
            })
         
            
        }
        const accessToken = await generateAccessToken(user._id, user.email, user.username);
        const refreshToken = await generateRefreshToken(user._id);
        const options = {
            httpOnly: true,
            secure: true
        }
        
       const updateRefreshToken = await User.findByIdAndUpdate(user._id, {
    $set: {
        refreshToken: refreshToken,
        lastActive: Date.now()  
    }
});

        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options).send({
                success: true,
                message: 'New Refresh Token and Access Token generated ',
                user,
                accessToken,
                refreshToken
            })

       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }

});





export const logoutUser = asyncHandler(async (req, res) => {
   try {
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
             message:'User logged out successfully'
     })
   } catch (error) {
         console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
   }
})



export const activity = asyncHandler(async (req, res) => {
    try {
        return res.status(200).send({
            success: true,
            message:'Hello From Server'
        })
        
    } catch (error) {
          console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
})

