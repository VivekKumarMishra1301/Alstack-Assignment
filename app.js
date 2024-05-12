import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import session from 'express-session'
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from './routes/authRoutes.js'

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cookieParser());



app.use('/api/v1/auth', authRoutes);

export { app }