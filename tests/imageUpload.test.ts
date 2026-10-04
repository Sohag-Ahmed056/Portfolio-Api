import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import type { UploadedImage } from '@prisma/client';
import { app } from '../src/app.js';
import { prisma } from '../src/app/shared/prisma.js';

// Exercise the actual multipart parser and HTTP routes without changing a real database.
const images = new Map<string, UploadedImage>();
const originalCreate = prisma.uploadedImage.create;
const originalFind = prisma.uploadedImage.findUnique;
let server: Server;
let baseUrl: string;
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1cAAAAASUVORK5CYII=', 'base64');

before(async () => {
  prisma.uploadedImage.create = (async ({ data }: { data: Omit<UploadedImage, 'id' | 'createdAt'> }) => {
    const image = { ...data, id: `image-${images.size}`, createdAt: new Date() };
    images.set(image.id, image);
    return { id: image.id, filename: image.filename };
  }) as unknown as typeof originalCreate;
  prisma.uploadedImage.findUnique = (async ({ where }: { where: { id: string } }) =>
    images.get(where.id) ?? null) as unknown as typeof originalFind;
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address();
  assert(address && typeof address === 'object');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  prisma.uploadedImage.create = originalCreate;
  prisma.uploadedImage.findUnique = originalFind;
  if (server?.listening) await new Promise<void>(resolve => server.close(() => resolve()));
  await prisma.$disconnect();
});

async function upload(data: Uint8Array, type = 'image/png', field = 'image') {
  const form = new FormData();
  form.append(field, new Blob([new Uint8Array(data)], { type }), 'Example image.png');
  return fetch(`${baseUrl}/api/v1/project/upload-image`, { method: 'POST', body: form });
}

test('uploads to PostgreSQL and serves the same image bytes at the returned URL', async () => {
  const response = await upload(png);
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.success, true);
  assert.match(result.data.filename, /^project-example-image-/);
  assert.equal(result.data.url, `${baseUrl}${result.data.path}`);
  const image = await fetch(result.data.url);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.match(image.headers.get('cache-control') ?? '', /immutable/);
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png);
});

test('returns JSON for a missing image', async () => {
  const response = await fetch(`${baseUrl}/api/v1/project/upload-image`, { method: 'POST', body: new FormData() });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, 'No image file provided');
});

test('rejects invalid file types before saving', async () => {
  const count = images.size;
  const response = await upload(png, 'text/plain');
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /Only image files/);
  assert.equal(images.size, count);
});

test('explains an incorrect multipart field name', async () => {
  const response = await upload(png, 'image/png', 'file');
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /field "image"/);
});

test('rejects images over 4 MB without saving them', async () => {
  const count = images.size;
  const response = await upload(new Uint8Array(4 * 1024 * 1024 + 1));
  assert.equal(response.status, 413);
  assert.match((await response.json()).message, /4 MB/);
  assert.equal(images.size, count);
});

test('returns 404 for a missing stored image', async () => {
  const response = await fetch(`${baseUrl}/api/v1/project/images/missing`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).message, 'Image not found');
});

test('explains a missing database migration', async () => {
  const create = prisma.uploadedImage.create;
  prisma.uploadedImage.create = (async () => { throw { code: 'P2021' }; }) as typeof create;
  try {
    const response = await upload(png);
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /database migration/);
  } finally {
    prisma.uploadedImage.create = create;
  }
});

test('returns HTTPS image URLs on Vercel and exports the Express handler', async () => {
  const previousVercel = process.env.VERCEL;
  process.env.VERCEL = '1';
  try {
    const response = await upload(png);
    assert.equal(response.status, 200);
    assert.match((await response.json()).data.url, /^https:\/\//);
    assert.equal((await import('../src/server.js')).default, app);
  } finally {
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
  }
});
