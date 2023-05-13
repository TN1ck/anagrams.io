import {Router} from 'express';

const router: Router = Router();

router.get(
  '/test',
  (request, response): void => {
    response.json({data: 'Hello, World!'});
  },
);

export default router;