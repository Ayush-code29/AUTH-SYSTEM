import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";
import router from './routes/user.routes.js';

const app = express()
dotenv.config();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api/auth',router)

export default app