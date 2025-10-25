import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import ApiError from "../../errors/ApiError.js";
import { BlogService } from "./blog.service.js";
import sendResponse from "../../shared/sendResponse.js";


const createBlog= catchAsync(async(req:Request, res:Response,next:NextFunction)=>{

    if(!req.user){

        throw new ApiError(401, "Unauthorized");
    }

    const blogData= req.body;
    const userId= req.user?.id;

    const blog = await BlogService.createBlog(blogData, userId!);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully!",
        data: blog
    })   


})

const getAllBlog= catchAsync(async(req:Request, res:Response)=>{

     const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const blogs = await BlogService.getAllBlogs({ page, limit, search });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully!",
        data: blogs
    })  
})


export const BlogController={
    createBlog,
    getAllBlog
};
