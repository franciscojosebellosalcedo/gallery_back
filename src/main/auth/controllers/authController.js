import jwt from "jsonwebtoken";
import { pool } from "../../../config/db.js";
import { findUserById } from "../../users/controllers/userController.js";
import dotenv from "dotenv";

dotenv.config();

export async function createAuth(payload) {
  try {
    const sqlInsertAuth =
      "insert into auth (id_user,token_confirmed,email,password) values (?,?,?,?)";
    const [resultInsertAuth] = await pool.query(sqlInsertAuth, [
      payload.id_user,
      payload.token_confirmed,
      payload.email,
      payload.password,
    ]);
    return resultInsertAuth;
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
        message: "Recurso no encontrado.",
        response: false,
      });
    }
    const authFoundConfirm = await findAuthUserByIdUser(verifiToken.id);
    if (authFoundConfirm) {
      const userFound = await findUserById(verifiToken.id);
      if (authFoundConfirm.isConfirmed > 0) {
        return res.status(200).json({
          code: 200,
          message: `${userFound.name} tu cuenta ya fue confirmada.`,
          response: false,
        });
      }
    }
    const authFound = await findAuthUserByTokenConfirm(req.params.token);
    if (!authFound) {
      return res.status(404).json({
        code: 404,
        message: "Recurso no encontrado.",
        response: false,
      });
    }
    const responseUpdateDataConfirmed=await  updateIsConfirmedInAuth(authFound.id);
    if(responseUpdateDataConfirmed===false){
      return res.status(400).json({
        code: 400,
        message: "Su cuenta no se pudo confirmar correctamente.",
        response: false,
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Tu cuenta ha sido confirmada correctamente.",
      response: true,
    });
  } catch (error) {
    return res.status(404).json({
      code: 404,
      message: "Recurso no encontrado.",
      response: false,
    });
  }
}

async function updateIsConfirmedInAuth(idAuth) {
  try {
    const sqlUpdateIsConfirmed=`update auth set isConfirmed=${1}, token_confirmed=""  where id=?`;
    const [result]=await pool.query(sqlUpdateIsConfirmed,[idAuth]);
    if(result.affectedRows>0){
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findAuthUserByTokenConfirm(tokenConfirm) {
  try {
    const sqlFindAuthUser = "select * from auth where token_confirmed=?";
    const [result] = await pool.query(sqlFindAuthUser, [tokenConfirm]);
    if (!result[0]) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findAuthUserByIdUser(idUser) {
  try {
    const sqlFindAuthUser = "select * from auth where id_user=?";
    const [result] = await pool.query(sqlFindAuthUser, [idUser]);
    if (!result[0]) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function findAuthUserById(idAuth) {
  try {
    const sqlFindAuthUser = "select * from auth where id=?";
    const [result] = await pool.query(sqlFindAuthUser, [idAuth]);
    if (!result[0]) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
