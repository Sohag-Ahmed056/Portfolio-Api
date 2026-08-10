import dotenv from 'dotenv';
dotenv.config();
export const aiConfig = {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    chatModel: process.env.CHAT_MODEL || 'gemini-3.5-flash',
    maxChunks: parseInt(process.env.MAX_CHUNKS || '5', 10),
    maxChunkSize: parseInt(process.env.MAX_CHUNK_SIZE || '1000', 10)
};
//# sourceMappingURL=ai.config.js.map