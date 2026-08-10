import type { Prisma } from "@prisma/client";
export declare const ResumeService: {
    createResume: (payload: any, userId: any) => Promise<{
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string | null;
        phone: string | null;
        github: string | null;
        skills: Prisma.JsonValue;
        education: Prisma.JsonValue;
        projects: Prisma.JsonValue;
        certifications: Prisma.JsonValue;
        experience: Prisma.JsonValue;
        userId: number;
    }>;
};
//# sourceMappingURL=resume.service.d.ts.map