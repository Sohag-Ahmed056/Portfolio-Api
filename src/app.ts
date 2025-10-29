
import express from 'express';

import cors from 'cors';
import cookieParser from "cookie-parser";
import { createApiRouter } from './app/routes/index.js';

export const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true,
}));


// app.use("/generated", express.static(path.join(process.cwd(), "generated")));

// app.use('/api/v1/companies', companyRouter )
// app.use('/api/v1/job', jobRouter)
// app.use('/api/v1/applicants', applicantRoutes)

app.use('/api/v1', createApiRouter());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

