import {
  createAuth,
  findAuthUserById,
} from "../../auth/controllers/authController.js";
import { pool } from "../../../config/db.js";
import dotenv from "dotenv";
import {
  validationEmail,
  validationPassword,
} from "../../../utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmailUser } from "../../../config/mailer.js";
import { templateConfirmAccont } from "../../../utils/templatesSendEmail.js";

dotenv.config();


export async function createUser(req, res) {
  try {
    const responseValidationData = validateData(req.body);
    if (responseValidationData.response === false) {
      return res
        .status(responseValidationData.code)
        .json({ ...responseValidationData });
    }
    const sqlFindRegister = "select * from auth where email= ?";
    const [resul] = await pool.query(sqlFindRegister, [req.body.email]);
    if (resul.length === 0) {
      const sqlInsertNewUser =
        "insert into  users (name,lastname,phone,sexo) values (?,?,?,?)";
      const [resulInsertUser] = await pool.query(sqlInsertNewUser, [
        req.body.name,
        req.body.lastname,
        req.body.phone,
        req.body.sexo,
      ]);
      if (resulInsertUser.affectedRows > 0) {
        const id_user = resulInsertUser.insertId;
        const password = await bcrypt.hash(req.body.password, 8);
        const email = req.body.email;
        const userFound = await findUserById(id_user);
        const token_confirmed = jwt.sign(
          { ...userFound },
          process.env.SECRET_JWT,
          { algorithm: "HS256" }
        );

        const dataAuth = { password, id_user, email, token_confirmed };
        const responseInsertAuth = await createAuth(dataAuth);
        if (responseInsertAuth.affectedRows > 0) {
          const authFound = await findAuthUserById(responseInsertAuth.insertId);
          const dataSendEmail = {
            link: "#",
            name: userFound.name,
            lastname: userFound.lastname,
          };

          await sendEmailUser(
            authFound.email,
            "Confirmación de cuenta",
            "",
            templateConfirmAccont(dataSendEmail)
          );
          return res.status(201).json({
            code: 201,
            message: "Usuario creado exitosamente.",
            response: true,
          });
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
    const sqlFindUser = "select * from users where id=?";
    const [result] = await pool.query(sqlFindUser, [idUser]);
    if (!result[0]) {
      return null;
    }
    return result[0];
  } catch (error) {
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
  } else if (!body.lastname || body.lastname === "" || body.lastname === null) {
    return {
      code: 400,
      message: "Ingrese su apellido por favor.",
      response: false,
    };
  } else if (!body.phone || body.phone === "" || body.phone === null) {
    return {
      code: 400,
      message: "Ingrese su número de teléfono por favor.",
      response: false,
    };
  } else if (!body.sexo || body.sexo === "" || body.sexo === null) {
    return {
      code: 400,
      message: "Seleccione su sexo por favor.",
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
