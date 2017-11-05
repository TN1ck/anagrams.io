import * as React from 'react';
import * as ReactDom from 'react-dom';
import styled, {css} from 'styled-components';
import {AxiosPromise} from 'axios';

// import {triangularPyramidal} from './math';

import Footer from './components/Footer';
import Form from './components/Form';
import Header from './components/Header';
import InnerContainer from './components/InnerContainer';
import Input from './components/Input';
// import InputGroup from './components/InputGroup';
import SearchButton from './components/SearchButton';
import SubTitle from './components/SubTitle';
import Title from './components/Title';

import {withProps} from 'src/utility';
import {RequestStatus, getSubAnagrams} from 'src/api';

import * as anagram from 'src/anagram';

import './styles.css';

const ResultContainer = styled.div`
  color: black;
  white-space: nowrap;
  margin-top: 5px;
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
              {list.map((a, i) => {
                return <Result key={i} result={a} index={i} />
              })}
            </div>
          </AnagramResultGroup>
        )
      })}
    </AnagramResultsContainer>
  );
};

const MAX_ITERATIONS = 100000;

class Anagramania extends React.Component<{}, {
  queryStatus: RequestStatus;
  query: string;
  cleanedQuery: string;
  // anagrams: AnagramResult[];
  subanagrams: anagram.IndexedWord[];
  solutions: anagram.AnagramSolution[];
  possibilitiesChecked: number;
  iterations: number;
}> {
  request: AxiosPromise;
  constructor(props: any) {
    super(props);
    this.state = {
      queryStatus: RequestStatus.none,
      query: '',
      cleanedQuery: '',
      subanagrams: [],
      solutions: [],
      possibilitiesChecked: 0,
      iterations: 0,
    };
  }
  onQueryChange(query: string) {
    this.setState({
      query,
    });
  }
  async requestAnagram() {
    console.log('request anagram', this.state.cleanedQuery);

    const cleanedQuery = anagram.sanitizeQuery(this.state.query);

    const result = await getSubAnagrams(cleanedQuery);
    const {anagrams: subanagrams} = result.data;

    const {
      generator,
    } = anagram.findAnagramSentences(cleanedQuery, subanagrams);

    this.setState({
      subanagrams,
      solutions: [],
      queryStatus: RequestStatus.loading,
      possibilitiesChecked: 0,
      iterations: 0,
      cleanedQuery,
    });

    const solutions: anagram.AnagramSolution[] = [];

    const state = {
      breakLoop: false,
      counter: 0,
      numberOfPossibilitiesChecked: 0,
    };

    const gen = generator();

    const CONCURRENT_GET_NEXT = 100;

    const getNext = (startAgain: boolean) => {
      state.counter++;

      if (state.breakLoop) {
        return;
      }

      const value = gen.next();
      if (!value || value.done || MAX_ITERATIONS <= state.counter) {
        state.breakLoop = true;
        // so we update the state after the others are finished
        setTimeout(() => {
          this.setState({
            solutions,
            iterations: state.counter,
            queryStatus: RequestStatus.success,
            possibilitiesChecked: state.numberOfPossibilitiesChecked,
          });
        });
        return;
      }

      if (value.value) {        
        if (value.value.solution) {
          solutions.push(value.value.current);
          state.numberOfPossibilitiesChecked = value.value.numberOfPossibilitiesChecked;
          this.setState({
            solutions,
            possibilitiesChecked: state.numberOfPossibilitiesChecked,
            iterations: state.counter,
          });
        } else if (state.counter % 250 === 0 && value.value) {
          state.numberOfPossibilitiesChecked = value.value.numberOfPossibilitiesChecked;
          this.setState({
            possibilitiesChecked: state.numberOfPossibilitiesChecked,
            iterations: state.counter,
          });
        }
      }

      if (startAgain) {
        setTimeout(() => {
          for (let i = 0; i <= CONCURRENT_GET_NEXT; i++) {
            getNext(false);
          }
        });
        setTimeout(() => (getNext(true)));
      }
    }

    getNext(true);


  }
  render() {
    const isLoading = this.state.queryStatus === RequestStatus.loading;
    const isDone = this.state.queryStatus === RequestStatus.success;
    // const possibilities = triangularPyramidal(this.state.subanagrams.length);

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
          </InnerContainer>
        </Header>
        <InnerContainer>
          {
            (isLoading || isDone) ? (
              <div>
                <SubTitle>
                  {`I found ${this.state.subanagrams.length} subanagrams.`}
                </SubTitle>
                <strong style={{color: 'white'}}>{`Checked ${this.state.possibilitiesChecked} possibilities.`}</strong>
                <strong style={{color: 'white'}}>{` ${this.state.iterations} iterations.`}</strong>
                <br/>
                {
                  isDone ? (
                    <strong style={{color: 'white'}}>
                      {`Finished: found ${this.state.solutions.length} solutions.`}
                    </strong>
                  ) : null
                }
                <AnagramResults
                  subanagrams={this.state.subanagrams}
                  anagrams={this.state.solutions}
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

ReactDom.render(
  <Anagramania />,
  document.getElementById('root'),
);
