import {observable, action, runInAction, flow} from 'mobx';
import * as anagram from 'src/anagram';

import {parseSearch} from 'src/utility';
import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';

const AnagramWorker = require('./anagram.worker');

export class AnagramState {
  @observable queryStatus: RequestStatus = RequestStatus.none;
  @observable appState: string = 'search';

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

  constructor() {
    this.setQuery = this.setQuery.bind(this);
    this.setDictionary = this.setDictionary.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveAnagram = this.saveAnagram.bind(this);
    this.requestAnagram = this.requestAnagram.bind(this);
    this.init();
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

  requestAnagram = flow((function* () {
    console.log('reequest anagram', this.query);

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
        console.log(message);
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
