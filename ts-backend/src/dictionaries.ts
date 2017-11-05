import * as fs from 'fs';
import * as path from 'path';
import {parseDictionary} from 'src/../../ts-frontend/src/dictionaries';

function readFile(path: string) {
  return fs.readFileSync(path).toString();
}

const dictionaries = {
  // TOOD: fix this
  engUS1: parseDictionary(readFile(path.join(__dirname, '../../dictionaries/eng-us-1.csv'))),
  engUS2: parseDictionary(readFile(path.join(__dirname, '../../dictionaries/eng-us-2.csv'))),
}
export default dictionaries;