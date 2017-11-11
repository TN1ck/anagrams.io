import {Router} from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as cors from 'cors';

import {NODE_PATH} from '../constants';
import {Performance} from '../../../ts-frontend/src/performance/performance';

const router: Router = Router();

function appendToPerformanceFile(performance: Performance) {
  const filePath = path.join(NODE_PATH, 'performances.log');
  const string = `${performance.executed},${performance.timeNeeded}\n`;
  fs.appendFile(filePath, string, () => {});
}

router.options('/performance', cors());
router.post(
  '/performance',
  cors(),
  (request, response): void => {
    const body: Performance = request.body;
    if (body && body.start && body.end && body.timeNeeded && body.executed) {
      appendToPerformanceFile(body);
      response.json({success: true});
      return;
    }
    response.json({success: false})
  },
);

export default router;