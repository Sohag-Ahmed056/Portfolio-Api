import type { Request, Response } from 'express';
import { PdfService } from './services/pdf.service.js';
import { KnowledgeService } from './services/knowledge.service.js';
import { RetrievalService } from './services/retrieval.service.js';
import { GeminiService } from './services/gemini.service.js';
import type { IChatRequest, IStructuredResponse } from './ai.interface.js';
import { IntentService } from './services/intent.service.js';
import { prisma } from '../../shared/prisma.js';
import ApiError from '../../errors/ApiError.js';

export class AiController {
  /**
   * Upload PDF, extract text, chunk, and save to database
   */
  static async uploadKnowledge(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
        return;
      }

      const filePath = req.file.path;
      const originalFileName = req.file.originalname;
      const title = originalFileName.replace('.pdf', '');
      const documentId = `doc_${Date.now()}`;

      // Extract text and delete temp file
      const text = await PdfService.extractTextAndCleanup(filePath);

      // Split into chunks
      const chunks = PdfService.chunkText(text);

      if (chunks.length === 0) {
        res.status(400).json({ success: false, message: 'Could not extract text from PDF.' });
        return;
      }

      // Save chunks to database
      await KnowledgeService.saveChunks(documentId, title, originalFileName, chunks);

      res.status(200).json({
        success: true,
        message: 'Knowledge uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Upload Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred during upload.',
      });
    }
  }

  /**
   * Chat with the AI assistant based on uploaded knowledge
   */
  static async chat(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as IChatRequest | undefined;
      const message = typeof body?.message === 'string' ? body.message.trim() : '';
      const history = body?.history ?? [];

      if (!message) {
        res.status(400).json({ success: false, message: 'Message is required.' });
        return;
      }

      if (!Array.isArray(history) || history.some(item =>
        !item || (item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string')) {
        res.status(400).json({ success: false, message: 'History must contain user or assistant messages with text content.' });
        return;
      }
      const recentHistory = history.filter(item => item.content.trim()).slice(-20);

      // Retrieve relevant chunks
      // Every answer needs current portfolio facts, including summaries and follow-ups.
      const [relevantChunks, activeResume, projects] = await Promise.all([
        RetrievalService.getRelevantChunks(message, recentHistory),
        prisma.resume.findFirst({
          orderBy: { createdAt: 'desc' },
          select: {
            name: true, title: true, email: true, phone: true, github: true,
            skills: true, education: true, projects: true, certifications: true, experience: true,
          },
        }),
        prisma.project.findMany({
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, title: true, slug: true, description: true, technologies: true,
            features: true, challenges: true, thumbnail: true, liveUrl: true, repoUrl: true,
          },
        }),
      ]);

      // Detect intent
      const intent = IntentService.detectIntent(message);

      // Fetch structured data based on intent
      let data: Record<string, any> = {};

      if (intent !== 'text') {
        if (intent === 'project' || intent === 'multiple') {
          data.projects = projects.length > 0 ? projects : activeResume?.projects || [];
        }

        if (intent === 'skills' || intent === 'multiple') {
          data.skills = activeResume?.skills || [];
        }

        if (intent === 'experience' || intent === 'multiple') {
          data.experience = activeResume?.experience || [];
        }

        if (intent === 'education' || intent === 'multiple') {
          data.education = activeResume?.education || [];
        }

        if (intent === 'certificate' || intent === 'multiple') {
          data.certificates = activeResume?.certifications || [];
        }

        if (intent === 'contact') {
          data = {
            email: activeResume?.email || '',
            phone: activeResume?.phone || '',
            github: activeResume?.github || '',
          };
        }

        if (intent === 'resume') {
          data = {
            downloadUrl: '', // To be filled if resume file storage is implemented
            previewImage: '',
          };
        }

        if (intent === 'timeline') {
          data.experience = activeResume?.experience || [];
          data.education = activeResume?.education || [];
        }

        if (intent === 'links') {
          data.github = activeResume?.github || '';
        }
      }

      // Query Gemini
      const portfolioContext = JSON.stringify({
        profile: activeResume,
        projects: projects.length > 0 ? projects : activeResume?.projects || [],
      });
      const answer = await GeminiService.askQuestion(message, relevantChunks, recentHistory, portfolioContext);

      const responsePayload: IStructuredResponse = {
        success: true,
        type: intent,
        answer,
        data,
      };

      res.status(200).json(responsePayload);
    } catch (error: any) {
      console.error('Chat Error:', error);
      res.status(error instanceof ApiError ? error.statusCode : 500).json({
        success: false,
        message: error.message || 'An error occurred during chat.',
      });
    }
  }

  /**
   * List all uploaded knowledge documents
   */
  static async listKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const documents = await KnowledgeService.listDocuments();
      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error: any) {
      console.error('List Knowledge Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve knowledge list.',
      });
    }
  }

  /**
   * Delete a specific knowledge document and its chunks
   */
  static async deleteKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;

      if (!documentId) {
        res.status(400).json({ success: false, message: 'Document ID is required.' });
        return;
      }

      await KnowledgeService.deleteDocument(documentId);

      res.status(200).json({
        success: true,
        message: 'Knowledge deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete Knowledge Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete knowledge.',
      });
    }
  }
}
