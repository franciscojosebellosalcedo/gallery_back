import {Router} from "express";
import { uploadImage } from "../controllers/imageController.js";

const imageRouter=Router();

imageRouter.post("/api/create-image",uploadImage);


export default imageRouter;