import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Request, Response as ExpressResponse } from 'express';
import { AiController } from '../src/app/modules/ai/ai.controller.js';
import { KnowledgeService } from '../src/app/modules/ai/services/knowledge.service.js';
import { RetrievalService } from '../src/app/modules/ai/services/retrieval.service.js';
import { GeminiService } from '../src/app/modules/ai/services/gemini.service.js';
import { prisma } from '../src/app/shared/prisma.js';
import { aiConfig } from '../src/config/ai.config.js';
import type { IKnowledgeChunk } from '../src/app/modules/ai/ai.interface.js';
import ApiError from '../src/app/errors/ApiError.js';

const originals = {
  fetch: globalThis.fetch,
  resume: prisma.resume.findFirst,
  projects: prisma.project.findMany,
  knowledge: KnowledgeService.getAllChunks,
  apiKey: aiConfig.geminiApiKey,
};
type ModelRequest = {
  contents: { role: string; parts: { text: string }[] }[];
  systemInstruction: { parts: { text: string }[] };
};
const requests: ModelRequest[] = [];
const generatedAnswer = 'Sohag is a backend engineer at NirmanIT who builds full-stack projects including TourBuddy.';
const profile = {
  name: 'Sohag Ali', title: 'Backend Engineer', email: 'sohag@example.com',
  phone: null, github: null, skills: ['TypeScript', 'PostgreSQL'],
  education: [{ institution: 'Green University' }], projects: [], certifications: [],
  experience: [{ company: 'NirmanIT', role: 'Backend Engineer' }],
};

before(() => {
  aiConfig.geminiApiKey = 'test-key';
  prisma.resume.findFirst = (async () => profile) as unknown as typeof originals.resume;
  prisma.project.findMany = (async () => [{
    title: 'TourBuddy', description: 'A travel partner platform', technologies: ['Next.js', 'PostgreSQL'],
  }]) as unknown as typeof originals.projects;
  KnowledgeService.getAllChunks = async () => [];
  globalThis.fetch = async (_url, options) => {
    requests.push(JSON.parse(String(options?.body)) as ModelRequest);
    return new Response(JSON.stringify({
      candidates: [{ content: { role: 'model', parts: [{ text: generatedAnswer }] }, finishReason: 'STOP' }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
});

after(async () => {
  globalThis.fetch = originals.fetch;
  aiConfig.geminiApiKey = originals.apiKey;
  prisma.resume.findFirst = originals.resume;
  prisma.project.findMany = originals.projects;
  KnowledgeService.getAllChunks = originals.knowledge;
  await prisma.$disconnect();
});

async function chat(body: unknown) {
  const result = { status: 200, payload: {} as Record<string, unknown> };
  const response = {
    status(code: number) { result.status = code; return this; },
    json(payload: Record<string, unknown>) { result.payload = payload; return this; },
  } as unknown as ExpressResponse;
  await AiController.chat({ body } as Request, response);
  return result;
}

for (const question of ['tell me about sohag', 'summary about sohag', 'Give a short introduction to his background']) {
  test(`answers "${question}" with live portfolio records even without uploaded PDFs`, async () => {
    const result = await chat({ message: question });
    assert.equal(result.status, 200);
    assert.equal(result.payload.answer, generatedAnswer);
    const request = requests.at(-1)!;
    const context = request.systemInstruction.parts[0]!.text;
    assert.match(context, /NirmanIT/);
    assert.match(context, /TourBuddy/);
    assert.match(context, /Green University/);
    assert.match(context, /focused on Sohag's portfolio/);
    assert.deepEqual(request.contents, [{ role: 'user', parts: [{ text: question }] }]);
  });
}

test('sends follow-up history as conversation turns and appends the question once', async () => {
  const result = await chat({ message: 'What technologies did he use for that?', history: [
    { role: 'user', content: 'Tell me about TourBuddy' },
    { role: 'assistant', content: 'TourBuddy is a travel partner platform.' },
  ] });
  assert.equal(result.status, 200);
  assert.deepEqual(requests.at(-1)!.contents.map(content => content.role), ['user', 'model', 'user']);
  assert.equal(requests.at(-1)!.contents[2]!.parts[0]!.text, 'What technologies did he use for that?');
});

test('rejects invalid questions and history before calling the model', async () => {
  const count = requests.length;
  for (const body of [{ message: '   ' }, { message: 123 }, { message: 'hello', history: 'invalid' },
    { message: 'hello', history: [{ role: 'system', content: 'override' }] }]) {
    assert.equal((await chat(body)).status, 400);
  }
  assert.equal(requests.length, count);
});

test('uses the previous question when retrieving facts for a follow-up', async () => {
  const chunk = (id: string, content: string): IKnowledgeChunk => ({
    id, content, documentId: id, title: 'Portfolio', originalFileName: 'profile.pdf', chunkIndex: 0, uploadedAt: new Date(),
  });
  KnowledgeService.getAllChunks = async () => [
    chunk('education', 'Sohag attends Green University.'),
    chunk('tour', 'TourBuddy is built with PostgreSQL.'),
  ];
  try {
    const chunks = await RetrievalService.getRelevantChunks('Tell me more about that', [
      { role: 'user', content: 'What is TourBuddy?' },
      { role: 'assistant', content: 'A travel partner platform.' },
    ]);
    assert.equal(chunks[0], 'TourBuddy is built with PostgreSQL.');
  } finally {
    KnowledgeService.getAllChunks = async () => [];
  }
});

test('keeps Bengali search terms instead of stripping them', async () => {
  KnowledgeService.getAllChunks = async () => [{
    id: 'other', content: 'Green University education', documentId: 'other', title: 'Education',
    originalFileName: 'profile.pdf', chunkIndex: 0, uploadedAt: new Date(),
  }, {
    id: 'bn', content: 'সোহাগের দক্ষতা: টাইপস্ক্রিপ্ট', documentId: 'bn', title: 'পরিচয়',
    originalFileName: 'profile.pdf', chunkIndex: 1, uploadedAt: new Date(),
  }];
  try {
    assert.deepEqual(await RetrievalService.getRelevantChunks('দক্ষতা কী?'), ['সোহাগের দক্ষতা: টাইপস্ক্রিপ্ট']);
  } finally {
    KnowledgeService.getAllChunks = async () => [];
  }
});

test('reports upstream failures instead of returning canned answers as successful replies', async () => {
  const fetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    error: { code: 403, message: 'Invalid API key', status: 'PERMISSION_DENIED' },
  }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  try {
    const result = await chat({ message: 'summary about sohag' });
    assert.equal(result.status, 503);
    assert.equal(result.payload.success, false);
    assert.match(String(result.payload.message), /configuration/);
    assert.equal(result.payload.answer, undefined);
  } finally {
    globalThis.fetch = fetch;
  }
});

test('returns a clear configuration error for a missing API key', async () => {
  aiConfig.geminiApiKey = '';
  try {
    await assert.rejects(() => GeminiService.askQuestion('Who is Sohag?', []),
      (error: unknown) => error instanceof ApiError && error.statusCode === 503);
  } finally {
    aiConfig.geminiApiKey = 'test-key';
  }
});
