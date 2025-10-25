import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma.js";



const createProject = async (projectData: Prisma.ProjectCreateInput) => {
    // Implementation for creating a project

    const newProject = await prisma.project.create({
        data: {
            ...projectData,
        },
    });

    return newProject;




}

 export const ProjectService = {
    createProject
};   