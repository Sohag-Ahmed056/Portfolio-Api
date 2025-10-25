import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { userService } from "./user.service.js";
import sendResponse from "../../shared/sendResponse.js";



const createUser= catchAsync(async(req:Request, res:Response)=>{

    const payload= req.body;


    const user = await userService.createUser(payload);

    console.log('Created User:', user);
 

     sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully!",
        data: user
    })



})


const getAllUser= catchAsync(async(req:Request, res:Response)=>{

    const users = await userService.getALl();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully!",
        data: users
    })  
})

const getMe = catchAsync(async(req:Request, res:Response)=>{

    const userId = req.user.id;

    const user = await userService.getMe(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully!",
        data: user
    })
})


const updateUser= catchAsync(async(req:Request, res:Response)=>{

    const user = req.user;
    const updateData= req.body;
    console.log("updateData",updateData);

    const updatedUser = await userService.updateUser(user, updateData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully!",
        data: updatedUser
    })
})

export const userController = {
    createUser,
    getAllUser,
    getMe,
    updateUser
};