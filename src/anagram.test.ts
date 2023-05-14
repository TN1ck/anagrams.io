import { expect, test } from "vitest";
import {
  ALPHABET,
  binaryToString,
  findAnagramSentencesForInitialStack,
  findAnagramSentencesForSubAnagram,
  findSortedAndGroupedSubAnagrams,
  findSubAnagrams,
  getAnagramMapping,
  groupWordsByStartWord,
  isBinarySame,
  isBinarySubset,
  mapLetters,
  mergeBinaries,
  removeBinary,
  sanitizeQuery,
  stringToBinary,
  stringToWord,
} from "../anagram";

test("mapLetters", () => {
  expect(mapLetters("tést", { é: "e" })).toBe("test");
  expect(mapLetters("", { é: "e" })).toBe("");
  expect(mapLetters("TEST", { é: "e" })).toBe("test");
});

test("sanitizeQuery", () => {
  expect(sanitizeQuery("this is ä sentence", { ä: "a" }, false)).toBe(
    "this is a sentence"
  );
  expect(sanitizeQuery("this is ä sentence", { ä: "a" }, true)).toBe(
    "thisisasentence"
  );
});

test("binaryToString", () => {
  expect(binaryToString(new Uint8Array([1, 1, 1]))).toBe("abc");
  expect(binaryToString(new Uint8Array([1, 1, 1]), "abc")).toBe("abc");
  expect(binaryToString(new Uint8Array([1, 1, 1]), "def")).toBe("def");
  expect(binaryToString(new Uint8Array([0, 3, 1, 2]))).toBe("bbbcdd");
  expect(binaryToString(new Uint8Array([...ALPHABET].map((d) => 1)))).toBe(
    ALPHABET
  );
});

test("stringToBinary", () => {
  expect(stringToBinary("aaabcc", "abc")).toEqual(new Uint8Array([3, 1, 2]));
});

test("stringToWord", () => {
  expect(stringToWord("aaabcc", "abc")).toEqual({
    set: new Uint8Array([3, 1, 2]),
    word: "aaabcc",
    index: -1,
    length: 6,
  });
});

test("mergeBinaries", () => {
  expect(
    mergeBinaries(new Uint8Array([1, 1, 1]), new Uint8Array([1, 1, 1]))
  ).toEqual(new Uint8Array([2, 2, 2]));
  // Why doesn't this test work?
  // expect(
  //   mergeBinaries(new Uint8Array([1, 1, 1]), new Uint8Array([1, 1]))
  // ).toThrowError();
});

test("removeBinary", () => {
  expect(
    removeBinary(new Uint8Array([1, 1, 1]), new Uint8Array([1, 1, 1]))
  ).toEqual(new Uint8Array([0, 0, 0]));
});

test("isBinarySubset", () => {
  expect(
    isBinarySubset(new Uint8Array([1, 1, 1]), new Uint8Array([1, 1, 1]))
  ).toBe(true);
  expect(
    isBinarySubset(new Uint8Array([1, 0, 0]), new Uint8Array([1, 1, 1]))
  ).toBe(true);
  expect(
    isBinarySubset(new Uint8Array([2, 0, 0]), new Uint8Array([1, 1, 1]))
  ).toBe(false);
});

test("isBinarySame", () => {
  expect(
    isBinarySame(new Uint8Array([1, 1, 1]), new Uint8Array([1, 1, 1]))
  ).toBe(true);
  expect(
    isBinarySame(new Uint8Array([1, 0, 0]), new Uint8Array([1, 1, 1]))
  ).toBe(false);
});

test("findSubAnagrams", () => {
  expect(
    findSubAnagrams("cab", [
      {
        set: new Uint8Array([1, 1, 0]),
        word: "ab",
        index: 0,
        length: 2,
      },
      {
        set: new Uint8Array([1, 1, 1]),
        word: "abc",
        index: 1,
        length: 3,
      },
      {
        set: new Uint8Array([1, 0, 0]),
        word: "a",
        index: 2,
        length: 1,
      },
    ])
  ).toStrictEqual([
    {
      set: new Uint8Array([1, 1, 0]),
      word: "ab",
      index: 0,
      length: 2,
    },
    {
      set: new Uint8Array([1, 1, 1]),
      word: "abc",
      index: 1,
      length: 3,
    },
    {
      set: new Uint8Array([1, 0, 0]),
      word: "a",
      index: 2,
      length: 1,
    },
  ]);
});

test("findSortedAndGroupedSubAnagrams", () => {
  expect(
    findSortedAndGroupedSubAnagrams([
      {
        set: new Uint8Array([1, 1, 0]),
        word: "ab",
        index: 0,
        length: 2,
      },
      {
        set: new Uint8Array([1, 1, 1]),
        word: "abc",
        index: 1,
        length: 3,
      },
      {
        set: new Uint8Array([1, 0, 0]),
        word: "a",
        index: 2,
        length: 1,
      },
    ])
  ).toStrictEqual([
    {
      set: new Uint8Array([1, 1, 1]),
      words: ["abc"],
      index: 0,
      length: 3,
    },
    {
      set: new Uint8Array([1, 1, 0]),
      words: ["ab"],
      index: 1,
      length: 2,
    },
    {
      set: new Uint8Array([1, 0, 0]),
      words: ["a"],
      index: 2,
      length: 1,
    },
  ]);
});

test("findAnagramSentencesForInitialStack", () => {
  const fn = findAnagramSentencesForInitialStack(
    stringToWord("abc", "abc"),
    [[[1], new Uint8Array([1, 1, 0]), 2]],
    [
      {
        set: new Uint8Array([1, 1, 1]),
        words: ["abc"],
        index: 0,
        length: 3,
      },
      {
        set: new Uint8Array([1, 1, 0]),
        words: ["ab"],
        index: 1,
        length: 2,
      },
      {
        set: new Uint8Array([0, 0, 1]),
        words: ["c"],
        index: 2,
        length: 1,
      },
    ]
  );
  expect(fn()).toStrictEqual({
    solutions: [[[2, 1], new Uint8Array([1, 1, 1]), 3]],
    numberOfPossibilitiesChecked: 3,
  });
  expect(fn()).toStrictEqual({
    solutions: [],
    numberOfPossibilitiesChecked: 0,
  });
});

test("findAnagramSentencesForSubAnagram", () => {
  const fn = findAnagramSentencesForSubAnagram(
    stringToWord("abc", "abc"),
    [
      {
        set: new Uint8Array([1, 1, 1]),
        words: ["abc"],
        index: 0,
        length: 3,
      },
      {
        set: new Uint8Array([1, 1, 0]),
        words: ["ab"],
        index: 1,
        length: 2,
      },
      {
        set: new Uint8Array([0, 0, 1]),
        words: ["c"],
        index: 2,
        length: 1,
      },
    ],
    {
      set: new Uint8Array([1, 1, 0]),
      words: ["ab"],
      index: 1,
      length: 2,
    }
  );
  expect(fn.generator()).toStrictEqual({
    solutions: [[[2, 1], new Uint8Array([1, 1, 1]), 3]],
    numberOfPossibilitiesChecked: 3,
  });
  expect(fn.generator()).toStrictEqual({
    solutions: [],
    numberOfPossibilitiesChecked: 0,
  });
});

test("getAnagramMapping", () => {
  expect(getAnagramMapping("abc", "abc")).toStrictEqual([0, 1, 2]);
  expect(getAnagramMapping("abc", "bac")).toStrictEqual([1, 0, 2]);
  expect(getAnagramMapping("a b c", "bac")).toStrictEqual([
    1,
    undefined,
    0,
    undefined,
    2,
  ]);
});
