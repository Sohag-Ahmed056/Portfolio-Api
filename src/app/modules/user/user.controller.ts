import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { userService } from "./user.service.js";
import sendResponse from "../../shared/sendResponse.js";
import ApiError from "../../errors/ApiError.js";

/**
 * Create a new user
 */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userService.createUser(payload);

  console.log("Created User:", user);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully!",
    data: user,
  });
});

/**
 * Get all users
 */
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAll();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: users,
  });
});

/**
 * Get a single user (by ID from frontend)
 */
const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    throw new ApiError(400, "User ID is required. Please send it from frontend.");
  }

  const user = await userService.getMe(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully!",
    data: user,
  });
});

/**
 * Update a user (frontend must send userId and data)
 */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId, ...updateData } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required to update profile.");
  }

  const updatedUser = await userService.updateUser(userId, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully!",
    data: updatedUser,
  });
});

export const userController = {
  createUser,
  getAllUser,
  getMe,
  updateUser,
};
