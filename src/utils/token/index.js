import jwt from "jsonwebtoken"


export const verifyToken = (token) => {
  try {
    
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {

    throw new Error("Invalid or expired token" , {cause:401});
    
  }
};



export const generateToken = (payload, expiresIn = "1h") => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );

  return token;
};