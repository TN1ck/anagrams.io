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
    const sortedSubAnagrams = anagram.findSortedAndGroupedSubAnagrams(sanitizedQuery, dictionary.dict)
    const optimizedForTransport = sortedSubAnagrams.map(w => {
      // TODO
      (w as any).set = anagram.binaryToString(w.set);
      return w;
    });
    response.json({anagrams: optimizedForTransport, success: true});
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
        language: d.language,
      };
    });
    response.json({success: true, dictionaries: dictionarieList});
  }
)

export default router;
