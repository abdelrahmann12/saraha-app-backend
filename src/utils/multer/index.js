import { set } from "mongoose";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function fileUpload() {
  const storage = diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
      if (file == "abblication/pdf") {
        cb(new Error("invalid file format", { cause: 409 }));
      }
      // cb(null ,Date.now() + "-" + file.originalname)
      cb(null , nanoid(5) + "-" + file.originalname)
    },
  });
//   const fileFilter = (req, file, cb) => {
//     if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
//         cb(null , true )
//     }else{
//         new Error("invalid file format", {cause:400});
//     }
    
//   };
  return multer({ storage}); // new multer
}


