import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const authorizationToken = (req, res, next) => {
  try {
    const data = req.headers;
    const parts = data.authorization.split(" ");
    if (parts[0] !== "bearer") {
      return res.status(401).json({
        code:401,
        response: false,
        message: "NO autorizado",
      });
    }
    const verify = jwt.verify(parts[1], process.env.SECRET_JWT);
    if (!verify) {
      return res.status(401).json({
        code:401,
        response: false,
        message: "NO autorizado",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code:401,
      response: false,
      message: "NO autorizado",
    });
  }
};
