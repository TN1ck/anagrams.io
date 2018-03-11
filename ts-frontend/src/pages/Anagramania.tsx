import * as React from 'react';
import styled from 'styled-components';
import {throttle, min, max} from 'lodash';
import {THEME, MARGIN_RAW} from 'src/theme';

import {
  Footer,
  SearchBar,
  Header,
  InnerContainer,
  SubTitle,
  Title,
  HeaderContainer,
  LoadingBar,
  AnagramVisualizer,
  SmallTitle,
  TitleContainer,
} from 'src/components';

import {Word, AnagramSausages, calculateWidths} from 'src/components/AnagramVisualizer';

import * as ReactModal from 'react-modal';
ReactModal.setAppElement('body');

import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';
import {parseSearch} from 'src/utility';

import * as anagram from 'src/anagram';

import AnagramResults from 'src/molecules/AnagramResults';
import {
  // Strong,
  SmallButton,
} from 'src/components';

const AnagramWorker = require('../anagram.worker');

// import mockState from 'src/assets/anagramPageMock';
// // const TESTING = true;


const ActiveSubanagramsContainer = styled.div`
  text-align: center;
  margin-top: ${THEME.margins.m2};
  margin-bottom: ${THEME.margins.m2};
`;

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
      <ActiveSubanagramsContainer>
        {`Checking: ${currentSubanagrams.map(i => subanagrams[i].word.word).join(', ')}`}
      </ActiveSubanagramsContainer>
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
      <div className="mt-3">
        <SubTitle className="mb-2">
          <strong>{`${solutions.length}`}</strong>{` solutions`}
        </SubTitle>
        <LoadingBar progress={progress}>
        </LoadingBar>
        {/* <ActiveSubanagrams
          subanagrams={subanagrams}
          currentSubanagrams={currentSubanagrams}
        /> */}
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

class AnagramaniaHeader extends React.Component<AnagramaniaHeaderProps, {
  anagramIndex: number;
}> {
  anagrams: string[] = ['anagrams', 'a mars nag', 'mara sang'];
  word: string = 'anagrams';
  mounted: boolean = false;
  updateTimeout: number = 0;
  input: HTMLInputElement = null;

  constructor(props) {
    super(props);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.state = {
      anagramIndex: 0,
    };
  }
  setInputRef(dom) {
    this.input = dom;
    this.input.focus();
  }
  componentDidMount() {
    this.mounted = true;
    const duration = 3000;
    const update = () => {
      if (this.mounted) {
        const newIndex = (this.state.anagramIndex + 1);
        this.setState({
          anagramIndex: newIndex,
        });
        if (newIndex < 3) {
          this.updateTimeout = window.setTimeout(update, duration);
        }
      }
    };
    this.updateTimeout = window.setTimeout(update, 500);
  }
  componentWillUnmount() {
    this.mounted = false;
    window.clearTimeout(this.updateTimeout);
  }
  shouldComponentUpdate(newProps: AnagramaniaHeaderProps, newState) {
    if (
      this.props.selectedDictionaries !== newProps.selectedDictionaries ||
      this.props.dictionaries !== newProps.dictionaries ||
      this.state.anagramIndex !== newState.anagramIndex
    ) {
      return true;
    }
    return false;
  }
  onQueryChange(e) {
    window.clearTimeout(this.updateTimeout);
    if (this.word !== this.anagrams[this.state.anagramIndex % this.anagrams.length]) {
      this.setState({
        anagramIndex: 0,
      });
    }
    this.props.onQueryChange(e);
  }
  render() {
    const {
      dictionaries,
      selectedDictionaries,
      onSubmit,
      onSelectChange,
    } = this.props;

    const anagram = this.anagrams[this.state.anagramIndex % this.anagrams.length];
    const word = this.word;

    const maxWidth = 500;

    const anagramVis = calculateWidths(word, anagram, maxWidth);
    const wordWidth = calculateWidths(word, word, maxWidth).wordWidth;

    return (
      <Header>
        <InnerContainer>
          <TitleContainer>
            <div style={{position: 'relative', top: -50, height: 150}}>
              <AnagramSausages
                word={word}
                anagram={anagram}
                height={anagramVis.height}
                wordWidth={wordWidth}
                characterWidth={anagramVis.characterWidth}
                characterHeight={anagramVis.characterHeight}
                paddingTop={anagramVis.paddingTop}
                strokeWidth={MARGIN_RAW.m1 * 2}
              />
            </div>
            <Title href="/">
              <Word
                wordWidth={wordWidth}
                fontSize={anagramVis.fontSize}
                characterWidth={anagramVis.characterWidth}
                anagram={anagram}
                word={word}
              />
            </Title>
            <SmallTitle className="mt-1 mb-3">
              {'The best anagram finder in the world.'}
            </SmallTitle>
          </TitleContainer>
          <HeaderContainer>
            <SearchBar
              innerRef={this.setInputRef}
              onChange={this.onQueryChange}
              onSubmit={onSubmit}
            />
            {dictionaries.map(d => {
              return (
                <SmallButton
                  className="mr-1 mt-2"
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
    this.setState({selectedDictionaries: value}, () => {
      if (this.state.subanagrams.length > 0 && this.state.query.length > 0) {
        this.setState({
          appState: 'search',
        });
        this.requestAnagram();
      }
    });

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

    if (cleanedQuery.length === 0) {
      return;
    }

    const result = await getSubAnagrams(cleanedQuery, this.state.selectedDictionaries);
    const {anagrams: subanagrams} = result.data;

    const initialAnagramIteratorState = anagram.serializeAnagramIteratorStateFactor(
      anagram.anagramIteratorStateFactory()
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
        this.setState({});
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
            this.setState({});
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
            overlay: {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 99},
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
          <span>{'Made by '}</span>
          <a href="http://tomnick.org">{' Tom Nick '}</a>
          <span>{' & Taisia Tikhnovetskaya'}</span>
        </Footer>
      </div>
    );
  }
};

export default Anagramania;