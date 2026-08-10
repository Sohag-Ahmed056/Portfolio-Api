import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createApiRouter } from './app/routes/index.js';
import path from 'path';

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
