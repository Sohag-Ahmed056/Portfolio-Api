import { Router } from "express";
import { BlogController } from "./blog.controller.js";


export const blogroute= Router();


blogroute.post('/create',BlogController.createBlog);

blogroute.get('/getAll', BlogController.getAllBlog);
blogroute.delete('/delete/:id', BlogController.deleteBlog);
blogroute.get('/details/:id', BlogController.getBlogById)
blogroute.get('/userblog', BlogController.getUserBlogs)