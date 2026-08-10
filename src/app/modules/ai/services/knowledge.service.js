import { prisma } from '../../../shared/prisma.js';
export class KnowledgeService {
    /**
     * Save multiple chunks to the database
     */
    static async saveChunks(documentId, title, originalFileName, chunks) {
        const data = chunks.map((content, index) => ({
            documentId,
            title,
            originalFileName,
            chunkIndex: index,
            content,
        }));
        await prisma.knowledge.createMany({
            data,
        });
    }
    /**
     * Fetch all unique documents uploaded
     */
    static async listDocuments() {
        // We can group by documentId to get unique documents
        const documents = await prisma.knowledge.groupBy({
            by: ['documentId', 'title', 'originalFileName'],
            _min: {
                uploadedAt: true,
            },
            _count: {
                id: true, // Count chunks
            }
        });
        return documents.map((doc) => ({
            documentId: doc.documentId,
            title: doc.title,
            originalFileName: doc.originalFileName,
            uploadedAt: doc._min.uploadedAt,
            chunkCount: doc._count.id
        }));
    }
    /**
     * Delete a document by its ID
     */
    static async deleteDocument(documentId) {
        await prisma.knowledge.deleteMany({
            where: {
                documentId,
            },
        });
    }
    /**
     * Fetch all knowledge chunks for retrieval scoring
     */
    static async getAllChunks() {
        return await prisma.knowledge.findMany();
    }
}
//# sourceMappingURL=knowledge.service.js.map