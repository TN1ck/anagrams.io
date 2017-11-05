import * as anagram from '../../../ts-frontend/src/anagram';
import dictionaries from '../dictionaries';
import {Router} from 'express';
import * as cors from 'cors';

const router: Router = Router();

router.get(
  '/anagram/:query',
  cors(),
  (request, response): void => {
    const query = request.param('query');
    const sanitizedQuery = anagram.sanitizeQuery(query);
    const sortedSubAnagrams = anagram.findSortedSubAnagrmns(sanitizedQuery, dictionaries.engUS1)
    response.json({anagrams: sortedSubAnagrams, success: true});
  },
);

export default router;