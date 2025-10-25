import { Router } from "express";
import { BlogController } from "./blog.controller.js";
import { AuthController } from "../../middlewares/auth/auth.controller.js";

export const blogroute= Router();


blogroute.post('/create',AuthController.requireAuth, BlogController.createBlog);

blogroute.get('/getAll', BlogController.getAllBlog);