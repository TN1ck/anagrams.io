import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as keymaster from 'keymaster';
import styled from 'styled-components';
import {random, range, sample, throttle} from 'lodash';
import axios, {AxiosPromise} from 'axios';

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
`;

const AnagramaniaTitle = styled.h1`
  color: white;
  font-size: 4rem;
  font-weight: 300;
  margin: 2.5rem;
  padding: 0;
`

const AnagramaniaInnerContainer = styled.div`
  max-width: 900px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
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
  position: absolute;
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
  color: white;
  width: 200px;
  margin: 5px;
  white-space: nowrap;
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
class Anagramania extends React.Component<{}, {
  queryStatus: RequestStatus;
  query: string;
  // anagrams: AnagramResult[];
  subanagrams: anagram.IndexedWord[];
  solutions: anagram.AnagramSolution[];
}> {
  request: AxiosPromise;
  constructor(props: any) {
    super(props);
    this.state = {
      queryStatus: RequestStatus.none,
      query: '',
      subanagrams: [],
      solutions: [],
    };
  }
  onQueryChange(query: string) {
    this.setState({
      query
    });
  }
  requestAnagram() {
    console.log('request anagram', this.state.query);

    const {
      subanagrams,
      generator,
    } = anagram.findAnagramSentences(this.state.query, anagram.dictionaries.engUS1);

    this.setState({
      subanagrams,
      solutions: [],
      queryStatus: RequestStatus.loading,
    });

    const solutions: anagram.AnagramSolution[] = [];
    let breakLoop = false;
    setTimeout(() => {
      const gen = generator();
      for (let i = 0; i < 100000; i++) {
        if (breakLoop) {
          this.setState({
            queryStatus: RequestStatus.success,
          });
          break;
        }
        setTimeout(() => {
          const value = gen.next();
          if (!value || value.done) {
            breakLoop = true;;
          }
          if (value.value && value.value.solution) {
            solutions.push(value.value.current);
            this.setState({
              solutions,
            })
          }
        })
      }
    })

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
                  {`I found ${this.state.subanagrams.length} subanagrams, checking up to ${possibilities} possibilities.`}
                </SubHeader>
                <strong style={{color: 'white'}}>{`Note: currently limiting to 10000 iterations`}</strong>
                {this.state.solutions.map((a, i) => {
                  return (
                    <Result key={i} result={a} index={i} />
                  )
                })}
              </div>
            ) : null
          }
          {
            isDone ? (
              <strong style={{color: 'white'}}>
                {`Found ${this.state.solutions.length} solutions.`}
              </strong>
            ) : null
          }
        </AnagramaniaInnerContainer>
        <AnagramaniaFooter>
          {'Made by Tom Nick & Taisia Tikhnovetskaya'}
        </AnagramaniaFooter>
      </div>
    );
  }
};

ReactDom.render(
  <Anagramania />,
  document.getElementById('root'),
);
