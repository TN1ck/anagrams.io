import {observable, action, runInAction, computed, makeObservable} from 'mobx';
import {min, max, groupBy, throttle} from 'lodash';
import * as anagram from 'src/anagram';

import {parseSearch} from 'src/utility';

import {partitionArray, getNumberOfCPUs} from 'src/utility';
import { DICTIONARIES, Dictionary, LetterMapping } from './dictionaries';

export enum AppState {
  none = 'none',
  fetchingSubanagrams = 'fetchingSubanagrms',
  search = 'search',
  done = 'done',
  anagramViewer = 'anagramViewer',
}

type VoidFunction = () => void;

export async function getSubAnagrams(query: string, dictionary: Dictionary, mapping: Record<string, string>): Promise<{data: {success: boolean, anagrams: anagram.Word[]}}>  {
  const words = await fetch(dictionary.file)
  .then(response => response.text())
  .then((data) => {
    return data.split('\n');
  })
  const wordsBinary = words.map(w => anagram.stringToWord(anagram.mapLetters(w, mapping)))
  const subanagrams = anagram.findSubAnagrams(query, wordsBinary);
  const sortedSubAnagrams = anagram.findSortedAndGroupedSubAnagrams(subanagrams)

  return {data: {success: true, anagrams: sortedSubAnagrams}};
}

function letterMappingToDictionary(letterMappings: LetterMapping[]): Record<string, string> {
  const result: Record<string, string> = {};
  letterMappings.forEach(({letter, mapping, active}) => {
    if (active) {
      result[letter] = mapping;
    }
  });
  return result;
}

export class AnagramState {
  appState: string = AppState.none;

  query: string = '';
  queryToUse: string = '';
  exludedWordsToUse: string = '';
  cleanedQuery: string = '';
  cleanedQueryWithSpaces: string = '';

  subanagrams: anagram.Word[] = [];
  dictionaries: Dictionary[] = DICTIONARIES;
  selectedDictionary: string = DICTIONARIES[0].id;
  dictionaryMapping: LetterMapping[] = DICTIONARIES[0].mapping;

  counter: number = 0;
  numberOfPossibilitiesChecked: number = 0;
  _expandedSolutions: anagram.SimpleWord[][] = [];
  solvedSubanagrams: number[] = [];
  unsolvedSubanagrams: number[] = [];
  currentSubanagrams: number[] = [];

  modalAnagram: string = 'roams again';
  modalWord: string = 'anagrams io';
  showModal: boolean = false;

  workers: Worker[] = [];
  finished: boolean = false;

  width: number = 1;

  // options
  groupByNumberOfWords: boolean = true;
  showOptions: boolean = false;
  showExclude: boolean = false;
  allowOnlyOneSmallWord: boolean = false;
  excludeWords: string = '';

  // caches
  groupedSpecialCache: {[key: string]: anagram.GroupedWordsDict} = {};
  groupedAnagramsCache: anagram.GroupedWordsDict = {};

  updateState: _.Cancelable & VoidFunction | null;

  constructor() {
    this.updateState = null;
    makeObservable(this, {
      appState: observable,
      query: observable,
      queryToUse: observable,
      exludedWordsToUse: observable,
      cleanedQuery: observable,
      cleanedQueryWithSpaces: observable,
      selectedDictionary: observable,
      counter: observable,
      numberOfPossibilitiesChecked: observable,
      modalAnagram: observable,
      modalWord: observable,
      showModal: observable,
      workers: observable,
      finished: observable,
      width: observable,
      groupByNumberOfWords: observable,
      showOptions: observable,
      showExclude: observable,
      allowOnlyOneSmallWord: observable,
      excludeWords: observable,
      subanagrams: observable.shallow,
      dictionaries: observable.shallow,
      _expandedSolutions: observable.shallow,
      solvedSubanagrams: observable.shallow,
      unsolvedSubanagrams: observable.shallow,
      currentSubanagrams: observable.shallow,

      dictionaryMapping: observable,

      setWidth: action,
      setShareWords: action,
      setExcludeWords: action,
      setQuery: action,
      setDictionary: action,
      openModal: action,
      closeModal: action,
      saveAnagram: action,
      toggleGroupByNumberOfWords: action,
      toggleShowOptions: action,
      toggleExclude: action,
      toggleAllowOnlyOneSmallWord: action,
      setDictionaryMapping: action,

      excludedWordsAsSimpleWords: computed,
      getColumnWidth: computed,
      showInfoArea: computed,
      progress: computed,
      noResultsYet: computed,
      stats: computed,
      subAnagramsWithExcludedWords: computed,
      grouped: computed,
  })

    this.setQuery = this.setQuery.bind(this);
    this.setDictionary = this.setDictionary.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveAnagram = this.saveAnagram.bind(this);
    this.requestAnagram = this.requestAnagram.bind(this);
    this.setShareWords = this.setShareWords.bind(this);
    // options
    this.toggleGroupByNumberOfWords = this.toggleGroupByNumberOfWords.bind(this);
    this.toggleShowOptions = this.toggleShowOptions.bind(this);
    this.toggleExclude = this.toggleExclude.bind(this);
    this.toggleAllowOnlyOneSmallWord = this.toggleAllowOnlyOneSmallWord.bind(this);
    this.setExcludeWords = this.setExcludeWords.bind(this);

    this.init();
  }

  get isExcludeInputValid() {
    const excludedWordsClean = anagram.sanitizeQuery(this.excludeWords, letterMappingToDictionary(this.dictionaryMapping));
    const cleanedQuery = anagram.sanitizeQuery(this.query, letterMappingToDictionary(this.dictionaryMapping));

    const set1 = anagram.stringToBinary(excludedWordsClean);
    const set2 = anagram.stringToBinary(cleanedQuery);

    return anagram.isBinarySubset(set1, set2);
  }

  get excludedWordsAsSimpleWords(): anagram.SimpleWord[] {
    const excludedWordsCleaned = this.exludedWordsToUse.split(' ').map(word => {
      return anagram.sanitizeQuery(word, letterMappingToDictionary(this.dictionaryMapping));
    }).filter(d => d !== '');
    return excludedWordsCleaned.map((s, i) => {
      const w: anagram.SimpleWord = {
        set: anagram.stringToBinary(s),
        index: this.subanagrams.length + i,
        length: s.length,
        word: s
      }
      return w;
    })
  }

  get expandedSolutions() {

    const excludedWords = this.excludedWordsAsSimpleWords;
    // const expanded = this._expandedSolutions;
    const expanded = excludedWords.length > 0 ? this._expandedSolutions.map(s => {
      return [...s, ...excludedWords];
    }) : this._expandedSolutions;

    if (this.allowOnlyOneSmallWord) {
      return expanded.filter(w => {
        return w.filter(word => word.word.length < 4).length <= 1;
      });
    }

    return expanded;
  }

  setWidth(width: number) {
    this.width = width;
  }

  get getColumnWidth() {
    const MIN_COLUMN_WIDTH = Math.max(250, this.cleanedQuery.length * 14.5);

    const numberOfColumns = Math.max(Math.floor(this.width / MIN_COLUMN_WIDTH), 1);
    const columnWidth = this.width / numberOfColumns;

    return {
      columnWidth,
      numberOfColumns,
    };

  }

  get showInfoArea() {
    return this.appState === AppState.search || this.appState === AppState.fetchingSubanagrams || this.appState === AppState.done;
  }

  get isDone() {
    return this.appState === AppState.done;
  }

  get progress(): number {
    const solvedSubanagrams = this.solvedSubanagrams;
    const numberOfSolvedSubanagrams = solvedSubanagrams.length;
    const numberOfAnagrams = this.subanagrams.length;

    if (this.appState === AppState.fetchingSubanagrams) {
      return 0;
    }

    if (numberOfAnagrams === 0) {
      return 100;
    }

    const progress = Math.ceil((numberOfSolvedSubanagrams / numberOfAnagrams) * 100);
    return progress;
  }

  get noResultsYet() {
    return this.appState === AppState.fetchingSubanagrams || (this.appState === AppState.search && this._expandedSolutions.length === 0);
  }

  get stats() {
    const solutions = this.expandedSolutions;
    const numberOfWordsPerSolution = solutions.map(s => s.length);
    const numberOfWords = numberOfWordsPerSolution.reduce((a, b) => a + b, 0);
    const averageNumberOfWords = (numberOfWords / solutions.length);
    const minNumberOfWords = min(numberOfWordsPerSolution);
    const maxNumberOfWords = max(numberOfWordsPerSolution);
    const wordStats = {
      average: averageNumberOfWords,
      min: minNumberOfWords,
      max: maxNumberOfWords,
    };
    return wordStats;
  }

  get subAnagramsWithExcludedWords() {
    const excludedWords: anagram.Word[] = this.excludedWordsAsSimpleWords.map(({word, set, index, length}) => {
      return {
        index,
        set,
        words: [word],
        length,
      }
    })
    return [...this.subanagrams, ...excludedWords];
  }

  get groupedAnagrams() {
    const oldCache = this.groupedAnagramsCache;
    const groupedAnagrams = anagram.groupWordsByStartWord(
      this.subAnagramsWithExcludedWords,
      this.expandedSolutions,
      oldCache,
    );
    this.groupedAnagramsCache = groupedAnagrams;
    return Object.values(groupedAnagrams);
  }

  get groupedSpecial() {

    const groupedByLength = groupBy(this.expandedSolutions, a => {
      return a.length;
    });
    const groupKeys = Object.keys(groupedByLength)
    const {
      numberOfColumns,
    } = this.getColumnWidth;

    const oldCache = this.groupedSpecialCache;
    const newCache: {[key: string]: anagram.GroupedWordsDict} = {};

    const result = groupKeys.map((key) => {
      const anagrams = groupedByLength[key];
      const groupedAnagramsDict = anagram.groupWordsByStartWord(
        this.subAnagramsWithExcludedWords,
        anagrams,
        oldCache[key],
        0,
      );
      newCache[key] = groupedAnagramsDict;
      const groupedAnagrams = Object.values(groupedAnagramsDict).filter(c => c.list.length > 0)
      return {
        name: `Anagrams with ${anagrams[0].length} words`,
        group: partitionArray(groupedAnagrams, numberOfColumns),
      };
    });

    this.groupedSpecialCache = newCache;

    return result;

  }

  get groupedNormal() {

    const groupedAnagrams = this.groupedAnagrams;
    const anagramsWithSolution = groupedAnagrams.filter(ag => ag.list.length > 0);

    const {
      numberOfColumns,
    } = this.getColumnWidth;

    const groups = [
      {
        name: 'Anagrams',
        group: partitionArray(anagramsWithSolution, numberOfColumns),
      }
    ];

    return groups;
  }

  get grouped(): Array<{
    name: string,
    group: anagram.GroupedAnagramSolutions[][],
  }> {
    let groups: {
      name: string;
      group: anagram.GroupedWords[][];
    }[] = [];
    if (this.groupByNumberOfWords) {
      groups = this.groupedSpecial;
    } else {
      groups = this.groupedNormal;
    }

    if (this.isDone) {
      const groupedAnagrams = this.groupedAnagrams;
      const anagramsWithoutSolution = groupedAnagrams.filter(ag => ag.counter === 0);
      const anagramsWithNoOwnSolution = groupedAnagrams.filter(
        ag => ag.counter > 0 && ag.list.length === 0
      );
      const numberOfColumns = this.getColumnWidth.numberOfColumns;
      const otherGroups = [
        // {
        //   name: 'Anagrams With No Own Solution',
        //   group: partitionArray(anagramsWithNoOwnSolution,  numberOfColumns),
        // },
        {
          name: 'Subanagrams Without Solution',
          group: partitionArray(anagramsWithoutSolution, numberOfColumns),
        }
      ].filter(d => d.group.length > 0);

      groups = [...groups, ...otherGroups];
    }

    return groups;
  }

  setShareWords() {
    if (typeof window !== 'undefined') {
      const location = window.location;
      const search = location.search;
      const parsedSearch = parseSearch(search);

      if (parsedSearch.anagram && parsedSearch.word) {
        runInAction(() => {
          this.modalWord = parsedSearch.word;
          this.modalAnagram = parsedSearch.anagram;
          this.appState = AppState.anagramViewer;
        });
      }
    }
  }

  async init() {
    this.setShareWords();
  }

  setExcludeWords(excludeWords: string) {
    this.excludeWords = excludeWords;
  }

  setQuery(query: string) {
    this.query = query;
  }

  setDictionaryMapping(mapping: LetterMapping[]) {
    this.dictionaryMapping = mapping;
  }

  setDictionary(value: string) {
    this.selectedDictionary = value;
    this.dictionaryMapping = DICTIONARIES.find(d => d.id === value)!.mapping;
    if (this.subanagrams.length > 0 && this.query.length > 0) {
      this.appState = AppState.search;
      this.requestAnagram();
    }
  }

  openModal(anagram: string, word: string) {
    this.showModal = true;
    this.modalAnagram = anagram;
    this.modalWord = word;
  }

  closeModal() {
    this.showModal = false;
  }
  saveAnagram(anagram: string, word: string) {
    this.modalAnagram = anagram;
    this.modalWord = word;
  }

  async requestAnagram() {

    this.workers.forEach(w => {
      w.terminate();
    });

    const currentTempState: anagram.AnagramGeneratorStepSerialized = {
      numberOfPossibilitiesChecked: 0,
      solutions: [],
    };

    if (this.updateState) {
      this.updateState.cancel();
    }

    this.updateState = throttle(() => {
      if (this.finished) {
        return;
      }

      runInAction(() => {
        this.numberOfPossibilitiesChecked += currentTempState.numberOfPossibilitiesChecked;
        const newExpandedSolutions = anagram.expandSolutions(
          currentTempState.solutions, subanagrams,
        );
        this._expandedSolutions.push(...newExpandedSolutions);
      });

      currentTempState.numberOfPossibilitiesChecked = 0;
      currentTempState.solutions = [];


    }, 100);

    const numberOfCPUs = getNumberOfCPUs();
    // Let's take half of it, so we don't melt phones.
    const useCPUs = Math.max(numberOfCPUs / 2, 1);
    console.log(`${numberOfCPUs} cores available. Using ${useCPUs}.`)
    this.workers = Array(useCPUs).fill(0).map((i) => {
      const worker = new Worker(new URL('./anagram.worker.ts', import.meta.url), {
        type: 'module',
      })
      const eventListener = (message: MessageEvent<anagram.AnagramGeneratorStepSerialized | 'finish'>) => {
        if (message.data === 'finish') {
          runInAction(() => {
            this.solvedSubanagrams.push(i);
            this.currentSubanagrams = this.currentSubanagrams.filter(n => {
              return n !== i;
            });
          });

          // stop!
          if (this.solvedSubanagrams.length === subanagrams.length) {
            runInAction(() => {
              this.appState = AppState.done;
            });
            return;
          }
          startNextWorker(i);
          return;
        }
        const newState: anagram.AnagramGeneratorStepSerialized = message.data;
        currentTempState.numberOfPossibilitiesChecked += newState.numberOfPossibilitiesChecked;
        currentTempState.solutions.push(...newState.solutions);
        if (this.updateState) {
          this.updateState();
        }
      };
      worker.addEventListener('message', eventListener);
      return worker;
    });


    const mapping = letterMappingToDictionary(this.dictionaryMapping);
    const cleanedQuery = anagram.sanitizeQuery(this.query, mapping);
    const cleanedQueryWithSpaces = anagram.sanitizeQuery(this.query, letterMappingToDictionary(this.dictionaryMapping), false);

    if (cleanedQuery.length === 0) {
      return;
    }

    if (this.showExclude && !this.isExcludeInputValid) {
      return;
    }

    const clear = () => {
      this.appState = AppState.fetchingSubanagrams;
      this._expandedSolutions = [];
      this.finished = false;
      this.solvedSubanagrams = [];
      this.counter = 0;
      this.currentSubanagrams = [];
      this.unsolvedSubanagrams = [];
      this.groupedAnagramsCache = {};
      this.groupedSpecialCache = {};
      this.subanagrams = [];
      this.exludedWordsToUse = '';
    };

    clear();
    runInAction(clear);

    const excludedWordsCleaned = this.showExclude ? anagram.sanitizeQuery(this.excludeWords, letterMappingToDictionary(this.dictionaryMapping)) : '';
    // remove excluded words from cleanedQuery
    const cleanedQuerySet = anagram.stringToBinary(cleanedQuery);
    const excludedWordsSet = anagram.stringToBinary(excludedWordsCleaned);
    const excludedRemoved = anagram.removeBinary(cleanedQuerySet, excludedWordsSet);
    this.queryToUse = anagram.binaryToString(excludedRemoved);
    const dictionary = DICTIONARIES.find(d => d.id === this.selectedDictionary)!;

    const result = await getSubAnagrams(this.queryToUse, dictionary, mapping);
    const {anagrams: subanagrams} = result.data;

    runInAction(() => {
      this.appState = AppState.search;
      this.unsolvedSubanagrams = subanagrams.map((_, i) => i);
      this.subanagrams = subanagrams;
      this.cleanedQuery = cleanedQuery;
      this.cleanedQueryWithSpaces = cleanedQueryWithSpaces;
      this.exludedWordsToUse = this.showExclude ? anagram.sanitizeQuery(this.excludeWords, letterMappingToDictionary(this.dictionaryMapping), false) : '';
    });

    if (subanagrams.length === 0) {
      runInAction(() => {
        this.appState = AppState.done;
      });
      return;
    }

    const startNextWorker = (index: number) => {
      if (this.unsolvedSubanagrams.length === 0) {
        return;
      }

      const nextWorkerIndex = this.unsolvedSubanagrams.shift() as number;

      runInAction(() => {
        this.currentSubanagrams.push(nextWorkerIndex);
      });

      const worker = this.workers[index];
      worker.postMessage({
        type: 'start',
        query: this.queryToUse,
        subanagram: subanagrams[nextWorkerIndex],
        nextWorkerIndex,
        subanagrams,
      });

    };

    this.workers.forEach((_, index) => {
      startNextWorker(index);
    })

  }

    // options stuff

    toggleGroupByNumberOfWords() {
      this.groupByNumberOfWords = !this.groupByNumberOfWords;
    }


    toggleShowOptions() {
      this.showOptions = !this.showOptions;
    }


    toggleExclude() {
      this.showExclude = !this.showExclude;
    }


    toggleAllowOnlyOneSmallWord() {
      this.allowOnlyOneSmallWord = !this.allowOnlyOneSmallWord;
      // we need to reset the cache
      this.groupedAnagramsCache = {};
      this.groupedSpecialCache = {};
    }


}

const store = new AnagramState();
export default store;
