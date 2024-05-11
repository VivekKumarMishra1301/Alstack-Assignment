import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";


const connectDb = async () => {
    try {
        const con = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
             useNewURLParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: true,
        })
        console.log(`DB connected ${con.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}
// singleton

export default connectDb;