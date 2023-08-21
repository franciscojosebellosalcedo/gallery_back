import {  Router} from "express";
import { createAlbum } from "../controllers/albumController.js";

const albumRouter=Router();

albumRouter.post("api/create-album",createAlbum);
export default albumRouter;