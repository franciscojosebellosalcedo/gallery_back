import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Token } from "../model/tokenModel.js";
dotenv.config();

export async function findRefressTokenById(id) {
  try {
    const responseFindTokenById = await Token.findOne({
      where: {
        id: id,
      },
    });
    if (!responseFindTokenById) {
      return null;
    }
    return responseFindTokenById;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function findRefressTokenByToken(token) {
  try {
    const responseFindTokenByToken = await Token.findOne({
      where: {
        refress_token: token,
      },
    });
    if (!responseFindTokenByToken) {
      return null;
    }
    return responseFindTokenByToken;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function insertRefressToken(payload, idAuth) {
  try {
    if (!payload) {
      return null;
    }
    const token = jwt.sign(
      {
        id: payload.id,
        name: payload.name,
        created_at: payload.created_at,
        status: payload.status,
      },
      process.env.SECRET_REFRESS_JWT
    );
    if (!token) {
      return null;
    }
    const responseCreatedToken = await Token.create({
      refress_token: token,
      id_auth: idAuth,
    });
    if (responseCreatedToken) {
      const resultFind = await findRefressTokenById(responseCreatedToken.id);
      if (!resultFind) {
        return null;
      }
      return resultFind;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
