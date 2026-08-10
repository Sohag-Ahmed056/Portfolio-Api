import { Router } from 'express';
import { AiController } from './ai.controller.js';
import { uploadMiddleware } from '../../middlewares/upload.middleware.js';
import { verifyJWT, isAdmin } from '../../middlewares/auth.middleware.js';
import { chatRateLimiter } from '../../middlewares/rateLimit.middleware.js';

export const aiRoute = Router();

// Upload PDF endpoint (Admin only)
aiRoute.post(
  '/upload',
  verifyJWT,
  isAdmin,
  uploadMiddleware.single('pdf'),
  AiController.uploadKnowledge
);

// Chat endpoint (Public, but rate-limited)
aiRoute.post('/chat', chatRateLimiter, AiController.chat);

// Get uploaded documents (Admin only)
aiRoute.get('/knowledge', verifyJWT, isAdmin, AiController.listKnowledge);

// Delete document (Admin only)
aiRoute.delete('/knowledge/:documentId', verifyJWT, isAdmin, AiController.deleteKnowledge);
