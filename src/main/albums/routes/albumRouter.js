import {  Router} from "express";
import { authorizationToken } from "../../../middlewares/authorizationToken.js";
import { createAlbum, getAllAlbumByIdUser } from "../controllers/albumController.js";

const albumRouter=Router();

albumRouter.post("/api/create-album",authorizationToken,createAlbum);
albumRouter.get("/api/get-all-album/:id_user",authorizationToken,getAllAlbumByIdUser);

export default albumRouter;