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



const deleteProject = catchAsync(async (req: Request, res: Response) => {
 // from frontend
  const blogId = req.params.id;
  const Id = Number(blogId)

  

  await ProjectService.deleteProject(Id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog deleted successfully!",
    data: null,
  });
});

const getALLProject= catchAsync(async(req:Request,res:Response)=>{

    const projects = await ProjectService.getALLProject()

    sendResponse(res,{

        statusCode: 201,
        success:true,
        message: "all projects successfully get",
        data: projects
    })




})

export const ProjectController={
    createProject,
    getALLProject,
    deleteProject
};