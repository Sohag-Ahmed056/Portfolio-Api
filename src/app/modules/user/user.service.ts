import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt"
import { prisma } from "../../shared/prisma.js";
import ApiError from "../../errors/ApiError.js";


const createUser=async(payload:Prisma.UserCreateInput)=>{

    console.log('Payload:', payload);
    const{name,email, password}=payload;

    const findUserByEmail=await prisma.user.findUnique({
            where: {
                email
            }
        });


    if(findUserByEmail){

        throw new ApiError(409,'User with this email already exists');
    }

    const hashedPassword= await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data:{
            ...payload,
            password: hashedPassword
        },
        select:{
              id: true,
            name: true,
            email: true,
            role:true,
            createdAt: true,
            updatedAt: true

            
        }
    });

    

    return user;


    }
         


    const getALl = async()=>{

        const getAllUser=  await prisma.user.findMany()


        return getAllUser;
    }

    
    const getMe = async(userId:any)=>{

        const user= await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id: true,
                name: true,
                email: true,
                role:true,
                blogs:true,
                // Resume:true,
                createdAt: true,
                updatedAt: true
            }
        });

        if(!user){

            throw new ApiError(404,'User not found');
        }

        return user;
    }


     const updateUser= async(user:any, payload:any)=>{



         const userData = await prisma.user.findUniqueOrThrow({
                where: {
                    email: user.email,
        
                }
            });
        
            const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);
        
            if (!isCorrectPassword) {
                throw new Error("Password incorrect!")
            }
        
            const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);
          const{email,name, ...restPayload}= payload

        const updatedUser= await prisma.user.update({
            where:{
                email: user.email
            },
            data:{
                // password: payload.newPassword ? await bcrypt.hash(payload.newPassword,10) : userData.password
                password: hashedPassword,
                name: name || userData.name
                

            },
            select:{
                id: true,
                name: true,
                email: true,
                role:true,
                createdAt: true,
                updatedAt: true
            }
        });

        return updatedUser;

    }

    export const userService={
        createUser,
        getALl,
        getMe,
        updateUser
    };


