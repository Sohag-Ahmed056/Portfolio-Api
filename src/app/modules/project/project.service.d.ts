import { Prisma } from "@prisma/client";
export declare const ProjectService: {
    createProject: (projectData: Prisma.ProjectCreateInput) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        slug: string;
        thumbnail: string | null;
        liveUrl: string | null;
        repoUrl: string | null;
        description: string;
        features: string[];
        technologies: string[];
        isFeatured: boolean;
        challenges: string[];
    }>;
    getALLProject: () => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        slug: string;
        thumbnail: string | null;
        liveUrl: string | null;
        repoUrl: string | null;
        description: string;
        features: string[];
        technologies: string[];
        isFeatured: boolean;
        challenges: string[];
    }[]>;
    getSingleProject: (projectId: number | string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        slug: string;
        thumbnail: string | null;
        liveUrl: string | null;
        repoUrl: string | null;
        description: string;
        features: string[];
        technologies: string[];
        isFeatured: boolean;
        challenges: string[];
    }>;
    updateProject: (projectId: number | string, projectData: Prisma.ProjectUpdateInput) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        slug: string;
        thumbnail: string | null;
        liveUrl: string | null;
        repoUrl: string | null;
        description: string;
        features: string[];
        technologies: string[];
        isFeatured: boolean;
        challenges: string[];
    }>;
    deleteProject: (projectId: number | string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=project.service.d.ts.map