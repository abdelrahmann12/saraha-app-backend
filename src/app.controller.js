import rateLimit from "express-rate-limit";
import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import fs from "fs";


export function bootstrap(app, express) {
  const limter = rateLimit({
    windowMs:10 * 60 * 1000 ,
    limit:3,
    handler:(req , res , next , options)=>{
      throw new Error(" too many requests try again later " , {cause:options.statusCode})
    },
    legacyHeaders:false, // hide header details

  })
  app.use(limter)
  connectDB();
  app.use(express.json());
  app.use("/auth", authRouter);

  app.use((err, req, res, next) => {

    // if (req.file) {
    //   fs.unlinkSync(req.file.path);
    // }

    if(err = "No token provided"){
       
    }
    res
      .status(err.cause || 500)
      .json({
        message: err.message,
        success: false,
        globalErrorHandler: true,
        stack: err.stack,
      });
  });
}
