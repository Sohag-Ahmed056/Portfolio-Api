import {  PrismaClient } from "@prisma/client"
import { app } from "./app.js";





const startServer =async()=>{

    const prisma = new PrismaClient();
    await prisma.$connect();

    console.log("Server started and connected to the database.");

    app.listen(process.env.PORT,()=>{
        console.log("Server is running on http://localhost:5000");
    })
}

// Vercel invokes the exported Express handler; local development starts a listener.
export default app;

if (!process.env.VERCEL) {
    startServer();
}
