import {  Router} from "express";
import { confirmAccontUser } from "../controllers/authController.js";

const authRouter=Router();

authRouter.post("/api/confirm-accont-user/:token",confirmAccontUser);

export default authRouter;