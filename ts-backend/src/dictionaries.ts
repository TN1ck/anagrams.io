import * as fs from 'fs';
import * as path from 'path';
import {parseDictionary} from '../../ts-frontend/src/dictionaries';

function readFile(path: string) {
  return fs.readFileSync(path).toString();
}

const dictionaries = {
  // TOOD: fix this
  engUS1: parseDictionary(readFile(path.join(__dirname, '../../../../dictionaries/eng-us-3k.csv'))),
  engUS2: parseDictionary(readFile(path.join(__dirname, '../../../../dictionaries/eng-us-10k.csv'))),
  engUS3: parseDictionary(readFile(path.join(__dirname, '../../../../dictionaries/eng-us-50k.csv'))),
}
export default dictionaries;