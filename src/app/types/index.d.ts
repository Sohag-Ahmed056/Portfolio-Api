import "express";

declare global {
  namespace Express {
    // interface UserPayload {
    //   id: string;
    //   email: string;
    //   role: string;
    //   iat?: number;
    //   exp?: number;
    // }

    interface Request {
      user
    }
  }
}
