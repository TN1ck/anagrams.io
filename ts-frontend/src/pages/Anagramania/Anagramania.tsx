import * as React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import {throttle} from 'lodash';

import Footer from 'src/components/Footer';
import Form from 'src/components/Form';
import Header from 'src/components/Header';
import InnerContainer from 'src/components/InnerContainer';
import Input from 'src/components/Input';
import SearchButton from 'src/components/SearchButton';
import SubTitle from 'src/components/SubTitle';
import Title from 'src/components/Title';

import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';

import * as anagram from 'src/anagram';

import AnagramResults from './AnagramResults';

const AnagramWorker = require('../../anagram.worker');

import 'src/assets/styles.css';
import 'src/../node_modules/react-select/dist/react-select.css';

const TESTING = false;
// import mockState from 'src/assets/anagramPageMock';

const SelectContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Strong = styled.strong`
  color: white;
`;

const WaitButton = styled.button`
  background: none;
  color: white;
  padding: 10px;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

class AnagramPercentage extends React.Component<{
  numberOfSolvedSubanagrams: number;
  numberOfAnagrams: number;
}> {
  render() {
    const {numberOfSolvedSubanagrams, numberOfAnagrams} = this.props;
    return (
      <span>
        {`Checked ${Math.ceil(((numberOfSolvedSubanagrams)/ numberOfAnagrams) * 100)} %.`}
      </span>
    );
  }
}

class ActiveSubanagrams extends React.Component<{
  currentSubanagrams: number[];
  subanagrams: anagram.IndexedWord[];
}> {
  render() {
    const {
      currentSubanagrams,
      subanagrams,
    } = this.props;
    return (
      <span>
        {`Currently checking the subanagrams: ${currentSubanagrams.map(i => subanagrams[i].word.word).join(', ')}.`}
      </span>
    );
  }
}

class AnagramInfoArea extends React.Component<{
  anagramIteratorState: anagram.SerializedAnagramIteratorState;
  subanagrams: anagram.IndexedWord[];
}> {
  render() {
    const {
      anagramIteratorState,
      subanagrams,
    } = this.props;

    if (!anagramIteratorState) {
      return null;
    }

    const {
      solvedSubanagrams,
      currentSubanagrams,
      numberOfPossibilitiesChecked,
      unsolvedSubanagrams,
      counter,
      solutions,
    } = anagramIteratorState;

    const isDone = unsolvedSubanagrams.length === 0;
    
    return (
      <div>
        <SubTitle>
          {`I found ${subanagrams.length} subanagrams. `}
          <AnagramPercentage
            numberOfSolvedSubanagrams={solvedSubanagrams.length}
            numberOfAnagrams={subanagrams.length}
          />
        </SubTitle>
        <Strong>
          <ActiveSubanagrams
            subanagrams={subanagrams}
            currentSubanagrams={currentSubanagrams}
          />
        </Strong>
        <br/>
        <Strong>
          {`Checked ${numberOfPossibilitiesChecked} possibilities.`}
        </Strong>
        <Strong>{` ${counter} iterations.`}</Strong>
        <br />
        <Strong>{` ${solutions.length} solutions.`}</Strong>
        <br/>
        {
          isDone ? (
            <SubTitle>
              {`Finished: found ${solutions.length} solutions.`}
            </SubTitle>
          ) : null
        }
        <AnagramResults
          subanagrams={subanagrams}
          anagramIteratorState={anagramIteratorState}
          isDone={isDone}
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
  shouldComponentUpdate(newProps: AnagramaniaHeaderProps) {
    if (
      this.props.selectedDictionaries !== newProps.selectedDictionaries ||
      this.props.dictionaries !== newProps.dictionaries
    ) {
      return true;
    }
    return false;
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
          <Title>
            {'Anagramania.io'}
          </Title>
          <Form onSubmit={onSubmit}>
            <Input
              type="text"
              onChange={onQueryChange}
            />
            <SearchButton>
              {'Go!'}
            </SearchButton>
          </Form>
          <SelectContainer>
            <Select
              options={dictionaries.map(d => {
                return {value: d.id, label: d.name};
              })}
              value={selectedDictionaries}
              onChange={onSelectChange}
            />
          </SelectContainer>
        </InnerContainer>
      </Header>
    );
  }
}

class Anagramania extends React.Component<{}, {
  queryStatus: RequestStatus;
  query: string;
  cleanedQuery: string;
  // anagrams: AnagramResult[];
  subanagrams: anagram.IndexedWord[];
  anagramIteratorState: anagram.SerializedAnagramIteratorState;
  dictionaries: Dictionary[];
  selectedDictionaries: string;
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
      selectedDictionaries: 'eng-us-3k',
      subanagrams: [],
      anagramIteratorState: null,
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.pauseWorker = this.pauseWorker.bind(this);
    this.continueWorker = this.continueWorker.bind(this);

    this.state = defaultState;
    if (TESTING) {
      // this.state = mockState;
    }
  }
  async componentWillMount() {
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
    this.requestAnagram();
  }
  onSelectChange(value) {
    this.setState({selectedDictionaries: value.value});
  }
  pauseWorker() {
    console.log('pause');
    this.worker.postMessage({type: 'pause'});
  }
  continueWorker() {
    this.worker.postMessage({type: 'continue'});
  }
  async requestAnagram() {

    if (this.worker) {
      this.worker.terminate();
    }

    this.finished = false;
  
    const cleanedQuery = anagram.sanitizeQuery(this.state.query);

    const result = await getSubAnagrams(cleanedQuery, this.state.selectedDictionaries);
    const {anagrams: subanagrams} = result.data;

    const initialState = anagram.serializeAnagramIteratorStateFactor(anagram.angagramIteratorStateFactory([]));

    this.setState({
      subanagrams,
      queryStatus: RequestStatus.loading,
      cleanedQuery,
      // TODO
      anagramIteratorState: initialState,
    });

    const worker: Worker = new AnagramWorker();
    
    const updateState = throttle((state: anagram.SerializedAnagramIteratorState) => {
      if (this.finished) {
        return;
      }
      this.setState({
        anagramIteratorState: state,
      });
    }, 50);

    let oldState = initialState;
    worker.addEventListener('message', message => {
      const newState: anagram.SerializedAnagramIteratorState = message.data;
      if (newState.currentSubanagrams) {
        oldState = newState;
        updateState(newState);
      // kind of archaic, but it works good enough
      } else if ((newState as any) === 'finish') {
        this.finished = true;
        // finished
        this.setState({
          anagramIteratorState: {
            ...oldState,
            solvedSubanagrams: subanagrams.map(s => s.index),
            unsolvedSubanagrams: [],
            currentSubanagrams: [],
          },
        })
      }
    });
    worker.postMessage({type: 'start', query: cleanedQuery, subanagrams});
    this.worker = worker;

  }
  render() {

    const state = this.state.anagramIteratorState;

    return (
      <div>
        <AnagramaniaHeader
          onSubmit={this.onSubmit}
          onQueryChange={this.onQueryChange}
          onSelectChange={this.onSelectChange}
          dictionaries={this.state.dictionaries}
          selectedDictionaries={this.state.selectedDictionaries}
        />
        <InnerContainer>
          <WaitButton onClick={this.pauseWorker}>
            {'Pause'}
          </WaitButton>
          <WaitButton onClick={this.continueWorker}>
            {'Continue'}
          </WaitButton>
          <AnagramInfoArea
            anagramIteratorState={state}
            subanagrams={this.state.subanagrams}
          />
          <Footer>
            {'Made by Tom Nick & Taisia Tikhnovetskaya'}
          </Footer>
        </InnerContainer>
      </div>
    );
  }
};

export default Anagramania;