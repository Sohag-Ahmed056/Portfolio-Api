import { KnowledgeService } from './knowledge.service.js';
import { aiConfig } from '../../../../config/ai.config.js';
import type { IChatMessage } from '../ai.interface.js';

export class RetrievalService {
  /**
   * Find the most relevant chunks using simple keyword matching
   */
  static async getRelevantChunks(question: string, history: IChatMessage[] = []): Promise<string[]> {
    const chunks = await KnowledgeService.getAllChunks();
    
    if (chunks.length === 0) {
      return [];
    }

    // Extract keywords from the question (basic tokenization)
    const followUp = /\b(it|that|those|them|these|more|also|his|he)\b|আরও|সেটা|ওটা|তার/u.test(question.toLowerCase());
    const previousQuestion = followUp ? history.findLast(message => message.role === 'user')?.content || '' : '';
    const stopWords = new Set(['the', 'and', 'about', 'tell', 'what', 'does', 'how', 'can', 'you', 'his', 'with', 'that', 'more', 'sohag']);
    const keywords = [...new Set((`${question} ${previousQuestion}`.toLowerCase()
      .match(/[\p{L}\p{M}\p{N}]+/gu) || [])
      .filter(word => word.length > 2 && !stopWords.has(word)))];

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
        score += contentLower.split(keyword).length - 1;
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
