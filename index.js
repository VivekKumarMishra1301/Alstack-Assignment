import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db/dbConnect.js';
import { app } from './app.js'
import('./config/third_party_strategies/googleStrategyAuth.js');
import('./config/third_party_strategies/facebookStrategy.js');


const PORT = process.env.PORT || 3000;
const startApp = async () => {
    await connectDb();
    
     app.listen(PORT, () => {
        
        console.log(`Server is listening on port ${PORT}`);
    })
}
startApp();