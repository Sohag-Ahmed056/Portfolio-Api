import { Router } from "express";
import { ProjectController } from "./project.controller.js";





import { uploadProjectImage } from "../../middlewares/imageUpload.middleware.js";

export const projectRoute = Router();

projectRoute.post("/upload-image", uploadProjectImage, ProjectController.uploadImage);
projectRoute.get("/images/:id", ProjectController.getImage);
projectRoute.post("/create", ProjectController.createProject);
projectRoute.get("/getAll", ProjectController.getALLProject);
projectRoute.get("/:id", ProjectController.getSingleProject);
projectRoute.put("/update/:id", ProjectController.updateProject);
projectRoute.patch("/update/:id", ProjectController.updateProject);
projectRoute.delete("/delete/:id", ProjectController.deleteProject);
