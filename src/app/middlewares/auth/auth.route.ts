import { Router } from "express";
import { AuthController } from "./auth.controller.js";



export const authRoute= Router()

authRoute.post('/login', AuthController.userLogin)
authRoute.post('/logout', AuthController.requireAuth, AuthController.logOutUser)
