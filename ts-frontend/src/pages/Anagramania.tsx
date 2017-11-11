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

const TESTING = true;
import mockState from 'src/assets/anagramPageMock';

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
  margin-left: -10px;
  margin-right: -10px;
`;

const AnagramResultGroup = withProps<{
  loading: boolean,
  hasNoSolution: boolean;
}>()(styled.div)`
  float: left;
  width: 300px;
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

const ShowAllButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 10px;
  outline: none;

  &:hover {
    text-decoration: underline;
  }
`;

class AnagramResult extends React.Component<
{
  loading: boolean;
  hasNoSolution: boolean;
  word: string;
  list: anagram.AnagramSolution[];
  counter: number;
  columnWidth: number;
},
{
  showAll: boolean;
}
> {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }
  toggleShowAll() {
    this.setState({
      showAll: !this.state.showAll,
    });
  }
  render() {
    const {
      loading,
      hasNoSolution,
      word,
      list,
      counter,
      columnWidth,
    } = this.props;
    return (
      <AnagramResultGroup
        loading={loading}
        hasNoSolution={hasNoSolution}
        style={{
          width: columnWidth - 20,
        }}
      >
        <div style={{position: 'relative'}}>
          <strong>
            {word}
          </strong>
          <div style={{position: 'absolute', right: 0, top: 0}}>{counter}</div>
          {take(list, !this.state.showAll ? 10 : list.length).map((a, i) => {
            return <Result key={i} result={a} index={i} />
          })}
          {
            list.length > 10
              ? 
                <ShowAllButton onClick={this.toggleShowAll}>
                  {this.state.showAll
                    ? `... hide ${list.length - 10} items`
                    : `... show ${list.length - 10} more`
                  }
                </ShowAllButton>
              : null
          }
        </div>
      </AnagramResultGroup>
    );
  }
}

const AnagramResultRow = styled.div`
  float: left;
`;

class AnagramResults extends React.Component<
{
  anagrams: anagram.AnagramSolution[];
  subanagrams: anagram.IndexedWord[];
  cleanedQuery: string;
  isDone: boolean;
},
{
  columnWidth: number;
  numberOfColumns: number;
}
> {
  dom: HTMLElement;
  constructor(props) {
    super(props);
    this.state = {
      columnWidth: 250,
      numberOfColumns: 1,
    };
    this.setRef = this.setRef.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setColumnWidth();
    });
    this.setColumnWidth();
  }
  // we use javascript for this, becaus flexbox might be to slow
  calculateColumnWidth() {
    const width = this.dom.clientWidth;
    const MIN_COLUMN_WIDTH = 250;

    
    const numberOfColumns = Math.floor(width / MIN_COLUMN_WIDTH);
    const columnWidth = width / numberOfColumns;
    return {
      columnWidth,
      numberOfColumns,
    };
  }
  setColumnWidth() {
    this.setState(this.calculateColumnWidth());
  }
  setRef(dom) {
    this.dom = dom;
  }
  render() {
    const {anagrams, subanagrams, isDone} = this.props;
    const groupedAnagrams = anagram.groupAnagramsByStartWord(subanagrams, anagrams);
    const groupedAngramsContainer = [];
    let currentGroup: anagram.GroupedAnagramSolutions[] = [];
    for (let ga of groupedAnagrams) {
      currentGroup.push(ga);
      if (currentGroup.length === this.state.numberOfColumns) {
        groupedAngramsContainer.push(currentGroup);
        currentGroup = [];
      }
    }
    if (currentGroup.length !== 0) {
      groupedAngramsContainer.push(currentGroup);
    }

    return (
      <AnagramResultsContainer innerRef={this.setRef}>
        {groupedAngramsContainer.map((group, i) => {
          return (
            <AnagramResultRow key={i}>
              {group.map((d) => {
                const {word, list, checked, counter} = d;
                const loading = list.length === 0 && !checked && !isDone;
                const hasNoSolution = (checked || isDone) && counter === 0;
                return (
                  <AnagramResult
                    key={word}
                    columnWidth={this.state.columnWidth}
                    loading={loading}
                    hasNoSolution={hasNoSolution}
                    word={word}
                    list={list}
                    counter={counter}
                  />
                );
              })}
            </AnagramResultRow>
          );
        })}
      </AnagramResultsContainer>
    );
  }
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
    const defaultState = {
      queryStatus: RequestStatus.none,
      query: '',
      cleanedQuery: '',
      dictionaries: [],
      selectedDictionaries: 'eng-us-3k',
      subanagrams: [],
      anagramIteratorState: null,
    };

    this.state = defaultState;
    if (TESTING) {
      this.state = mockState;
    }
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