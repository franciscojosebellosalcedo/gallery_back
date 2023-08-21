import {  Router} from "express";
import { confirmAccontUser, getUserInfo, login, refressToken } from "../controllers/authController.js";

const authRouter=Router();

authRouter.get("/api/refress-token",refressToken);
authRouter.get("/api/get-user-info",getUserInfo);
authRouter.post("/api/confirm-accont-user/:token",confirmAccontUser);
authRouter.post("/api/login",login);

export default authRouter;