import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./public/images",

  filename: (req, file, cb) => {
    const uniqueName =
      file.fieldname +
      "-" +
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extension = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    if (
      allowedTypes.test(extension) &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export default upload;