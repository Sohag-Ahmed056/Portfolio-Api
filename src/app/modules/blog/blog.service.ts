import { Prisma } from "@prisma/client";
import { generateSlug } from "../../utils/generateSlug.js";
import { prisma } from "../../shared/prisma.js";
import ApiError from "../../errors/ApiError.js";

interface GetAllBlogsOptions {
  page?: number;
  limit?: number;
    search?: string;
}

const createBlog = async (blogData:Prisma.BlogCreateInput, userId:any) => {

    const slug = generateSlug(blogData.title);
    
    const existingBlog = await prisma.blog.findUnique({
        where: {
            slug: slug
        }
    });

    if(existingBlog){
        throw new ApiError(409, "Blog with this title already exists");

    }

    const newBlog = await prisma.blog.create({
        data:{
            ...blogData,
            slug: slug,
           author:{
            connect:{
                id:userId
            }
           }

        },

        include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return newBlog;
}

const getAllBlogs = async (options:GetAllBlogsOptions) => {

     const { page = 1, limit = 10,search } = options;
     const skip = (page - 1) * limit;

    let where: Prisma.BlogWhereInput = {};

  if (search) {
    where = {
      OR: [
        {
          title: { contains: search, mode: "insensitive" as Prisma.QueryMode },
        },
        {
          content: { contains: search, mode: "insensitive" as Prisma.QueryMode },
        },
      ],
    };
  }




    const [blogs, total] = await prisma.$transaction([
    prisma.blog.findMany({
      skip,
      take: limit,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.blog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: blogs,
    meta: { total, page, limit, totalPages },
  };
}

export const BlogService={
    createBlog,
    getAllBlogs
};




