import { Router } from "express";
import { AuthController } from "../../middlewares/auth/auth.controller.js";
import { ResumeController } from "./resume.controller.js";


export const resumeRoute = Router();
resumeRoute.post('/create',AuthController.requireAuth, ResumeController.createResume);
