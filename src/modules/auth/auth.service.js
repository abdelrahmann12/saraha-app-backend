import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt, { compareSync } from "bcrypt";
import { sendMail } from "../../utils/email/index.js";
import Joi from "joi";
import { verifyToken } from "../../utils/token/index.js";
import cloudinary from "../../utils/cloud/cloudinary.config.js";
import { User } from "../../models/user.model.js";

export const generateCodeOtp = (length = 6) => {
  let degits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    let randomNum = Math.floor(Math.random() * 10);
    otp += degits[randomNum];
  }
  return otp;
};

export const register = async (req, res, next) => {
  try {
    const { fName, lName, email, pass, dob, phone } = req.body;

    const userExist = await user.findOne({
      $or: [
        {
          $and: [
            { email: { $ne: null } },
            { email: { $exists: true } },
            { email: email },
          ],
        },

        {
          $and: [
            { phone: { $ne: null } },
            { phone: { $exists: true } },
            { phone: phone },
          ],
        },
      ],
    });
    if (userExist) {
      throw new Error("user already exist", { cause: 409 });
    }
    const hashedPassword = bcrypt.hashSync(pass, 10);
    let otp = generateCodeOtp(6);
    if (email) {
      sendMail({
        to: email,
        subject: "verfiy code",
        html: `<p>your verfiy code is ${otp}</p>`,
      });
    }

    const createUser = await user.create({
      firstName: fName,
      lastName: lName,
      email,
      password: hashedPassword,
      dob,
      otp,
      phoneNumber: phone,
      isExpired: Date.now() + 10 * 60 * 1000,
    });
    const safeUser = await user.findById(createUser._id);

    res.status(200).json({
      message: "user created successfuly",
      success: true,
      data: safeUser,
    });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};

export const verfiyAccount = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const userExist = await user.findOne({
      email,
      otp,
      isExpired: { $gt: Date.now() },
    });
    if (!userExist) {
      throw new Error("invalid otp", { cause: 401 });
    }

    userExist.isVerify = true;
    userExist.otp = null;
    userExist.isExpired = null;
    await userExist.save();
    res
      .status(200)
      .json({ message: "account verfied sucessfuly", success: true });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userExist = await user.findOne({ email });
    if (!userExist) {
      throw new Error("user not found", { cause: 404 });
    }
    if (userExist.isVerify) {
      throw new Error("account already verified", { cause: 400 });
    }
    let otp = generateCodeOtp(6);
    sendMail({
      to: email,
      subject: "re-sent otp",
      html: `<h2>your verify code is${otp}</h2>`,
    });
    userExist.isExpired = Date.now() + 15 * 60 * 1000;
    userExist.otp = otp;
    await userExist.save();

    res
      .status(200)
      .json({ message: "otp resended successfuly", success: true });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;

    const userExist = await User.findOne({
        $or: [
          {
            $and: [
              { email: { $ne: null } },
              { email: { $exists: true } },
              { email: email },
            ],
          },
          {
            $and: [
              { phoneNumber: { $ne: null } },
              { phoneNumber: { $exists: true } },
              { phoneNumber: phoneNumber },
            ],
          },
        ],
      })
      .select("+password");

    if (!userExist) {
      throw new Error("invalid email or password", { cause: 401 });
    }

    const match = compareSync(password, userExist.password);
    if (!match) {
      throw new Error("invalid email or password", { cause: 401 });
    }
    const token = jwt.sign(
      { id: userExist._id , email: userExist.email , phoneNumber: userExist.phoneNumber },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res
      .status(200)
      .json({ message: "user login successfuly", success: true, token: token });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    //get data from req
    const { idToken } = req.body;
    //verify id Token
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: "",
    });
    const payload = ticket.getPayload();
    const userId = payload["sub"];
  } catch (error) {}
};
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const userExist = await user.findByIdAndDelete(id);
    if (!userExist) {
      throw new Error("user not Found", { cause: 401 });
    }

    res
      .status(200)
      .json({ message: "user deleted successfuly", success: true });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};

export const uploadProfilePicture = async (req, res, next) => {
  const token = req.headers.authorization;
  const { id } = verifyToken(token);
  const userExist = await User.findByIdAndUpdate(id, {
    profilePic: req.file.path,
  }, {new:true});

  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }

  return res
    .status(200)
    .json({
      message: "profilePic updated successfuly",
      success: true,
      data: userExist,
    });
};


export const uploadProfilePictureCloud = async (req , res ,next)=>{
  const user = req.user ;
  console.log(user);
  const {secure_url , public_id} = await cloudinary.uploader.upload(
    req.file.path
  );
  const userExist = await User.updateOne({_id:req.user.id} , {profilePic:{secure_url , public_id}});
  if(!userExist){
    res.status(400).json({message:"user not found" , success:false});
  }
  res.status(200).json({message:"photo updated successfuly" , success:true})
}