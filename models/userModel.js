import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    username: {
        type: String,
        required: true,
        // unique:true
    },
   
    email: {
        type: String,
        required: true,
        // unique:true 
    },
    password: {
        type: String,
        required: true
    },

   

    profilePic: {
        type: String,
        required: true,
      default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
   
    refreshToken: {
        type:String
    },
    lastActive: {
        type: Date,
        default:Date.now()
    }

},{timestamps:true});

export default mongoose.model('Users', userSchema);