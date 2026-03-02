
import { Router } from "express";
import { fileUploadCloud } from "../../utils/multer/multer.cloud.js";
const router = Router();

router.post("/:reciver" , fileUploadCloud().array("attachments" , 2) ) //multer middleware first >> 