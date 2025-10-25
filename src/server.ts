import { Prisma, PrismaClient } from "@prisma/client"
import { app } from "./app.js";





const startServer =async()=>{

    const prisma = new PrismaClient();
    await prisma.$connect();

    console.log("Server started and connected to the database.");

    app.listen(5000,()=>{
        console.log("Server is running on http://localhost:5000");
    })
}

startServer();