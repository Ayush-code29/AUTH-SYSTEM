import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";

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
app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is running on localhost port ${process.env.PORT}`)
})
export default app