import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as keymaster from 'keymaster';
import styled from 'styled-components';
import {random, range, sample, throttle} from 'lodash';
import axios, {AxiosPromise} from 'axios';

import * as anagram from 'src/anagram';

console.log(anagram, 'hey');


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
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const AnagramaniaFooter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
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

interface AnagramResult {
  word: string;
  popularity: number;
  set: string[];
}

interface AnagramSetResult {
  set: string[];
  list: AnagramResult[];
}

const ResultContainer = styled.div`
  color: white;
  width: 200px;
  margin: 5px;
`;

const Result: React.StatelessComponent<{
  result: AnagramResult;
}> = ({result}) => {
  return (
    <ResultContainer>
      {result.word}
    </ResultContainer>
  );
}

const SetResult: React.StatelessComponent<{
  result: AnagramSetResult;
}> = ({result}) => {
  return (
    <ResultContainer>
      {result.list.map(r => {
        return r.word + ' ';
      })}
    </ResultContainer>
  );
}

class Anagramania extends React.Component<{}, {
  queryStatus: RequestStatus;
  query: string;
  // anagrams: AnagramResult[];
  anagrams: AnagramSetResult[];
}> {
  request: AxiosPromise;
  constructor(props: any) {
    super(props);
    this.state = {
      queryStatus: RequestStatus.none,
      query: '',
      anagrams: [],
    };
  }
  onQueryChange(query: string) {
    this.setState({
      query
    });
  }
  requestAnagram() {
    console.log('request anagram', this.state.query);
    const request = getAnagramSentences(this.state.query);
    this.request = request;
    this.setState({
      queryStatus: RequestStatus.loading,
    });
    request.then(result => {
      console.log(result);
      this.setState({
        queryStatus: RequestStatus.success,
        anagrams: result.data,
      });
    });
  }
  render() {
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
            {this.state.anagrams.map(a => {
              return (
                <SetResult result={a}/>
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
