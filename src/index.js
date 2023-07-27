import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./main/users/routes/userRouter.js";
import authRouter from "./main/auth/routes/authRouter.js";

dotenv.config();


const app=express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
//ROUTERS APP
app.use(userRouter);
app.use(authRouter);



app.listen(process.env.PORT_SERVER || 4100,()=>{
    console.log("servidor corriendo en el puerto "+process.env.PORT_SERVER);
});