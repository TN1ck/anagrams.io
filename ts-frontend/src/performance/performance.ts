import mockData from './mock';
import * as anagram from 'src/anagram';

export interface Performance {
  executed: Date;
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
  const {generator} = anagram.findAnagramSentences(test.string, test.subanagrams);
  const gen = generator();
  const solutions = [...gen].filter(v => v.solution).map(v => v.current);
  const end = performance.now();
  const timeNeeded = end - start;
  return {
    executed,
    start,
    end,
    timeNeeded,
    solutions,
  }
}