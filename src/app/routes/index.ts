import { Router } from 'express';
import { userRoute } from '../modules/user/user.route.js';
import { authRoute } from '../middlewares/auth/auth.route.js';
import { blogroute } from '../modules/blog/blog.route.js';
import { projectRoute } from '../modules/project/project.route.js';
import { resumeRoute } from '../modules/resume/resume.route.js';

export const createApiRouter = (): Router => {
  const router = Router();

  // Array of objects with path and router
  const routes: { path: string; router: Router }[] = [
    { path: 'user', router: userRoute },
    {  path:'auth', router: authRoute},
    { path: 'blog', router: blogroute },
    { path: 'project', router: projectRoute },
    { path: 'resume', router: resumeRoute },

  ];
  

  // Dynamically attach each router
  routes.map(r => {
    router.use(`/${r.path}`, r.router);
    
  });

  return router;
};
