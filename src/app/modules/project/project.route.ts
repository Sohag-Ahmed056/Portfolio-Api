import { Router } from "express";
import { ProjectController } from "./project.controller.js";




export const projectRoute = Router();

projectRoute.post('/create', ProjectController.createProject);

