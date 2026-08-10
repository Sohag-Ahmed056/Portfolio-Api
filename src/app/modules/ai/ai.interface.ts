export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface IChatRequest {
  message: string;
  history?: IChatMessage[];
}

export interface IKnowledgeChunk {
  id: string;
  documentId: string;
  title: string;
  originalFileName: string;
  chunkIndex: number;
  content: string;
  uploadedAt: Date;
}

export type IntentType =
  | 'text'
  | 'project'
  | 'skills'
  | 'experience'
  | 'education'
  | 'contact'
  | 'certificate'
  | 'resume'
  | 'timeline'
  | 'links'
  | 'multiple';

export interface IStructuredResponse {
  success: boolean;
  type: IntentType;
  answer: string;
  data: Record<string, any>;
}
