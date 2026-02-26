import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import fs from "fs";
export function bootstrap(app, express) {
  connectDB();
  app.use(express.json());
  app.use("/auth", authRouter);

  app.use((err, req, res, next) => {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

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
