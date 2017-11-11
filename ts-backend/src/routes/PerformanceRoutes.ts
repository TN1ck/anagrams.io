import {Router} from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as cors from 'cors';

import {NODE_PATH} from '../constants';
import {Performance} from '../../../ts-frontend/src/performance/performance';

const router: Router = Router();

const filePath = path.join(NODE_PATH, 'performances.log');

function appendToPerformanceFile(performance: Performance, callback) {
  const string = `${performance.executed},${performance.start},${performance.end},${performance.timeNeeded}\n`;
  fs.appendFile(filePath, string, callback);
}

function readPerformanceFile(callback: (performances: Performance[]) => any) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // TODO
      callback([]);
      return;
    }
    // TODO: use actualy csv parser if needed
    const lines = data.toString().split('\n');
    const performances: Performance[] = lines.filter(l => l !== '').map(l => {
      const [executed, start, end, timeNeeded] = l.split(',');
      return {
        executed: new Date(executed),
        start: Number(start),
        end: Number(end),
        timeNeeded: Number(timeNeeded),
      };
    })
    callback(performances);
  })  
}

router.options('/performance', cors());
router.post(
  '/performance',
  cors(),
  (request, response): void => {
    const body: Performance = request.body;
    if (body && body.start && body.end && body.timeNeeded && body.executed) {
      appendToPerformanceFile(body, () => {
        readPerformanceFile(performances => {
          response.json({success: true, performances});
        })
      });
      return;
    }
    response.json({success: false})
  },
);

router.get(
  '/performances',
  cors(),
  (request, response): void => {
    readPerformanceFile(performances => {
      response.json({success: true, performances});
    })
  }
)

export default router;