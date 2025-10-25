import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { ResumeService } from "./resume.service.js";
import ApiError from "../../errors/ApiError.js";

const createResume = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    console.log('User ID:', userId); 
    
    const resumeData = req.body;
    console.log('Resume Data:', resumeData);

    // Validate that required fields are present
    if (!resumeData.name || !resumeData.email) {
        
        throw new ApiError(400, 'Name and email are required fields');
    }

    const resume = await ResumeService.createResume(resumeData, userId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Resume created successfully!",
        data: {
            resume,
            // downloadLink
        }
    });
});

export const ResumeController = {
    createResume
};