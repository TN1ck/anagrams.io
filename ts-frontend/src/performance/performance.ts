import {flatten} from 'lodash';
import mockData from './mock';
import * as anagram from 'src/anagram';

export interface Performance {
  executed: string;
  start: number;
  end: number;
  timeNeeded: number;
}

export interface PerformanceWithSolutions extends Performance {
  solutions: anagram.AnagramSolution[];
}

export function testPerformanceOne(): PerformanceWithSolutions {
  const executed = new Date();
  const start = performance.now();
  const test = mockData.testOne;
  const generators = anagram.findAnagramSentences(test.string, test.subanagrams);
  const subanagramSolutions = generators.map(({generator}) => {
    const gen = generator;
    const values = [...gen].filter(v => v.solution).map(v => v.current);
    return values;
  });
  const solutions = flatten(subanagramSolutions);
  const end = performance.now();
  const timeNeeded = end - start;
  return {
    executed: executed.toISOString(),
    start,
    end,
    timeNeeded,
    solutions,
  }
}