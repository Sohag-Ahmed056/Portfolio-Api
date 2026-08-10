import { prisma } from "../../shared/prisma.js";
// resume.service.ts
const createResume = async (payload, userId) => {
    // Validate required fields
    if (!payload.name || !payload.email) {
        throw new Error('Name and email are required fields');
    }
    const resume = await prisma.resume.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            title: payload.title, // This should be the actual value, not String constructor
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            github: payload.github,
            skills: payload.skills || [],
            education: payload.education || [],
            projects: payload.projects || [],
            certifications: payload.certifications || [],
            experience: payload.experience || []
        }
    });
    return resume;
};
export const ResumeService = {
    createResume
};
//# sourceMappingURL=resume.service.js.map