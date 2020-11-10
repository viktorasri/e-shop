import path from 'path';
import multer from 'multer';

const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const uploadImages = multer({
  dest: 'temp/',
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export { uploadImages };
