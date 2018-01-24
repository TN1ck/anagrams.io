import * as React from 'react';
import {throttle, min, max} from 'lodash';

import Footer from 'src/components/Footer';
import Form from 'src/components/Form';
import Header from 'src/components/Header';
import InnerContainer from 'src/components/InnerContainer';
import Input from 'src/components/Input';
import SearchButton from 'src/components/SearchButton';
import SubTitle from 'src/components/SubTitle';
import Title from 'src/components/Title';
import HeaderContainer from 'src/components/HeaderContainer';
import LoadingBar from 'src/components/LoadingBar';
import AnagramVisualizer from 'src/components/AnagramVisualizer';
import * as ReactModal from 'react-modal';
ReactModal.setAppElement('body');

import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';
import {parseSearch} from 'src/utility';

import * as anagram from 'src/anagram';

import AnagramResults from './AnagramResults';
import {
  // Strong,
  SmallButton,
} from './components';

const AnagramWorker = require('../../anagram.worker');

// import mockState from 'src/assets/anagramPageMock';
// // const TESTING = true;

class ActiveSubanagrams extends React.Component<{
  currentSubanagrams: number[];
  subanagrams: anagram.IndexedWord[];
}> {
  render() {
    const {
      currentSubanagrams,
      subanagrams,
    } = this.props;

    if (currentSubanagrams.length === 0) {
      return null;
    }

    return (
      <span>
        {`Checking: ${currentSubanagrams.map(i => subanagrams[i].word.word).join(', ')}`}
      </span>
    );
  }
}

class AnagramInfoArea extends React.Component<{
  anagramIteratorState: anagram.SerializedAnagramIteratorState;
  subanagrams: anagram.IndexedWord[];
  query: string;
  share: (anagram: string, word: string) => any;
}> {
  render() {
    const {
      anagramIteratorState,
      subanagrams,
      query,
    } = this.props;

    if (!anagramIteratorState) {
      return null;
    }

    const {
      solvedSubanagrams,
      currentSubanagrams,
      // numberOfPossibilitiesChecked,
      unsolvedSubanagrams,
      solutions,
    } = anagramIteratorState;

    const isDone = unsolvedSubanagrams.length === 0;
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

    const numberOfSolvedSubanagrams = solvedSubanagrams.length;
    const numberOfAnagrams = subanagrams.length;

    const progress = Math.ceil(((numberOfSolvedSubanagrams)/ numberOfAnagrams) * 100);
    
    return (
      <div>
        <SubTitle>
          {`Found `}<strong>{`${solutions.length}`}</strong>{` solutions. `}
        </SubTitle>
        <LoadingBar progress={progress}>
          <ActiveSubanagrams
            subanagrams={subanagrams}
            currentSubanagrams={currentSubanagrams}
          />
          {' '}
          <div style={{position: 'absolute', right: 10, top: 10}}>
            {`${progress} %`}
          </div>
        </LoadingBar>
        <br />
        <AnagramResults
          share={this.props.share}
          subanagrams={subanagrams}
          anagramIteratorState={anagramIteratorState}
          isDone={isDone}
          wordStats={wordStats}
          query={query}
        />
      </div>
    );
  }
}

interface AnagramaniaHeaderProps {
    onSubmit: any;
    onQueryChange: any;
    onSelectChange: any;
    dictionaries: Dictionary[];
    selectedDictionaries: string;
};

class AnagramaniaHeader extends React.Component<AnagramaniaHeaderProps> {
  input: HTMLInputElement;
  shouldComponentUpdate(newProps: AnagramaniaHeaderProps) {
    if (
      this.props.selectedDictionaries !== newProps.selectedDictionaries ||
      this.props.dictionaries !== newProps.dictionaries
    ) {
      return true;
    }
    return false;
  }
  setInput(dom: HTMLInputElement) {
    this.input = dom;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    const {
      dictionaries,
      selectedDictionaries,
      onQueryChange,
      onSubmit,
      onSelectChange,
    } = this.props;
    return (
      <Header>
        <InnerContainer>
          <HeaderContainer>
            <Title href="/">
              {'Anagramania.io'}
            </Title>
            <Form onSubmit={onSubmit}>
              <Input
                type="text"
                innerRef={(e) => this.setInput(e)}
                onChange={onQueryChange}
              />
              <SearchButton>
                {'Go!'}
              </SearchButton>
            </Form>
            {dictionaries.map(d => {
              return (
                <SmallButton
                  key={d.id}
                  onClick={() => onSelectChange(d.id)}
                  active={selectedDictionaries === d.id}
                >
                  {d.name}
                </SmallButton>
              );
            })}
          </HeaderContainer>
        </InnerContainer>
      </Header>
    );
  }
}

class Anagramania extends React.Component<{}, {
  queryStatus: RequestStatus;
  query: string;
  cleanedQuery: string;
  cleanedQueryWithSpaces: string;
  // anagrams: AnagramResult[];
  subanagrams: anagram.IndexedWord[];
  anagramIteratorState: anagram.SerializedAnagramIteratorState;
  dictionaries: Dictionary[];
  selectedDictionaries: string;
  showModal: boolean;
  modalAnagram: string;
  modalWord: string;
  appState: string;
}> {
  worker: Worker;
  finished: boolean;
  constructor(props: any) {
    super(props);
    const defaultState = {
      queryStatus: RequestStatus.none,
      query: '',
      cleanedQuery: '',
      dictionaries: [],
      selectedDictionaries: 'en',
      subanagrams: [],
      anagramIteratorState: null,
      cleanedQueryWithSpaces: '',
      showModal: false,
      modalAnagram: '',
      modalWord: '',
      appState: 'search',
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.pauseWorker = this.pauseWorker.bind(this);
    this.continueWorker = this.continueWorker.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveAnagram = this.saveAnagram.bind(this);

    this.state = defaultState;
    // if (TESTING) {
    //   this.state = mockState as any;
    // }
  }
  async componentWillMount() {
    const location = window.location;
    const search = location.search;
    const parsedSearch = parseSearch(search);
    if (parsedSearch.anagram && parsedSearch.word) {
      this.setState ({
        modalWord: parsedSearch.word,
        modalAnagram: parsedSearch.anagram,
        appState: 'anagramViewer',
      });
    }

    const result = await getDictionaries();
    this.setState({
      dictionaries: result.data.dictionaries,
    });
  }
  onQueryChange(e) {
    this.setState({
      query: e.target.value,
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({
      appState: 'search',
    });
    this.requestAnagram();
  }
  onSelectChange(value) {
    this.setState({selectedDictionaries: value});
  }
  pauseWorker() {
    console.log('pause');
  }
  continueWorker() {
    console.log('continue');
  }
  openModal(anagram: string, word: string) {
    this.setState({
      showModal: true,
      modalAnagram: anagram,
      modalWord: word,
    });
  }
  closeModal() {
    this.setState({
      showModal: false,
    });
  }
  saveAnagram(anagram: string, word: string) {
    this.setState({
      modalAnagram: anagram,
      modalWord: word,
    });
  }
  async requestAnagram() {

    if (this.worker) {
      this.worker.terminate();
    }

    this.finished = false;
  
    const cleanedQuery = anagram.sanitizeQuery(this.state.query);
    const cleanedQueryWithSpaces = anagram.sanitizeQuery(this.state.query, false);

    const result = await getSubAnagrams(cleanedQuery, this.state.selectedDictionaries);
    const {anagrams: subanagrams} = result.data;

    const initialAnagramIteratorState = anagram.serializeAnagramIteratorStateFactor(
      anagram.angagramIteratorStateFactory()
    );

    initialAnagramIteratorState.unsolvedSubanagrams = subanagrams.map((_, i) => i);

    this.setState({
      subanagrams,
      queryStatus: RequestStatus.loading,
      cleanedQuery,
      cleanedQueryWithSpaces,
      // TODO
      anagramIteratorState: initialAnagramIteratorState,
    });

    const throttledSetState = throttle(() => {
      this.setState({});
    }, 100);
    
    const updateState = (state: anagram.AnagramGeneratorStepSerialized) => {
      if (this.finished) {
        return;
      }
      this.state.anagramIteratorState.solutions.push(...state.solutions);
      this.state.anagramIteratorState.numberOfPossibilitiesChecked += state.numberOfPossibilitiesChecked;
      (window as any).applicationState = this.state;
      throttledSetState();
    };

    const startNextWorker = () => {
      if (this.state.anagramIteratorState.unsolvedSubanagrams.length === 0) {
        return;
      }
      const nextWorkerIndex = this.state.anagramIteratorState.unsolvedSubanagrams.shift();
      this.state.anagramIteratorState.currentSubanagrams.push(nextWorkerIndex);
      this.setState({});
      
      const worker = new AnagramWorker();
      this.worker = worker;

      worker.addEventListener('message', message => {
        if (message.data === 'finish') {
          this.state.anagramIteratorState.solvedSubanagrams.push(nextWorkerIndex);
          this.state.anagramIteratorState.currentSubanagrams.shift();
          worker.terminate();
          // stop!
          if (this.state.anagramIteratorState.solvedSubanagrams.length === subanagrams.length) {
            return;
          }
          startNextWorker();
          return;
        }
        const newState: anagram.AnagramGeneratorStepSerialized = message.data;
        updateState(newState)
      });

      worker.postMessage({
        type: 'start',
        query: cleanedQuery,
        subanagram: subanagrams[nextWorkerIndex],
        subanagrams,
      });

    };

    startNextWorker();

  }
  render() {

    const state = this.state.anagramIteratorState;

    const query = this.state.cleanedQueryWithSpaces;
    const appState = this.state.appState;

    return (
      <div>
        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.closeModal}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
          style={{
            overlay: {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
            content: {
              padding: 15,
              background: 'none',
              borderRadius: 0,
              border: 'none',
              top: '50%',
              bottom: 'auto',
              left: '50%',
              right: 'auto',
              maxWidth: '800px',
              width: '100%',
              transform: `translate(-50%, -50%)`,
            }
          }}
        >
          <AnagramVisualizer
            anagram={this.state.modalAnagram}
            word={this.state.modalWord}
            close={this.closeModal}
            save={this.saveAnagram}
          />
        </ReactModal>

        <AnagramaniaHeader
          onSubmit={this.onSubmit}
          onQueryChange={this.onQueryChange}
          onSelectChange={this.onSelectChange}
          dictionaries={this.state.dictionaries}
          selectedDictionaries={this.state.selectedDictionaries}
        />
        {appState === 'search' ?
          <InnerContainer>
            <AnagramInfoArea
              anagramIteratorState={state}
              subanagrams={this.state.subanagrams}
              query={query}
              share={this.openModal}
            />
          </InnerContainer> :
          null
        }
        {
          appState === 'anagramViewer' ?
            <InnerContainer>
              <div style={{marginTop: 30}}>
                <AnagramVisualizer
                  anagram={this.state.modalAnagram}
                  word={this.state.modalWord}
                  save={this.saveAnagram}
                />
              </div>
            </InnerContainer>
          : null
        }

        <Footer>
          {'Made by Tom Nick & Taisia Tikhnovetskaya'}
        </Footer>
      </div>
    );
  }
};

export default Anagramania;