import { Router } from "express";
import * as authService from "./auth.service.js";
import { auth } from "../../middleware/auth.js";

const router = Router();
router.post("/register" , authService.register)
router.post("/login" , authService.login)
router.post("/verfiyAccount" , authService.verfiyAccount)
router.post("/resendOtp" , authService.resendOtp)
router.delete("/:id" , auth , authService.deleteUser)


export  default router