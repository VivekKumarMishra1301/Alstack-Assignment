import bcrypt from "bcrypt"
import asyncHandler from 'express-async-handler';

export const encryptPassword = asyncHandler(async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error)
    }
});


export const comparePassword = async (password,hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log(error)
    }
}
