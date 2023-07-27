import {Router} from "express";
import {createUser } from "../controllers/userController.js";


const userRouter=Router();



userRouter.post("/api/create-user",createUser);

export default userRouter;
