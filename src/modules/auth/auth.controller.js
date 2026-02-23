import { Router } from "express";
import * as authService from "./auth.service.js";
import { auth } from "../../middleware/isAuthenticated.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { fileUpload } from "../../utils/multer/index.js";
import { fileValidation } from "../../middleware/file.validation.js";
import { fileUploadCloud } from "../../utils/multer/multer.cloud.js";

const router = Router();
router.post("/register" , isValid(registerSchema) ,  authService.register)
router.post("/login" , auth , authService.login)
router.post("/verfiyAccount" , authService.verfiyAccount)
router.post("/resendOtp" , authService.resendOtp)
router.delete("/:id" , auth , authService.deleteUser)
router.post("/upload-photo" , fileUpload().single("profile-pic") ,fileValidation(), asyncHandler(authService.uploadProfilePicture))
router.post("/upload-photo-cloud" ,auth, fileUploadCloud().single("pic") , authService.uploadProfilePictureCloud)


export  default router