import {
  createAuth,
  findAuthUserByEmail,
  findAuthUserById,
} from "../../auth/controllers/authController.js";
import dotenv from "dotenv";
import {
  validationEmail,
  validationPassword,
} from "../../../utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmailUser } from "../../../config/mailer.js";
import { templateConfirmAccont } from "../../../utils/templatesSendEmail.js";
import { saveAlbum } from "../../albums/controllers/albumController.js";
import { saveImage } from "../../imagens/controllers/imageController.js";
import { User } from "../model/userModel.js";

dotenv.config();

export async function createUser(req, res) {
  try {
    const responseValidationData = validateData(req.body);
    if (responseValidationData.response === false) {
      return res
        .status(responseValidationData.code)
        .json({ ...responseValidationData });
    }
    const responseFindAuth = await findAuthUserByEmail(req.body.email);
    if (!responseFindAuth) {
      const responseCreatedUser = await User.create({
        name: req.body.name,
      });
      if (responseCreatedUser) {
        const id_user = responseCreatedUser.id;
        const password = await bcrypt.hash(req.body.password, 8);
        const email = req.body.email;
        const userFound = await findUserById(id_user);
        const token_confirmed = jwt.sign(
          {
            id: userFound.id,
            name: userFound.name,
            created_at: userFound.created_at,
            status: userFound.status,
          },
          process.env.SECRET_JWT,
          { algorithm: "HS256" }
        );
        const dataAuth = { password, id_user, email, token_confirmed };
        const responseCreatedAuth = await createAuth(dataAuth);
        if (responseCreatedAuth) {
          const dataInsertAlbum = {
            id_user: id_user,
            name: "perfil",
            description: "perfil",
          };
          const responseCreatedAlbum = await saveAlbum(dataInsertAlbum);
          if (responseCreatedAlbum) {
            const dataCreateImage = {
              id_album: responseCreatedAlbum.id,
              type: "avatar usuario",
              string_base: req.body.string_base,
              title: "avatar usuario",
            };
            const responseInsertImage = await saveImage(dataCreateImage);
            if (responseInsertImage === true) {
              const authFound = await findAuthUserById(responseCreatedAuth.id);
              const dataSendEmail = {
                link: `http://localhost:3000/confirmar-cuenta/${authFound.token_confirmed}`,
                name: userFound.name,
              };
              setTimeout(async () => {
                await sendEmailUser(
                  authFound.email,
                  "Confirmación de cuenta",
                  "",
                  templateConfirmAccont(dataSendEmail)
                );
              }, 0);
              return res.status(201).json({
                code: 201,
                message: "Usuario creado exitosamente.",
                response: true,
              });
            }
          }
        } else {
          return res.status(400).json({
            code: 400,
            message: "No se pudo crear el usuario.",
            response: true,
          });
        }
      }
    } else {
      return res.status(203).json({
        code: 203,
        message: "Usuario ya existente.",
        response: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Se produjo un error en el servidor.",
      response: false,
    });
  }
}

export async function findUserById(idUser) {
  try {
    const responseFindUserById = await User.findOne({
      where: { id: idUser },
    });
    if (!responseFindUserById) {
      return null;
    }
    return responseFindUserById;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export function validateData(body) {
  if (!body.email || body.email === "" || body.email === null) {
    return {
      code: 400,
      message: "Ingrese su correo por favor.",
      response: false,
    };
  } else if (validationEmail(body.email) === false) {
    return {
      code: 203,
      message: "El correo ingresado es invalido.",
      response: false,
    };
  } else if (!body.name || body.name === "" || body.name === null) {
    return {
      code: 400,
      message: "Ingrese su nombre por favor.",
      response: false,
    };
  } else if (validationPassword(body.password) === false) {
    return {
      code: 400,
      message:
        "La contraseña debe contener mayásculas, minúsculas, números y con una cantidad de caracteres entre 8 y 16.",
      response: false,
    };
  } else if (!body.password || body.password === "" || body.password === null) {
    return {
      code: 400,
      message:
        "Ingrese una contraseña, debe contener mayásculas, minúsculas, números y con una cantidad de caracteres entre 8 y 16",
      response: false,
    };
  } else if (
    !body.confirm_password ||
    body.confirm_password === "" ||
    body.confirm_password === null
  ) {
    return {
      code: 400,
      message: "Confirme su contraseña por favor.",
      response: false,
    };
  } else if (body.password != body.confirm_password) {
    return {
      code: 400,
      message: "Las contraseñas no coiciden.",
      response: false,
    };
  } else {
    return true;
  }
}
