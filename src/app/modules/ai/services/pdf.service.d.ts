export declare class PdfService {
    /**
     * Extract text from a PDF file and delete the file.
     */
    static extractTextAndCleanup(filePath: string): Promise<string>;
    /**
     * Split extracted text into overlapping chunks
     */
    static chunkText(text: string): string[];
}
//# sourceMappingURL=pdf.service.d.ts.map