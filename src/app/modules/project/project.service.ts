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

const getSingleProject = async (projectId: number | string) => {
  const id = Number(projectId);
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

const updateProject = async (projectId: number | string, projectData: Prisma.ProjectUpdateInput) => {
  const id = Number(projectId);

  const existing = await prisma.project.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new ApiError(404, "Project not found");
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
    },
  });

  return updatedProject;
};

const getALLProject = async () => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return projects;
};

export const ProjectService = {
  createProject,
  getALLProject,
  getSingleProject,
  updateProject,
  deleteProject,
};