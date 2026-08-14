import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createApiRouter } from './app/routes/index.js';
import path from 'path';
// Polyfills for browser globals required by pdfjs-dist on Node.js / Vercel Serverless Function
if (typeof globalThis.DOMMatrix === 'undefined') {
    globalThis.DOMMatrix = class DOMMatrix {
        a = 1;
        b = 0;
        c = 0;
        d = 1;
        e = 0;
        f = 0;
        constructor() { }
    };
}
if (typeof globalThis.ImageData === 'undefined') {
    globalThis.ImageData = class ImageData {
    };
}
if (typeof globalThis.Path2D === 'undefined') {
    globalThis.Path2D = class Path2D {
    };
}
export const app = express();
// Increase Express body parser limit to 50mb for large uploads / base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://sohag-dev.vercel.app',
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
}));
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/v1', createApiRouter());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
//# sourceMappingURL=app.js.map