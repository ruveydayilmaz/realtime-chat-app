const multer = require("multer");

exports.uploadMedia = (name) => (req, res, next) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.includes("image")) {
        cb(null, true);
      } else {
        return cb(null, false, new Error("Something went wrong while fetching the file"));
      }
    },
  }).single(name);

  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    return next();
  });
};

