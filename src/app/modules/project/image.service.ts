import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { prisma } from '../../shared/prisma.js';
import ApiError from '../../errors/ApiError.js';

const uploadImage = async (file: Express.Multer.File) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const name = path.basename(file.originalname, path.extname(file.originalname))
    .replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 100) || 'image';

  try {
    return await prisma.uploadedImage.create({
      data: {
        filename: `project-${name}-${randomUUID()}${extension}`,
        mimeType: file.mimetype === 'image/jpg' ? 'image/jpeg' : file.mimetype,
        data: new Uint8Array(file.buffer),
      },
      select: { id: true, filename: true },
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2021') {
      throw new ApiError(503, 'Image storage is not ready. Apply the database migration before uploading images.');
    }
    throw error;
  }
};

const getImage = async (id: string) => {
  const image = await prisma.uploadedImage.findUnique({ where: { id } });
  if (!image) throw new ApiError(404, 'Image not found');
  return image;
};

export const ImageService = { uploadImage, getImage };
