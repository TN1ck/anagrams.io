import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as keymaster from 'keymaster';
import styled from 'styled-components';
import {random, range, sample, throttle} from 'lodash';
import axios, {AxiosPromise} from 'axios';

import * as anagram from 'src/anagram';

const BACKEND_URL = 'http://localhost:3000';
const DARK_BLUE = '#34495e';
const GREY = '#95a5a6';

function getAnagram(query: string) {
  return axios.get(BACKEND_URL + '/anagram/' + query);
}

function getAnagramSentences(query: string) {
  return axios.get(BACKEND_URL + '/anagram-sentences/' + query);
}

const AnagramaniaInput = styled.input`
  border: 2px solid ${GREY};
  height: 25px;
  width: 100%;
`;

// const AnagramaniaForm = styled.form`
//   display: flex;
// `;

const AnagramaniaTitle = styled.h1`
  color: white;
  font-size: 40pt;
  margin: 0;
  padding: 0;
`

const AnagramaniaInnerContainer = styled.div`
  // display: flex;
  // justify-content: center;
  // flex-direction: column;
`;

const AnagramaniaContainer = styled.div`
  background: ${DARK_BLUE};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: scroll;
  display: flex;
  justify-content: center;
  padding-top: 100px;
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
`;

const Result: React.StatelessComponent<{
  result: anagram.AnagramSolution;
}> = ({result}) => {
  return (
    <ResultContainer>
      {[...result.list].reverse().map(w => {
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
    });

    console.log(subanagrams);
    const solutions = [];
    const gen = generator();
    for (let i = 0; i < 100000; i++) {
      const value = gen.next();
      if (value.done) {
        break;
      }
      if (value.value.solution) {
        console.log('solution', value.value.current);
        solutions.push(value.value.current);
        this.setState({
          solutions,
        })
      }
    }

  }
  render() {
    console.log(this.state.solutions);
    return (
      <div>
        <AnagramaniaContainer>
          <AnagramaniaInnerContainer>
            <AnagramaniaTitle>
              {'Anagramania'}
            </AnagramaniaTitle>
            <form onSubmit={(e) => {
              e.preventDefault();
              this.requestAnagram();
              }}>
              <AnagramaniaInput
                type="text"
                onChange={(e: any) => this.onQueryChange(e.target.value)}
              />
            </form>
            {this.state.solutions.map(a => {
              return (
                <Result result={a}/>
              )
            })}
          </AnagramaniaInnerContainer>
        </AnagramaniaContainer>
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
