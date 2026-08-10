import type { IKnowledgeChunk } from '../ai.interface.js';
export declare class KnowledgeService {
    /**
     * Save multiple chunks to the database
     */
    static saveChunks(documentId: string, title: string, originalFileName: string, chunks: string[]): Promise<void>;
    /**
     * Fetch all unique documents uploaded
     */
    static listDocuments(): Promise<{
        documentId: any;
        title: any;
        originalFileName: any;
        uploadedAt: any;
        chunkCount: any;
    }[]>;
    /**
     * Delete a document by its ID
     */
    static deleteDocument(documentId: string): Promise<void>;
    /**
     * Fetch all knowledge chunks for retrieval scoring
     */
    static getAllChunks(): Promise<IKnowledgeChunk[]>;
}
//# sourceMappingURL=knowledge.service.d.ts.map