const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";

    // if uploads folder not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // open a new folder
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (!file) return cb();
  if (mimetype && extname) return cb(null, true);

  cb("Error: The format is not authorized", false);
};

const upload = multer({
  storage,
  limits: { filseSize: 1024 * 1024 * 2 },
  fileFilter,
});

function mapUrlImage(images) {
  if (!images) return;
  if (typeof images.path === "string") return images.path.replace("\\", "/");

  let newImages = images.map((image) => image.path.replace("\\", "/"));
  return newImages;
}

module.exports = { upload, mapUrlImage };
