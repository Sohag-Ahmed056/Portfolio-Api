import { Router } from "express";
import { ResumeController } from "./resume.controller.js";


export const resumeRoute = Router();
resumeRoute.post('/create', ResumeController.createResume);
