import * as fs from 'fs';
import * as path from 'path';
import {parseDictionary, filterDictionaryFromDictionary} from '../../ts-frontend/src/dictionaries';

function readFile(path: string) {
  return fs.readFileSync(path).toString();
}

const NODE_PATH = process.env.NODE_PATH;

const deTwo = parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-allowed-1-2.csv')));
const enTwo = parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/en-allowed-1-2.csv')));

const dictionaries = [
  // TOOD: fix this
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/eng-us-3k.csv'))),
      enTwo
    ),
    id: 'eng-us-3k',
    name: 'English 3k'
  },
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/eng-us-10k.csv'))),
      enTwo
    ),
    id: 'eng-us-10k',
    name: 'English 10k'
  },
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/eng-us-50k.csv'))),
      enTwo
    ),
    id: 'eng-us-50k',
    name: 'English 50k'
  },
  {
    dict: parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/eng-countries.csv'))),
    id: 'eng-countries',
    name: 'English Countries'
  },
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-3k.csv'))),
      deTwo
    ),
    id: 'de-3k',
    name: 'German 3k'
  },
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-10k.csv'))),
      deTwo
    ),
    id: 'de-10k',
    name: 'German 10k'
  },
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-50k.csv'))),
      deTwo
    ),
    id: 'de-50k',
    name: 'German 50k'
  },
  {
    dict: parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-countries.csv'))),
    id: 'de-countries',
    name: 'German Countries'
  },
  {
    dict: parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/famous-people.csv'))),
    id: 'famous-people',
    name: 'Famous People'
  },
];

export default dictionaries;