import * as anagram from '../../../ts-frontend/src/anagram';
import dictionaries from '../dictionaries';
import {Router} from 'express';
import * as cors from 'cors';

const router: Router = Router();

router.get(
  '/anagram/:query',
  cors(),
  (request, response): void => {
    const query = request.params.query;
    const dictionaryKey = request.query.dictionary;
    const sanitizedQuery = anagram.sanitizeQuery(query);
    const dictionary = dictionaries.find(d => d.id === dictionaryKey) || dictionaries[0];
    const sortedSubAnagrams = anagram.findSortedSubAnagrmns(sanitizedQuery, dictionary.dict)
    response.json({anagrams: sortedSubAnagrams, success: true});
  }
);

router.get(
  '/anagram-dictionaries',
  cors(),
  (request, response): void => {
    const dictionarieList = dictionaries.map(d => {
      return {
        id: d.id,
        name: d.name,
      };
    });
    response.json(dictionarieList);
  }
)

export default router;