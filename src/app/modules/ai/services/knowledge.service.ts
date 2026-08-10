import { prisma } from '../../../shared/prisma.js';
import type { IKnowledgeChunk } from '../ai.interface.js';

export class KnowledgeService {
  /**
   * Save multiple chunks to the database
   */
  static async saveChunks(
    documentId: string,
    title: string,
    originalFileName: string,
    chunks: string[]
  ): Promise<void> {
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

    return documents.map((doc: any) => ({
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
  static async deleteDocument(documentId: string): Promise<void> {
    await prisma.knowledge.deleteMany({
      where: {
        documentId,
      },
    });
  }

  /**
   * Fetch all knowledge chunks for retrieval scoring
   */
  static async getAllChunks(): Promise<IKnowledgeChunk[]> {
    return await prisma.knowledge.findMany();
  }
}
