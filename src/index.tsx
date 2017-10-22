import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as keymaster from 'keymaster';
import styled from 'styled-components';
import {random, range, sample, throttle, groupBy, last} from 'lodash';
import axios, {AxiosPromise} from 'axios';
import { ThemedStyledFunction, css } from 'styled-components';

function withProps<U>() {
  return <P, T, O>(
      fn: ThemedStyledFunction<P, T, O>,
  ): ThemedStyledFunction<P & U, T, O & U> => fn;
}


import * as anagram from 'src/anagram';

const BACKEND_URL = 'http://localhost:3000';
const LIGHTER_COLOR = '#474ebd';
const LIGHT_COLOR = '#371c84';
const DARK_COLOR = '#271b68';
const GREY = '#95a5a6';

function sumFromTo(from: number, to: number) {
  return to * (to + from) / 2 - ((from - 1) * from) / 2;
}

function triangularPyramidal(n: number) {
  return n * (n + 1) * (n + 2)/6;
}

function getAnagram(query: string) {
  return axios.get(BACKEND_URL + '/anagram/' + query);
}

function getAnagramSentences(query: string) {
  return axios.get(BACKEND_URL + '/anagram-sentences/' + query);
}

const AnagramaniaInput = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.4);
  width: 100%;
  background: rgba(0, 10, 25, 0.5);
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
  font-size: 1.25rem;
  padding: 0.75rem 1.5rem;
  color: white;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:focus {
    border-color: #5cb3fd;
    outline: 0;
  }
`;

const AnagramaniaForm = styled.form`
  display: flex;
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const AnagramaniaTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  text-align: center;
  font-weight: 300;
  margin: 2.5rem;
  padding: 0;

  @media (max-width: 899px) {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }
`

const AnagramaniaInnerContainer = styled.div`
  max-width: 900px;
  width: 100%;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 899px) {
    max-width: 100%;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const AnagramaniaHeader = styled.div`
  background: radial-gradient(circle at 50% 1%, ${LIGHTER_COLOR}, ${LIGHT_COLOR});
  box-shadow: 0 10px 80px -2px rgba(0, 0, 0, 0.4);
  padding: 2rem 0 2rem;
  display: flex;
  justify-content: center;
`;

const AnagramaniaInputGroup = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`

const SearchButton = styled.button`
  transition: all 300ms ease-out;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-left: none;
  background: rgba(0, 10, 25, 0.5);
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0 1.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    box-shadow: 0 5px 12px -2px rgba(255, 255, 255, 0.3);
  }
`;

const AnagramaniaFooter = styled.div`
  opacity: 0.7;
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: white;
  display: flex;
  justify-content: center;
  font-size: 10px;
`;

const SubHeader = styled.h2`
  color: white;
`;

enum RequestStatus {
  none = 'none',
  loading = 'loading',
  success = 'success',
  error = 'error',
};

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

function groupAnagramsByStartWord(
  subanagrams: anagram.IndexedWord[],
  anagrams: anagram.AnagramSolution[]
):
Array<{list: anagram.AnagramSolution[], word: string, checked: boolean, counter: number}> {
  const groups = subanagrams.map(a => {
    return {
      list: [] as anagram.AnagramSolution[],
      word: a.word.word,
      counter: 0,
      checked: false,
    };
  });

  let current = null;
  let currentWord = '';
  let currentWordIndex = 0;

  for (let i = 0; i < anagrams.length; i++) {
    const a = anagrams[i];
    const newIndexdWord = last(a.list) as anagram.IndexedWord;
    const newWord = newIndexdWord.word.word;
    if (currentWord !== newWord) {
      currentWordIndex = subanagrams.findIndex(a => a.word.word === newWord);
      currentWord = newWord;
    }
    groups[currentWordIndex].list.push(a);
    for (let subangram of a.list) {
      const currentWordIndex = subanagrams.findIndex(a => a.word.word === subangram.word.word);
      groups[currentWordIndex].counter += 1;
    }
  }
  
  // all anagrams that are less than the currentWordIndex and have an empty list have no solutino
  for(let i = 0; i < groups.length; i++) {
    const group = groups[i];
    group.checked = i < currentWordIndex;
  }

  return groups;
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

  const groupedAnagrams = groupAnagramsByStartWord(subanagrams, anagrams);
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
  requestAnagram() {
    console.log('request anagram', this.state.cleanedQuery);

    const cleanedQuery = anagram.sanitizeQuery(this.state.query);

    const {
      subanagrams,
      generator,
    } = anagram.findAnagramSentences(cleanedQuery, anagram.dictionaries.engUS1);

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
    const possibilities = triangularPyramidal(this.state.subanagrams.length);

    return (
      <div>
        <AnagramaniaHeader>
          <AnagramaniaInnerContainer>
            <AnagramaniaTitle>
              {'Anagramania.io'}
            </AnagramaniaTitle>
            <AnagramaniaForm onSubmit={(e) => {
              e.preventDefault();
              this.requestAnagram();
              }}>
              <AnagramaniaInput
                type="text"
                onChange={(e: any) => this.onQueryChange(e.target.value)}
              />
              <SearchButton>
                {'Go!'}
              </SearchButton>
            </AnagramaniaForm>
          </AnagramaniaInnerContainer>
        </AnagramaniaHeader>
        <AnagramaniaInnerContainer>
          {
            (isLoading || isDone) ? (
              <div>
                <SubHeader>
                  {`I found ${this.state.subanagrams.length} subanagrams.`}
                </SubHeader>
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
          <AnagramaniaFooter>
            {'Made by Tom Nick & Taisia Tikhnovetskaya'}
          </AnagramaniaFooter>
        </AnagramaniaInnerContainer>
      </div>
    );
  }
};

ReactDom.render(
  <Anagramania />,
  document.getElementById('root'),
);
