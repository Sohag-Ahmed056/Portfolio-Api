import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../shared/sendResponse.js";




const userLogin = catchAsync(async(req:Request, res:Response)=>{

    const result= await AuthService.login(req.body)

   
         sendResponse(res,{

        statusCode:201,
        success:true,
        message:"user logged in successfully",
        data: result

    })

       
});
        





// const logOutUser = catchAsync(async(req:Request, res:Response)=>{

//     res.clearCookie("authToken",{
//         httpOnly:true,
//         secure:false,
//         sameSite: "lax",
//     })


//      sendResponse(res,{

//         statusCode:201,
//         success:true,
//         message:"user logged out successfully",
//         data: null

//     })

   

// })

// const userChangePassword = catchAsync(async(req:Request, res:Response)=>{

//     const result= await AuthService.changePassword(req.user, req.body)
//     sendResponse(res,{

//         statusCode:200,
//         success:true,
//         message:"Password changed successfully",
//         data: result

//     })

// })


// const requireAuth = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

//     const authToken = req.cookies.authToken || req.cookies.next-auth.session-token;
//     console.log("authToken",authToken);

//     if(!authToken){
//         throw new ApiError(401, "Unauthorized")
//     }

//     const verifiedPayload = jwtHelper.verifyToken(authToken,"mysecret")

//     req.user = verifiedPayload;

//     next();

// })

// const requireOwner = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

//     if(req.user?.role !== 'OWNER'){
//         throw new ApiError(403, "Forbidden")
//     }

//     next();

// })


export const AuthController= {
    userLogin,
    
}