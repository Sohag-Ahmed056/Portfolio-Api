import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { BlogService } from "./blog.service.js";
import sendResponse from "../../shared/sendResponse.js";
import ApiError from "../../errors/ApiError.js";

/**
 * Create a blog post
 * Expecting frontend to send userId (from NextAuth session)
 */
const createBlog = catchAsync(async (req: Request, res: Response) => {
  const { userId, ...blogData } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required. Please send it from frontend.");
  }

  const blog = await BlogService.createBlog(blogData, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully!",
    data: blog,
  });
});

/**
 * Get all blogs (with pagination & search)
 */
const getAllBlog = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const blogs = await BlogService.getAllBlogs({ page, limit, search });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully!",
    data: blogs,
  });
});

/**
 * Delete a blog post
 * Expecting frontend to send userId (from NextAuth session)
 */

const getUserBlogs =catchAsync(async(req,res)=>{

  const userId= req.body;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const blogs = await BlogService.getUserBlogsService(userId,{page,limit});

   sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully!",
    data: blogs,
  });







})


const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid or missing blog ID");
  }

  const blogId = Number(id);
  const blog = await BlogService.getBlogById(blogId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog fetched successfully",
    data: blog,
  });
});



const deleteBlog = catchAsync(async (req: Request, res: Response) => {
 // from frontend
  const blogId = req.params.id;

  

  await BlogService.deleteBlog(blogId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog deleted successfully!",
    data: null,
  });
});

export const BlogController = {
  createBlog,
  getAllBlog,
  deleteBlog,
  getUserBlogs,
  getBlogById
};
