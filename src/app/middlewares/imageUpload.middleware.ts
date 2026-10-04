import multer from 'multer';
import type { RequestHandler } from 'express';
import ApiError from '../errors/ApiError.js';

// Configure Multer for Images
export const imageUploadMiddleware = multer({
  // Vercel's application filesystem is read-only. Persist the buffer in PostgreSQL.
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024, // Leave room for multipart headers under Vercel's 4.5MB limit.
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed!'));
    }
  },
});

const receiveImage = imageUploadMiddleware.single('image');

export const uploadProjectImage: RequestHandler = (req, res, next) => {
  receiveImage(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be smaller than 4 MB.'
        : error.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Upload one image using the multipart field "image".'
          : error.message;
      next(new ApiError(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400, message));
      return;
    }
    next(error);
  });
};
