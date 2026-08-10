import { Router } from 'express';
import { userRoute } from '../modules/user/user.route.js';
import { authRoute } from '../middlewares/auth/auth.route.js';
import { projectRoute } from '../modules/project/project.route.js';
import { resumeRoute } from '../modules/resume/resume.route.js';
import { aiRoute } from '../modules/ai/ai.route.js';
export const createApiRouter = () => {
    const router = Router();
    const routes = [
        { path: 'user', router: userRoute },
        { path: 'auth', router: authRoute },
        { path: 'project', router: projectRoute },
        { path: 'resume', router: resumeRoute },
        { path: 'ai', router: aiRoute },
    ];
    routes.map(r => {
        router.use(`/${r.path}`, r.router);
    });
    return router;
};
//# sourceMappingURL=index.js.map