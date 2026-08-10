import { Prisma } from "@prisma/client";
export declare const userService: {
    createUser: (payload: Prisma.UserCreateInput) => Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    getAll: () => Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    getMe: (userId: any) => Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    updateUser: (userId: any, payload: any) => Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map