import jwt from 'jsonwebtoken'
export const generateToken = (id) => {
     return jwt.sign({ id }, process.env.FORGOT_PASSWORD_TOKEN_KEY, {
        expiresIn:process.env.FORGOT_PASSWORD_TOKEN_EXPIRY
    }) 
}



export const generateAccessToken = (id, email, username) => {
    return jwt.sign({ id, email, username }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}




export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}




