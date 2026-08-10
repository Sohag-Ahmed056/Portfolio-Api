import catchAsync from "../../shared/catchAsync.js";
import { ProjectService } from "./project.service.js";
import sendResponse from "../../shared/sendResponse.js";
const createProject = catchAsync(async (req, res) => {
    const projectData = req.body;
    // const userId= req.user?.id;
    const project = await ProjectService.createProject(projectData);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully!",
        data: project
    });
});
const deleteProject = catchAsync(async (req, res) => {
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
const getSingleProject = catchAsync(async (req, res) => {
    const projectId = req.params.id;
    const project = await ProjectService.getSingleProject(projectId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project details retrieved successfully!",
        data: project,
    });
});
const updateProject = catchAsync(async (req, res) => {
    const projectId = req.params.id;
    const projectData = req.body;
    const updatedProject = await ProjectService.updateProject(projectId, projectData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project updated successfully!",
        data: updatedProject,
    });
});
const getALLProject = catchAsync(async (req, res) => {
    const projects = await ProjectService.getALLProject();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All projects retrieved successfully",
        data: projects,
    });
});
import ApiError from "../../errors/ApiError.js";
const uploadImage = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }
    const host = req.get("host") || "localhost:5000";
    const protocol = req.protocol || "http";
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Image uploaded successfully!",
        data: {
            url: imageUrl,
            path: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
        },
    });
});
export const ProjectController = {
    createProject,
    getALLProject,
    getSingleProject,
    updateProject,
    deleteProject,
    uploadImage,
};
//# sourceMappingURL=project.controller.js.map