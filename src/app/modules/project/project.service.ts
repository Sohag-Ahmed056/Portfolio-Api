import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma.js";
import ApiError from "../../errors/ApiError.js";



const createProject = async (projectData: Prisma.ProjectCreateInput) => {
    // Implementation for creating a project

    const newProject = await prisma.project.create({
        data: {
            ...projectData,
        },
    });

    return newProject;

}

const deleteProject = async (projectId: number | string) => {
  const id = Number(projectId);

  // Check if project exists
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Delete the project
  await prisma.project.delete({
    where: { id },
  });

  return { message: "Project deleted successfully" };
};

const getALLProject = async()=>{


     const projects = await prisma.project. findMany()

     return projects;
}

 export const ProjectService = {
    createProject,
    getALLProject,
    deleteProject
};   