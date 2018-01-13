import * as fs from 'fs';
import * as path from 'path';
import {parseDictionary, filterDictionaryFromDictionary} from '../../ts-frontend/src/dictionaries';
import {NODE_PATH} from './constants';

function readFile(path: string) {
  return fs.readFileSync(path).toString();
}

const deTwo = parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-allowed-1-2.csv')));
const deThree = parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-allowed-3.csv')));
const enTwo = parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/en-allowed-1-2.csv')));
const enThree = parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/en-allowed-3.csv')));

const deTest = deTwo.concat(deThree);
const enTest = enTwo.concat(enThree);

const dictionaries = [
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/eng-us-50k.csv'))),
      enTest
    ),
    language: 'en',
    id: 'en',
    name: 'English'
  },
  {
    dict: filterDictionaryFromDictionary(
      parseDictionary(readFile(path.join(NODE_PATH, '../dictionaries/de-50k.csv'))),
      deTest
    ),
    language: 'de',
    id: 'de',
    name: 'German'
  },
];

export default dictionaries;