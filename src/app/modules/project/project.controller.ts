import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { ProjectService } from "./project.service.js";
import sendResponse from "../../shared/sendResponse.js";
import { ImageService } from "./image.service.js";


const createProject = catchAsync(async(req:Request, res:Response)=>{

    const projectData= req.body;
    // const userId= req.user?.id;

    const project = await ProjectService.createProject(projectData);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully!",
        data: project
    })

})



const deleteProject = catchAsync(async (req: Request, res: Response) => {
  // from frontend
  const projectId = req.params.id;
  const Id = Number(projectId);

  await ProjectService.deleteProject(Id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully!",
    data: null,
  });
});

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const projectId = req.params.id as string;
  const project = await ProjectService.getSingleProject(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project details retrieved successfully!",
    data: project,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const projectId = req.params.id as string;
  const projectData = req.body;

  const updatedProject = await ProjectService.updateProject(projectId, projectData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully!",
    data: updatedProject,
  });
});

const getALLProject = catchAsync(async (req: Request, res: Response) => {
  const projects = await ProjectService.getALLProject();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All projects retrieved successfully",
    data: projects,
  });
});

import ApiError from "../../errors/ApiError.js";

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const image = await ImageService.uploadImage(req.file);
  const host = req.get("host") || "localhost:5000";
  const protocol = process.env.VERCEL ? "https" : req.protocol;
  const imagePath = `/api/v1/project/images/${image.id}`;
  const imageUrl = `${protocol}://${host}${imagePath}`;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Image uploaded successfully!",
    data: {
      url: imageUrl,
      path: imagePath,
      filename: image.filename,
    },
  });
});

const getImage = catchAsync(async (req: Request, res: Response) => {
  const image = await ImageService.getImage(req.params.id as string);
  res.set({
    "Content-Type": image.mimeType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  res.send(Buffer.from(image.data));
});

export const ProjectController = {
  createProject,
  getALLProject,
  getSingleProject,
  updateProject,
  deleteProject,
  uploadImage,
  getImage,
};
