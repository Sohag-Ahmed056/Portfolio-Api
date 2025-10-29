
import bcrypt from "bcrypt"
import { prisma } from "../../shared/prisma.js";
import ApiError from "../../errors/ApiError.js";


interface ILoginPayload {
  email: string;
  password: string;
}

const login = async (payload: ILoginPayload) => {

    const { email, password , } = payload;

  const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if(!user){
        throw new ApiError(404, "user not found")
    }

    const verifyPassword = await bcrypt.compare(password, user.password)

    if(!verifyPassword){
        throw new ApiError(404, "invalid Password")
    }

    

    


    return {
        
        user
        

    }


}




// const changePassword = async (user: any, payload: any) => {

//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: user.email,

//         }
//     });

//     const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

//     if (!isCorrectPassword) {
//         throw new Error("Password incorrect!")
//     }

//     // const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);

//     await prisma.user.update({
//         where: {
//             email: userData.email
//         },
//         data: {
//             password: payload.newPassword,
           
//         }
//     })

//     return {
//         message: "Password changed successfully!"
//     }
// };



export const AuthService={
    login,
    
}