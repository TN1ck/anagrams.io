import * as React from 'react';
import styled, {css} from 'styled-components';
import Select from 'react-select';
import {throttle, take} from 'lodash';

// import {triangularPyramidal} from './math';

import Footer from 'src/components/Footer';
import Form from 'src/components/Form';
import Header from 'src/components/Header';
import InnerContainer from 'src/components/InnerContainer';
import Input from 'src/components/Input';
// import InputGroup from 'src/components/InputGroup';
import SearchButton from 'src/components/SearchButton';
import SubTitle from 'src/components/SubTitle';
import Title from 'src/components/Title';

import {withProps} from 'src/utility';
import {RequestStatus, getSubAnagrams, getDictionaries, Dictionary} from 'src/api';

import * as anagram from 'src/anagram';

const AnagramWorker = require('../anagram.worker');

import 'src/assets/styles.css';
import 'src/../node_modules/react-select/dist/react-select.css';

const ResultContainer = styled.div`
  color: black;
  white-space: nowrap;
  margin-top: 5px;
`;

const SelectContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Result: React.StatelessComponent<{
  result: anagram.AnagramSolution;
  index: number;
}> = ({result, index}) => {
  return (
    <ResultContainer>
      {(index + 1) + '. ' + [...result.list].reverse().map(w => {
        return w.word.word;
      }).join(' ')}
    </ResultContainer>
  );
}

const AnagramResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin-left: -10px;
  margin-right: -10px;
`;

const AnagramResultGroup = withProps<{
  loading: boolean,
  hasNoSolution: boolean;
}>()(styled.div)`
  flex-grow: 0;
  background: white;
  margin: 10px;
  padding: 10px;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  ${(props: any) => props.hasNoSolution && css`
    opacity: 0.3;
  `}
  ${(props: any) => props.loading && css`
    opacity: 0.7;
  `}
`;

const AnagramResults: React.StatelessComponent<{
  anagrams: anagram.AnagramSolution[];
  subanagrams: anagram.IndexedWord[];
  cleanedQuery: string;
  isDone: boolean;
}> = ({anagrams, subanagrams, cleanedQuery, isDone}) => {

  const groupedAnagrams = anagram.groupAnagramsByStartWord(subanagrams, anagrams);
  return (
    <AnagramResultsContainer>
      {groupedAnagrams.map((d,) => {
        const {word, list, checked, counter} = d;
        return (
          <AnagramResultGroup
            key={word}
            loading={list.length === 0 && !checked && !isDone}
            hasNoSolution={(checked || isDone) && counter === 0}
          >
            <span style={{whiteSpace: 'nowrap', opacity: 0, height: 0}}>
              {cleanedQuery.split('').map(() => 'a').join(' ')}
            </span>
            <div style={{position: 'relative', top: -15, marginBottom: -15}}>
              <strong>
                {word}
              </strong>
              <div style={{position: 'absolute', right: 0, top: 0}}>{counter}</div>
              {take(list, 10).map((a, i) => {
                return <Result key={i} result={a} index={i} />
              })}
              {
                list.length > 10
                  ? `... show ${list.length - 10} more`
                  : null
              }
            </div>
          </AnagramResultGroup>
        )
      })}
    </AnagramResultsContainer>
  );
};

// const MAX_ITERATIONS = 100000;

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
  constructor(props: any) {
    super(props);
    this.state = {
      queryStatus: RequestStatus.none,
      query: '',
      cleanedQuery: '',
      dictionaries: [],
      selectedDictionaries: 'eng-us-3k',
      subanagrams: [],
      anagramIteratorState: null,
    };
  }
  async componentWillMount() {
    const result = await getDictionaries();
    this.setState({
      dictionaries: result.data.dictionaries,
    });
  }
  onQueryChange(query: string) {
    this.setState({
      query,
    });
  }
  async requestAnagram() {

    const cleanedQuery = anagram.sanitizeQuery(this.state.query);

    const result = await getSubAnagrams(cleanedQuery, this.state.selectedDictionaries);
    const {anagrams: subanagrams} = result.data;

    this.setState({
      subanagrams,
      queryStatus: RequestStatus.loading,
      cleanedQuery,
      // TODO
      anagramIteratorState: anagram.serializeAnagramIteratorStateFactor(anagram.angagramIteratorStateFactory([])),
    });

    const worker = new AnagramWorker();
    
    const updateState = throttle((state: anagram.SerializedAnagramIteratorState) => {
      this.setState({
        anagramIteratorState: state,
      });
    }, 50);

    worker.addEventListener('message', message => {
      const newState: anagram.SerializedAnagramIteratorState = message.data;
      if (newState.currentSubanagrams) {
        updateState(newState);
      }
    });
    worker.postMessage({query: cleanedQuery, subanagrams});

  }
  render() {
    const isLoading = this.state.queryStatus === RequestStatus.loading;
    const isDone = this.state.queryStatus === RequestStatus.success;

    const state = this.state.anagramIteratorState;

    return (
      <div>
        <Header>
          <InnerContainer>
            <Title>
              {'Anagramania.io'}
            </Title>
            <Form onSubmit={(e) => {
              e.preventDefault();
              this.requestAnagram();
              }}>
              <Input
                type="text"
                onChange={(e: any) => this.onQueryChange(e.target.value)}
              />
              <SearchButton>
                {'Go!'}
              </SearchButton>
            </Form>
            <SelectContainer>
              <Select
                options={this.state.dictionaries.map(d => {
                  return {value: d.id, label: d.name};
                })}
                value={this.state.selectedDictionaries}
                onChange={(value) => this.setState({selectedDictionaries: value.value})}
              />
            </SelectContainer>
          </InnerContainer>
        </Header>
        <InnerContainer>
          {
            (isLoading || isDone) ? (
              <div>
                <SubTitle>
                  {`I found ${this.state.subanagrams.length} subanagrams.`}
                </SubTitle>
                <strong style={{color: 'white'}}>{`Currently checking the subanagrams: ${state.currentSubanagrams.map(c => c.word.word).join(', ')}.`}</strong>
                <br/>
                <strong style={{color: 'white'}}>{`Checked ${state.numberOfPossibilitiesChecked} possibilities.`}</strong>
                <strong style={{color: 'white'}}>{` ${state.counter} iterations.`}</strong>
                <br />
                <strong style={{color: 'white'}}>{` ${state.solutions.length} solutions.`}</strong>
                <br/>
                {
                  isDone ? (
                    <strong style={{color: 'white'}}>
                      {`Finished: found ${state.solutions.length} solutions.`}
                    </strong>
                  ) : null
                }
                <AnagramResults
                  subanagrams={this.state.subanagrams}
                  anagrams={state.solutions}
                  cleanedQuery={this.state.cleanedQuery}
                  isDone={isDone}
                />
              </div>
            ) : null
          }
          <Footer>
            {'Made by Tom Nick & Taisia Tikhnovetskaya'}
          </Footer>
        </InnerContainer>
      </div>
    );
  }
};

export default Anagramania;