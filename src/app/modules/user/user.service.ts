import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma.js";
import ApiError from "../../errors/ApiError.js";

/**
 * Create new user
 */
const createUser = async (payload: Prisma.UserCreateInput) => {
  const {  email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Get all users
 */
const getAll = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

/**
 * Get a single user by ID
 */
const getMe = async (userId: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      blogs: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/**
 * Update user info (name or password)
 */
const updateUser = async (userId: any, payload: any) => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userData) {
    throw new ApiError(404, "User not found");
  }

  let updatedData: any = {
    name: payload.name || userData.name,
  };

  // Optional password update
  if (payload.oldPassword && payload.newPassword) {
    const isCorrectPassword = await bcrypt.compare(
      payload.oldPassword,
      userData.password
    );

    if (!isCorrectPassword) {
      throw new ApiError(401, "Incorrect old password");
    }

    updatedData.password = await bcrypt.hash(payload.newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const userService = {
  createUser,
  getAll,
  getMe,
  updateUser,
};
