import {observable, action, flow, computed} from 'mobx';
import {min, max, groupBy} from 'lodash';
import * as anagram from 'src/anagram';

import {parseSearch} from 'src/utility';
import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';

import {partitionArray} from 'src/utility';

const AnagramWorker = require('./anagram.worker');

export class AnagramState {
  @observable queryStatus: RequestStatus = RequestStatus.none;
  @observable appState: string = 'none';

  @observable query: string = '';
  @observable cleanedQuery: string = '';
  @observable cleanedQueryWithSpaces: string = '';

  @observable subanagrams: anagram.IndexedWord[] = [];
  @observable dictionaries: Dictionary[] = [];
  @observable selectedDictionaries: string = 'en';

  @observable anagramIteratorState: anagram.SerializedAnagramIteratorState = {
    counter: 0,
    numberOfPossibilitiesChecked: 0,
    unsolvedSubanagrams: [],
    solvedSubanagrams: [],
    currentSubanagrams: [],
    solutions: [],
  };

  @observable modalAnagram: string = '';
  @observable modalWord: string = '';
  @observable showModal: boolean = false;

  @observable worker: Worker;
  @observable finished: boolean = false;

  @observable width: number = 1;

  @observable groupByNumberOfWords: boolean = false;

  constructor() {
    this.setQuery = this.setQuery.bind(this);
    this.setDictionary = this.setDictionary.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveAnagram = this.saveAnagram.bind(this);
    this.requestAnagram = this.requestAnagram.bind(this);
    this.toggleGroupByNumberOfWords = this.toggleGroupByNumberOfWords.bind(this);
    this.init();
  }

  @action
  setWidth(width: number) {
    this.width = width;
  }

  @computed
  get getColumnWidth() {
    const MIN_COLUMN_WIDTH = Math.max(250, this.query.length * 14.5);

    const numberOfColumns = Math.max(Math.floor(this.width / MIN_COLUMN_WIDTH), 1);
    const columnWidth = this.width / numberOfColumns;

    return {
      columnWidth,
      numberOfColumns,
    };

  }

  @computed
  get isDone() {
    return this.anagramIteratorState.unsolvedSubanagrams.length === 0
      && this.anagramIteratorState.solvedSubanagrams.length > 0
      && this.anagramIteratorState.solutions.length > 0;
  }

  @computed
  get progress(): number {
    const {
      solvedSubanagrams,
    } = this.anagramIteratorState;
    const numberOfSolvedSubanagrams = solvedSubanagrams.length;
    const numberOfAnagrams = this.subanagrams.length;

    const progress = Math.ceil(((numberOfSolvedSubanagrams)/ numberOfAnagrams) * 100);
    return progress;
  }

  @computed
  get stats() {
    const {solutions} = this.anagramIteratorState;
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
  get groupedAnagrams() {
    const groupedAnagrams = anagram.groupAnagramsByStartWord(
      this.subanagrams,
      this.anagramIteratorState.solutions,
    );
    return groupedAnagrams;
  }

  @computed
  get groupedSpecial() {

    const groupedByLength = groupBy(this.anagramIteratorState.solutions, a => {
      return a.length;
    });
    const groups = Object.values(groupedByLength)
    const {
      numberOfColumns,
    } = this.getColumnWidth;

    return groups.map((anagrams) => {
      const groupedAnagrams = anagram.groupAnagramsByStartWord(
        this.subanagrams,
        anagrams,
      ).filter(c => c.list.length > 0);
      return {
        name: `Anagrams with ${anagrams[0].length} words`,
        group: partitionArray(groupedAnagrams, numberOfColumns),
      };
    });

  }

  @action
  toggleGroupByNumberOfWords() {
    this.groupByNumberOfWords = !this.groupByNumberOfWords;
  }

  @computed
  get groupedNormal() {

    const groupedAnagrams = this.groupedAnagrams;
    const anagramsWithSolution = groupedAnagrams.filter(ag => ag.list.length > 0);

    const {
      numberOfColumns,
    } = this.getColumnWidth;

    const groups = [
      {
        name: null,
        group: partitionArray(anagramsWithSolution, numberOfColumns),
      }
    ];

    return groups;
  }

  @computed
  get grouped() {
    let groups = [];
    if (this.groupByNumberOfWords) {
      groups = this.groupedSpecial;
    } else {
      groups = this.groupedNormal;
    }

    if (this.isDone) {
      const groupedAnagrams = this.groupedAnagrams;
      const anagramsWithoutSolution = groupedAnagrams.filter(ag => ag.counter === 0);
      const anagramsWithNoOwnSolution = groupedAnagrams.filter(ag => ag.counter > 0 && ag.list.length === 0);
      const numberOfColumns = this.getColumnWidth.numberOfColumns;
      groups.push(
        {
          name: 'Anagrams With No Own Solution',
          group: partitionArray(anagramsWithNoOwnSolution,  numberOfColumns),
        },
        {
          name: 'Anagrams Without Solution',
          group: partitionArray(anagramsWithoutSolution, numberOfColumns),
        }
      );
    }

    return groups;
  }

  init = flow(function* () {
    const location = window.location;
    const search = location.search;
    const parsedSearch = parseSearch(search);

    if (parsedSearch.anagram && parsedSearch.word) {
      this.modalWord = parsedSearch.word;
      this.modalAnagram = parsedSearch.anagram;
      this.appState = 'anagramViewer';
    }

    const result = yield getDictionaries();
    this.dictionaries = result.data.dictionaries;
  })

  @action
  setQuery(query) {
    this.query = query;
  }

  @action
  setDictionary(value) {
    this.selectedDictionaries = value;
    if (this.subanagrams.length > 0 && this.query.length > 0) {
      this.appState = 'search';
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

  requestAnagram = flow(function* () {

    if (this.worker) {
      this.worker.terminate();
    }

    this.appState = 'search';
    this.finished = false;

    const cleanedQuery = anagram.sanitizeQuery(this.query);
    const cleanedQueryWithSpaces = anagram.sanitizeQuery(this.query, false);

    if (cleanedQuery.length === 0) {
      return;
    }

    const result = yield getSubAnagrams(cleanedQuery, this.selectedDictionaries);
    const {anagrams: subanagrams} = result.data;

    const initialAnagramIteratorState = anagram.serializeAnagramIteratorStateFactor(
      anagram.anagramIteratorStateFactory()
    );

    initialAnagramIteratorState.unsolvedSubanagrams = subanagrams.map((_, i) => i);

    this.subanagrams = subanagrams;
    this.queryStatus = RequestStatus.loading;
    this.cleanedQuery = cleanedQuery;
    this.cleanedQueryWithSpaces = cleanedQueryWithSpaces;
    this.anagramIteratorState = initialAnagramIteratorState;

    const updateState = (state: anagram.AnagramGeneratorStepSerialized) => {
      if (this.finished) {
        return;
      }
      this.anagramIteratorState.solutions.push(...state.solutions);
      this.anagramIteratorState.numberOfPossibilitiesChecked += state.numberOfPossibilitiesChecked;
      (window as any).applicationState = this;
    };

    const startNextWorker = () => {
      if (this.anagramIteratorState.unsolvedSubanagrams.length === 0) {
        return;
      }

      const nextWorkerIndex = this.anagramIteratorState.unsolvedSubanagrams.shift();
      this.anagramIteratorState.currentSubanagrams.push(nextWorkerIndex);
      const worker = new AnagramWorker();
      this.worker = worker;

      worker.addEventListener('message', message => {
        if (message.data === 'finish') {

          this.anagramIteratorState.solvedSubanagrams.push(nextWorkerIndex);
          this.anagramIteratorState.currentSubanagrams.shift();

          worker.terminate();
          // stop!
          if (this.anagramIteratorState.solvedSubanagrams.length === subanagrams.length) {
            return;
          }
          startNextWorker();
          return;
        }
        const newState: anagram.AnagramGeneratorStepSerialized = message.data;
        updateState(newState);
      });

      worker.postMessage({
        type: 'start',
        query: cleanedQuery,
        subanagram: subanagrams[nextWorkerIndex],
        subanagrams,
      });

    };

    startNextWorker();

  })

}

const store = new AnagramState();
export default store;
