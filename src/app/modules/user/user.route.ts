import { Router } from "express";
import { userController } from "./user.controller.js";
import { AuthController } from "../../middlewares/auth/auth.controller.js";


export const userRoute= Router();

userRoute.post('/create',userController.createUser)
userRoute.get('/getAll', userController.getAllUser)
userRoute.get('/me', userController.getMe)
userRoute.put('/update',userController.updateUser)