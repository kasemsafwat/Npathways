import multer from "multer";
import path from "path";

let userStorge = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

export let userUpload = multer({
  storage: userStorge,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG files are allowed."));
    }
  },
});
