const multer = require("multer");
const path = require("path");

const TMP_DIR = path.join(__dirname, "../", "tmp");

const multerCfg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TMP_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const awatarUpload = multer({
  storage: multerCfg,
});

module.exports = awatarUpload;
