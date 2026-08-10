import type { Request, Response } from 'express';
export declare class AiController {
    /**
     * Upload PDF, extract text, chunk, and save to database
     */
    static uploadKnowledge(req: Request, res: Response): Promise<void>;
    /**
     * Chat with the AI assistant based on uploaded knowledge
     */
    static chat(req: Request, res: Response): Promise<void>;
    /**
     * List all uploaded knowledge documents
     */
    static listKnowledge(req: Request, res: Response): Promise<void>;
    /**
     * Delete a specific knowledge document and its chunks
     */
    static deleteKnowledge(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map