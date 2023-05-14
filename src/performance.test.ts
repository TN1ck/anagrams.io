import { test, expect } from "vitest";

import mockData from "./mock";
import * as anagram from "./anagram";

export interface Performance {
  executed: string;
  start: number;
  end: number;
  timeNeededInMilliSeconds: number;
}

export function testPerformanceOne(): Performance {
  const executed = new Date();
  const start = performance.now();
  const test = mockData.testOne;
  const realSubanagrams = test.subanagrams.map((s) => {
    return { ...s, set: anagram.stringToBinary(s.set) };
  });
  const generators = anagram.findAnagramSentences(
    anagram.stringToWord(test.string),
    realSubanagrams as any
  );
  generators.map(({ generator }) => {
    const values = generator();
    return values;
  });
  const end = performance.now();
  const timeNeeded = end - start;
  return {
    executed: executed.toISOString(),
    start,
    end,
    timeNeededInMilliSeconds: timeNeeded,
  };
}

test("testPerformanceOne", () => {
  const performance = testPerformanceOne();
  // Should not take longer that 10 seconds.
  expect(performance.timeNeededInMilliSeconds).toBeLessThan(1 * 1000 * 10);
});
