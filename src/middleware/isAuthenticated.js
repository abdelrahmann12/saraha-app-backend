import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userExist = await User.findById(decode.id);

    if (userExist.credentialUpdatedAt) {
      const changedTime = parseInt(userExist.credentialUpdatedAt.getTime() / 1000);

      if (changedTime > decode.iat) {
        throw new Error("Token expired due to password change");
      }
    }

    if (!userExist) {
      throw new Error("user not found", { cause: 404 });
    }
    req.user = userExist;

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
