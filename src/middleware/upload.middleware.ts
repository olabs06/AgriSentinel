import multer from 'multer';
import { Request } from 'express';
import { ValidationError } from '../utils/errors';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new ValidationError('Only image files are allowed'));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});
