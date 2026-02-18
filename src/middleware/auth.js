import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.Headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({ message:error.message });
  }
};
