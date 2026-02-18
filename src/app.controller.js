import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";

export function bootstrap(app , express){
    connectDB();
    app.use(express.json());
    app.use("/auth" , authRouter)
}

