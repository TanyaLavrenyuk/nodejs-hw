import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createHttpError(400, 'Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
