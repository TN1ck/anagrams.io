import mockData from './mock';
import * as anagram from '../anagram';

export interface Performance {
  executed: string;
  start: number;
  end: number;
  timeNeeded: number;
}

export interface PerformanceWithSolutions extends Performance {
  // solutions: anagram.AnagramSolution[];
}

export function testPerformanceOne(): PerformanceWithSolutions {
  const executed = new Date();
  const start = performance.now();
  const test = mockData.testOne;
  const generators = anagram.findAnagramSentences(test.string, test.subanagrams);
  generators.map(({generator}) => {
    const gen = generator;
    const values = [...gen].map(v => v.solutions);
    return values;
  });
  const end = performance.now();
  const timeNeeded = end - start;
  return {
    executed: executed.toISOString(),
    start,
    end,
    timeNeeded,
  }
}
