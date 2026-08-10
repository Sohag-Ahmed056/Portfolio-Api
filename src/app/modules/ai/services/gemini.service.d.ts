import type { IChatMessage } from '../ai.interface.js';
export declare class GeminiService {
    /**
     * Ask Gemini a question based on provided knowledge and chat history
     */
    static askQuestion(question: string, knowledgeChunks: string[], history?: IChatMessage[]): Promise<string>;
}
//# sourceMappingURL=gemini.service.d.ts.map