import express from "express";
import { sequelize } from "./config/db.js";

import "./main/imagens/model/imageModel.js";
import "./main/imagens/model/partImageModel.js";
import "./main/users/model/userModel.js";
import "./main/auth/model/authModel.js";
import "./main/albums/model/albumModel.js";
import "./main/token/model/tokenModel.js";


import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./main/users/routes/userRouter.js";
import authRouter from "./main/auth/routes/authRouter.js";
import imageRouter from "./main/imagens/routes/imageRouter.js";
import albumRouter from "./main/albums/routes/albumRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({limit:"30000mb"}));
// //ROUTERS APP
app.use(userRouter);
app.use(authRouter);
app.use(imageRouter);
app.use(albumRouter);

app.get("/",(req,res)=>{
  res.send("bienvenido a mi aplicacion")
})

async function main() {
  try {
    await sequelize.sync();
    console.log("Conexion exitosa")
    app.listen(process.env.PORT_SERVER || 4100, () => {
      console.log("servidor corriendo en el puerto " + process.env.PORT_SERVER);
    });
  } catch (error) {
    console.log(error.message);
  }
}
main();
