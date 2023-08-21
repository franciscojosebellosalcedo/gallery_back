import jwt from "jsonwebtoken";
import { findUserById } from "../../users/controllers/userController.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { findRefressTokenByToken, insertRefressToken } from "../../token/controllers/tokenController.js";
import { getTokenFromHeader } from "../../../utils/getTokenFromHeader.js";
import { getAlbumbyId } from "../../albums/controllers/albumController.js";
import { getOneImageByIdAlbum } from "../../imagens/controllers/imageController.js";
import { Auth } from "../model/authModel.js";

dotenv.config();

export async function refressToken(req,res){
  try {
    const refressTokenHeader=getTokenFromHeader(req.headers);
    if(!refressTokenHeader){
      return res.status(400).json({
        code: 400,
        message: "No autorizado.",
        response: false,
      });
    }
    const responseFoundRefressToken=await findRefressTokenByToken(refressTokenHeader);
    if(!responseFoundRefressToken){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error.",
        response: false,
      });
    }
    const verifyRefressToken=jwt.verify(responseFoundRefressToken.refress_token,process.env.SECRET_REFRESS_JWT);
    if(!verifyRefressToken){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error.",
        response: false,
      });
    }
    const accessTokenNew=jwt.sign({...verifyRefressToken},process.env.SECRET_JWT);
    if(!accessTokenNew){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error.",
        response: false,
      });
    }
    const responseGetAlbum=await getAlbumbyId(verifyRefressToken.id);
    if(!responseGetAlbum){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error en el servidor.",
        response: false,
      });
    }
    const imageBase64=await getOneImageByIdAlbum(responseGetAlbum.id);
    if(imageBase64.length===0){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error en el servidor.",
        response: false,
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Token actualizado.",
      data:{
        user:{...verifyRefressToken,imageBase64},
        accessToken:accessTokenNew
      },
      response: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Se produjo un error en el servidor.",
      response: false,
    });
  }
}

export async function getUserInfo(req,res){
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Se produjo un error en el servidor.",
      response: false,
    });
  }
}

export async function login(req, res) {
  try {
    if (
      !req.body.email ||
      req.body.email === "" ||
      req.body.email === null ||
      req.body.email === undefined
    ) {
      return res.status(400).json({
        code: 400,
        message: "Ingrese su correo.",
        response: false,
      });
    } else if (
      !req.body.password ||
      req.body.password === "" ||
      req.body.password === null ||
      req.body.password === undefined
    ) {
      return res.status(400).json({
        code: 400,
        message: "Ingrese su contraseña.",
        response: false,
      });
    }

    const authFound = await findAuthUserByEmail(req.body.email);
    if (!authFound) {
      return res.status(400).json({
        code: 400,
        message: "Usuario no registrado.",
        response: false,
      });
    }
    const userFound = await findUserById(authFound.id_user);
    if (!userFound) {
      return res.status(400).json({
        code: 400,
        message: "Usuario no registrado.",
        response: false,
      });
    }
    if (authFound.isConfirmed === 0) {
      return res.status(400).json({
        code: 400,
        message: "Por favor confirme su cuenta.",
        response: false,
      });
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      authFound.password
    );
    if (comparePassword === false) {
      return res.status(200).json({
        code: 200,
        message: "Correo o contraseña no válidos.",
        response: false,
      });
    }
    const accessToken = jwt.sign({
      id: userFound.id,
      name: userFound.name,
      created_at: userFound.created_at,
      status: userFound.status,
    }, process.env.SECRET_JWT);
    const responseInsertToken = await insertRefressToken(userFound,authFound.id);
    if (!responseInsertToken) {
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error en el servidor.",
        response: false,
      });
    }
    const responseGetAlbum=await getAlbumbyId(userFound.id);
    if(!responseGetAlbum){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error en el servidor.",
        response: false,
      });
    }
    const imageBase64=await getOneImageByIdAlbum(responseGetAlbum.id);
    if(imageBase64.length===0){
      return res.status(400).json({
        code: 400,
        message: "Se produjo un error en el servidor.",
        response: false,
      });
    }
    const user={name:userFound.name,created_at:userFound.created_at,status:userFound.status,imageBase64};
    return res.status(200).json({
      code: 200,
      message: "Credenciales validas.",
      data: {
        user,
        accessToken,
        refressToken: responseInsertToken.refress_token,
      },
      response: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Se produjo un error en el servidor.",
      response: false,
    });
  }
}

export async function createAuth(payload) {
  try {
    const responseCreatedAuth=await Auth.create({
      id_user:payload.id_user,
      token_confirmed:payload.token_confirmed,
      email:payload.email,
      password:payload.password
    });
    if(!responseCreatedAuth){
      return null;
    }
    return responseCreatedAuth;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function confirmAccontUser(req, res) {
  try {
    const verifiToken = jwt.verify(req.params.token, process.env.SECRET_JWT);
    if (!verifiToken) {
      return res.status(404).json({
        code: 404,
        message: "Error.",
        response: false,
      });
    }
    const authFoundConfirm = await findAuthUserByIdUser(verifiToken.id);
    const userFound = await findUserById(verifiToken.id);
    if (authFoundConfirm) {
      if (authFoundConfirm.isConfirmed > 0) {
        return res.status(200).json({
          code: 200,
          message: `Hola ${userFound.name} tu cuenta ya fue confirmada.`,
          response: false,
        });
      }
    }
    const authFound = await findAuthUserByTokenConfirm(req.params.token);
    if (!authFound) {
      return res.status(404).json({
        code: 404,
        message: "Error.",
        response: false,
      });
    }
    const responseUpdateDataConfirmed = await updateIsConfirmedInAuth(
      authFound.id
    );
    if (responseUpdateDataConfirmed === false) {
      return res.status(400).json({
        code: 400,
        message: `${userFound.name} su cuenta no se pudo confirmar correctamente.`,
        response: false,
      });
    }
    return res.status(200).json({
      code: 200,
      message: `Hola ${userFound.name} tu cuenta ha sido confirmada correctamente.`,
      response: true,
    });
  } catch (error) {
    return res.status(404).json({
      code: 404,
      message: "Error.",
      response: false,
    });
  }
}

async function updateIsConfirmedInAuth(idAuth) {
  try {
    const sqlUpdateIsConfirmed = `update auth set isConfirmed=${1}, token_confirmed=""  where id=?`;
    const [result] = await pool.query(sqlUpdateIsConfirmed, [idAuth]);
    const responseUpdateToken=await Auth.update({
      isConfirmed:1,
      token_confirmed:""
    },{where:{id:idAuth}});
    
    if(!responseUpdateToken){
      return false;
    }
    return responseUpdateToken;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findAuthUserByTokenConfirm(tokenConfirm) {
  try {
    const responseFindAuthByIdTokenConfirmed=await Auth.findOne({
      where:{token_confirmed:tokenConfirm}
    });
    if(!responseFindAuthByIdTokenConfirmed){
      return null;
    }
    return responseFindAuthByIdTokenConfirmed;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findAuthUserByIdUser(idUser) {
  try {
    const responseFindAuthByIdUser=await Auth.findOne({
      where:{id_user:idUser}
    });
    if(!responseFindAuthByIdUser){
      return null;
    }
    return responseFindAuthByIdUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findAuthUserById(idAuth) {
  try {
    const responseFindAuthById=await Auth.findOne({
      where:{id:idAuth}
    });
    if(!responseFindAuthById){
      return null;
    }
    return responseFindAuthById;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findAuthUserByEmail(email) {
  try {
    const responseFindAuthByEmail=await Auth.findOne({
      where:{email:email}
    });
    if(!responseFindAuthByEmail){
      return null;
    }
    return responseFindAuthByEmail;
  } catch (error) {
    console.log(error);
    return null;
  }
}
