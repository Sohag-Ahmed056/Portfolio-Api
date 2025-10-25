import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { ProjectService } from "./project.service.js";
import sendResponse from "../../shared/sendResponse.js";


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

export const ProjectController={
    createProject
};