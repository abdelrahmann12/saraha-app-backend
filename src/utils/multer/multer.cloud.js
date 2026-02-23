
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function fileUploadCloud() {
  const storage = diskStorage({
  }); //TEMP

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

  return multer({ storage  , fileFilter}); // new multer
}


