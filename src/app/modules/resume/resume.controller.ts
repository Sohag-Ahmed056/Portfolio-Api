import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { ResumeService } from "./resume.service.js";
import ApiError from "../../errors/ApiError.js";

const createResume = catchAsync(async (req: Request, res: Response) => {
  const { userId, ...resumeData } = req.body;

  console.log("User ID:", userId);
  console.log("Resume Data:", resumeData);

  // Validate userId and essential fields
  if (!userId) {
    throw new ApiError(400, "User ID is required. Please send it from frontend.");
  }

  if (!resumeData.name || !resumeData.email) {
    throw new ApiError(400, "Name and email are required fields.");
  }

  const resume = await ResumeService.createResume(resumeData, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Resume created successfully!",
    data: resume,
  });
});

export const ResumeController = {
  createResume,
};
