import {observable, action, runInAction, computed} from 'mobx';
import {min, max, groupBy, throttle} from 'lodash';
import * as anagram from 'src/anagram';

import {parseSearch} from 'src/utility';
import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';

import {partitionArray, getNumberOfCPUs} from 'src/utility';

const AnagramWorker = require('./anagram.worker');

export enum AppState {
  none = 'none',
  fetchingSubanagrams = 'fetchingSubanagrms',
  search = 'search',
  done = 'done',
  anagramViewer = 'anagramViewer',
}

type VoidFunction = () => void;

export class AnagramState {
  @observable queryStatus: RequestStatus = RequestStatus.none;
  @observable appState: string = AppState.none;

  @observable query: string = '';
  @observable queryToUse: string = '';
  @observable exludedWordsToUse: string = '';
  @observable cleanedQuery: string = '';
  @observable cleanedQueryWithSpaces: string = '';

  @observable.shallow subanagrams: anagram.Word[] = [];
  @observable.shallow dictionaries: Dictionary[] = [{"id":"en","name":"English"},{"id":"de","name":"German"}];
  @observable selectedDictionaries: string = 'en';

  @observable counter: number = 0;
  @observable numberOfPossibilitiesChecked: number = 0;
  @observable.shallow _expandedSolutions: anagram.SimpleWord[][] = [];
  @observable.shallow solvedSubanagrams: number[] = [];
  @observable.shallow unsolvedSubanagrams: number[] = [];
  @observable.shallow currentSubanagrams: number[] = [];

  @observable modalAnagram: string = 'roams again';
  @observable modalWord: string = 'anagrams io';
  @observable showModal: boolean = false;

  @observable workers: Worker[] = [];
  @observable finished: boolean = false;

  @observable width: number = 1;

  // options
  @observable groupByNumberOfWords: boolean = true;
  @observable showOptions: boolean = false;
  @observable showExclude: boolean = false;
  @observable allowOnlyOneSmallWord: boolean = false;
  @observable excludeWords: string = '';

  // caches
  groupedSpecialCache: {[key: string]: anagram.GroupedWordsDict} = {};
  groupedAnagramsCache: anagram.GroupedWordsDict = {};

  updateState: _.Cancelable & VoidFunction;

  constructor() {
    this.setQuery = this.setQuery.bind(this);
    this.setDictionary = this.setDictionary.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveAnagram = this.saveAnagram.bind(this);
    this.requestAnagram = this.requestAnagram.bind(this);
    // options
    this.toggleGroupByNumberOfWords = this.toggleGroupByNumberOfWords.bind(this);
    this.toggleShowOptions = this.toggleShowOptions.bind(this);
    this.toggleExclude = this.toggleExclude.bind(this);
    this.toggleAllowOnlyOneSmallWord = this.toggleAllowOnlyOneSmallWord.bind(this);
    this.setExcludeWords = this.setExcludeWords.bind(this);

    this.init();
  }

  get isExcludeInputValid() {
    const excludedWordsClean = anagram.sanitizeQuery(this.excludeWords);
    const cleanedQuery = anagram.sanitizeQuery(this.query);

    const set1 = anagram.stringToBinary(excludedWordsClean);
    const set2 = anagram.stringToBinary(cleanedQuery);

    return anagram.isBinarySubset(set1, set2);
  }

  @computed
  get excludedWordsAsSimpleWords(): anagram.SimpleWord[] {
    const excludedWordsCleaned = this.exludedWordsToUse.split(' ').map(word => {
      return anagram.sanitizeQuery(word);
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
    const expanded = this._expandedSolutions.map(s => {
      return [...s, ...excludedWords];
    });

    if (this.allowOnlyOneSmallWord) {
      return expanded.filter(w => {
        return w.filter(word => word.word.length < 4).length <= 1;
      });
    }

    return expanded;
  }

  @action
  setWidth(width: number) {
    this.width = width;
  }

  @computed
  get getColumnWidth() {
    const MIN_COLUMN_WIDTH = Math.max(250, this.cleanedQuery.length * 14.5);

    const numberOfColumns = Math.max(Math.floor(this.width / MIN_COLUMN_WIDTH), 1);
    const columnWidth = this.width / numberOfColumns;

    return {
      columnWidth,
      numberOfColumns,
    };

  }

  @computed
  get showInfoArea() {
    return this.appState === AppState.search || this.appState === AppState.fetchingSubanagrams || this.appState === AppState.done;
  }

  get isDone() {
    return this.appState === AppState.done;
  }

  @computed
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

  @computed
  get noResultsYet() {
    return this.appState === AppState.fetchingSubanagrams || (this.appState === AppState.search && this._expandedSolutions.length === 0);
  }

  @computed
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

  @computed
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

  @computed
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
      const otherGroups = [,
        {
          name: 'Anagrams With No Own Solution',
          group: partitionArray(anagramsWithNoOwnSolution,  numberOfColumns),
        },
        {
          name: 'Subanagrams Without Solution',
          group: partitionArray(anagramsWithoutSolution, numberOfColumns),
        }
      ].filter(d => d.group.length > 0);

      groups = [...groups, ...otherGroups];
    }

    return groups;
  }

  async init() {
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

    const result = await getDictionaries();
    runInAction(() => {
      this.dictionaries = result.data.dictionaries;
    });
  }

  @action
  setExcludeWords(excludeWords) {
    this.excludeWords = excludeWords;
  }

  @action
  setQuery(query) {
    this.query = query;
  }

  @action
  setDictionary(value) {
    this.selectedDictionaries = value;
    if (this.subanagrams.length > 0 && this.query.length > 0) {
      this.appState = AppState.search;
      this.requestAnagram();
    }
  }

  @action
  openModal(anagram: string, word: string) {
    this.showModal = true;
    this.modalAnagram = anagram;
    this.modalWord = word;
  }

  @action
  closeModal() {
    this.showModal = false;
  }
  @action
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
    // make sure there is one core left
    const useCPUs = Math.max(numberOfCPUs - 1, 1);
    console.log(`${numberOfCPUs} cores available. Using ${useCPUs}.`)
    this.workers = Array(useCPUs).fill(0).map((i) => {
      const worker = new AnagramWorker();
      const eventListener = message => {
        if (message.data === 'finish') {

          runInAction(() => {
            this.solvedSubanagrams.push(message.data.index + 1);
            this.currentSubanagrams = this.currentSubanagrams.filter(n => {
              return n !== message.data.index;
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
        this.updateState();
      };
      worker.addEventListener('message', eventListener);
      return worker;
    });


    const cleanedQuery = anagram.sanitizeQuery(this.query);
    const cleanedQueryWithSpaces = anagram.sanitizeQuery(this.query, false);

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

    const excludedWordsCleaned = this.showExclude ? anagram.sanitizeQuery(this.excludeWords) : '';
    // remove excluded words from cleanedQuery
    const cleanedQuerySet = anagram.stringToBinary(cleanedQuery);
    const excludedWordsSet = anagram.stringToBinary(excludedWordsCleaned);
    const excludedRemoved = anagram.removeBinary(cleanedQuerySet, excludedWordsSet);
    this.queryToUse = anagram.binaryToString(excludedRemoved);

    const result = await getSubAnagrams(this.queryToUse, this.selectedDictionaries);
    const {anagrams: subanagrams} = result.data;

    runInAction(() => {
      this.appState = AppState.search;
      this.unsolvedSubanagrams = subanagrams.map((_, i) => i);
      this.subanagrams = subanagrams;
      this.queryStatus = RequestStatus.loading;
      this.cleanedQuery = cleanedQuery;
      this.cleanedQueryWithSpaces = cleanedQueryWithSpaces;
      this.exludedWordsToUse = excludedWordsCleaned;
    });

    if (subanagrams.length === 0) {
      runInAction(() => {
        this.appState = AppState.done;
      });
      return;
    }

    const startNextWorker = (index) => {
      if (this.unsolvedSubanagrams.length === 0) {
        return;
      }

      const nextWorkerIndex = this.unsolvedSubanagrams.shift();

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
    @action
    toggleGroupByNumberOfWords() {
      this.groupByNumberOfWords = !this.groupByNumberOfWords;
    }

    @action
    toggleShowOptions() {
      this.showOptions = !this.showOptions;
    }

    @action
    toggleExclude() {
      this.showExclude = !this.showExclude;
    }

    @action
    toggleAllowOnlyOneSmallWord() {
      this.allowOnlyOneSmallWord = !this.allowOnlyOneSmallWord;
      // we need to reset the cache
      this.groupedAnagramsCache = {};
      this.groupedSpecialCache = {};
    }


}

const store = new AnagramState();
export default store;
