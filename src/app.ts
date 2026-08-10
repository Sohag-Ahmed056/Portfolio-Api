import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createApiRouter } from './app/routes/index.js';
import path from 'path';

// Polyfills for browser globals required by pdfjs-dist on Node.js / Vercel Serverless Function
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  };
}
if (typeof (globalThis as any).ImageData === 'undefined') {
  (globalThis as any).ImageData = class ImageData {};
}
if (typeof (globalThis as any).Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2D {};
}

export const app = express();

// Increase Express body parser limit to 50mb for large uploads / base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
}));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/v1', createApiRouter());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
