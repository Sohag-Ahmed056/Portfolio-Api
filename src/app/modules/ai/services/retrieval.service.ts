import { KnowledgeService } from './knowledge.service.js';
import { aiConfig } from '../../../../config/ai.config.js';
import type { IKnowledgeChunk } from '../ai.interface.js';

export class RetrievalService {
  /**
   * Find the most relevant chunks using simple keyword matching
   */
  static async getRelevantChunks(question: string): Promise<string[]> {
    const chunks = await KnowledgeService.getAllChunks();
    
    if (chunks.length === 0) {
      return [];
    }

    // Extract keywords from the question (basic tokenization)
    const keywords = question
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2); // ignore small words

    if (keywords.length === 0) {
      // Fallback: if question doesn't have good keywords, just return a few random/first chunks
      return chunks.slice(0, aiConfig.maxChunks).map(c => c.content);
    }

    // Score chunks
    const scoredChunks = chunks.map(chunk => {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();

      keywords.forEach(keyword => {
        // Higher weight if keyword is in title
        if (titleLower.includes(keyword)) {
          score += 2;
        }
        
        // Count occurrences in content
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = contentLower.match(regex);
        if (matches) {
          score += matches.length;
        }
      });

      return { chunk, score };
    });

    // Sort by score descending and take top N
    const topChunks = scoredChunks
      .filter(sc => sc.score > 0) // only include chunks with at least 1 match
      .sort((a, b) => b.score - a.score)
      .slice(0, aiConfig.maxChunks)
      .map(sc => sc.chunk.content);

    // If no specific keyword matched, return top initial chunks as general context
    if (topChunks.length === 0) {
      return chunks.slice(0, aiConfig.maxChunks).map(c => c.content);
    }

    return topChunks;
  }
}
