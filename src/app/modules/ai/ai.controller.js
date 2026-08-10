import { PdfService } from './services/pdf.service.js';
import { KnowledgeService } from './services/knowledge.service.js';
import { RetrievalService } from './services/retrieval.service.js';
import { GeminiService } from './services/gemini.service.js';
import { IntentService } from './services/intent.service.js';
import { prisma } from '../../shared/prisma.js';
export class AiController {
    /**
     * Upload PDF, extract text, chunk, and save to database
     */
    static async uploadKnowledge(req, res) {
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
        }
        catch (error) {
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
    static async chat(req, res) {
        try {
            const { message, history } = req.body;
            if (!message) {
                res.status(400).json({ success: false, message: 'Message is required.' });
                return;
            }
            // Retrieve relevant chunks
            const relevantChunks = await RetrievalService.getRelevantChunks(message);
            // Detect intent
            const intent = IntentService.detectIntent(message);
            // Fetch structured data based on intent
            let data = {};
            if (intent !== 'text') {
                const activeResume = await prisma.resume.findFirst({
                    orderBy: { createdAt: 'desc' },
                });
                if (intent === 'project' || intent === 'multiple') {
                    const projects = await prisma.project.findMany({
                        orderBy: { createdAt: 'desc' },
                    });
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
            const answer = await GeminiService.askQuestion(message, relevantChunks, history);
            const responsePayload = {
                success: true,
                type: intent,
                answer,
                data,
            };
            res.status(200).json(responsePayload);
        }
        catch (error) {
            console.error('Chat Error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred during chat.',
            });
        }
    }
    /**
     * List all uploaded knowledge documents
     */
    static async listKnowledge(req, res) {
        try {
            const documents = await KnowledgeService.listDocuments();
            res.status(200).json({
                success: true,
                data: documents,
            });
        }
        catch (error) {
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
    static async deleteKnowledge(req, res) {
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
        }
        catch (error) {
            console.error('Delete Knowledge Error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete knowledge.',
            });
        }
    }
}
//# sourceMappingURL=ai.controller.js.map