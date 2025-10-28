import { Router } from "express";
import { ProjectController } from "./project.controller.js";
import { AuthController } from "../../middlewares/auth/auth.controller.js";




export const projectRoute = Router();

projectRoute.post('/create', ProjectController.createProject);
projectRoute.get("/getAll", ProjectController.getALLProject),
projectRoute.delete('/delete/:id', ProjectController.deleteProject)

