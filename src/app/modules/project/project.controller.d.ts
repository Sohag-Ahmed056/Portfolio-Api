import type { Request, Response } from "express";
export declare const ProjectController: {
    createProject: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getALLProject: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSingleProject: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateProject: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteProject: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    uploadImage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=project.controller.d.ts.map