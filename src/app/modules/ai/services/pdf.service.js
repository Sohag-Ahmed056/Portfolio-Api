import fs from 'fs-extra';
// @ts-ignore
import * as pdfParseModule from 'pdf-parse';
const pdfParse = pdfParseModule.default || pdfParseModule;
import { aiConfig } from '../../../../config/ai.config.js';
export class PdfService {
    /**
     * Extract text from a PDF file and delete the file.
     */
    static async extractTextAndCleanup(filePath) {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdfParse(dataBuffer);
            await fs.remove(filePath); // clean up
            return data.text;
        }
        catch (error) {
            await fs.remove(filePath); // clean up on error as well
            throw new Error('Failed to parse PDF file');
        }
    }
    /**
     * Split extracted text into overlapping chunks
     */
    static chunkText(text) {
        const maxChunkSize = aiConfig.maxChunkSize;
        const overlap = 200;
        // Normalize whitespace
        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (!cleanText)
            return [];
        const chunks = [];
        let i = 0;
        while (i < cleanText.length) {
            const end = Math.min(i + maxChunkSize, cleanText.length);
            const chunk = cleanText.slice(i, end);
            if (chunk.trim().length > 0) {
                chunks.push(chunk.trim());
            }
            // Move forward, but account for overlap
            i += (maxChunkSize - overlap);
            // Prevent infinite loop if something goes wrong
            if (maxChunkSize - overlap <= 0)
                break;
        }
        return chunks;
    }
}
//# sourceMappingURL=pdf.service.js.map