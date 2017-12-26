import * as React from 'react';
import styled from 'styled-components';

import Header from 'src/components/Header';
import Title from 'src/components/Title';
import InnerContainer from 'src/components/InnerContainer';

const WordContainer = styled.div`
  padding-top: 20px;
  text-align: center;
`;

const Word = styled.strong`
  display: inline-block;
  color: transparent;
  font-size: 36px;
  position: relative;
  font-family: monospace;
`;

const Character = styled.span`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  transition: left 0.3s ease-out;
`;

const ExplainText = styled.p`
  text-align: center;
  color: white;
`;

function parseSearch(search: string) {
  const splitRe = /\?|&/g;
  const splitted = search.split(splitRe).filter(s => s.length > 0);
  const results = splitted.reduce(
    (current: any, next) => {
      const [key, value] = next.split('=');
      const decodedValue = decodeURIComponent(value);
      const newSet = {[key]: decodedValue};
      return {...current, ...newSet};
    }, {});
  return results;

}

const Share: React.StatelessComponent<{
  word: string;
  anagram: string;
}> = ({word, anagram}) => {
  const CHARACTER_WIDTH = 22;
  return (
    <div>
      <Header>
        <InnerContainer>
          <Title>
            {'Share'}
          </Title>
        </InnerContainer>
      </Header>
      <InnerContainer>
        <ExplainText
          dangerouslySetInnerHTML={{
            __html: `Did you know that <strong>${word}</strong> is an anagram of <strong>${anagram}</strong>?`
          }}
        />
        <WordContainer>
          <Word>
            {word}
            {[...word].map((c, i) => {
              const left = i * CHARACTER_WIDTH;
              return <Character style={{left}}>{c}</Character>
            })}
          </Word>
          <Word>
            {anagram}
            {[...anagram].map((c, i) => {
              const left = i * CHARACTER_WIDTH;
              return <Character style={{left}}>{c}</Character>
            })}
          </Word>
        </WordContainer>
      </InnerContainer>
    </div>
  );
};


class ShareContainer extends React.Component<{}, {
  anagram: string;
  word: string;
}> {
  constructor(props) {
    super(props);
    this.state = {
      anagram: '',
      word: '',
    };
  }
  componentWillMount() {
    const location = window.location;
    const search = location.search;
    const parsedSearch = parseSearch(search);
    if (parsedSearch.anagram && parsedSearch.word) {
      this.setState ({
        word: parsedSearch.word,
        anagram: parsedSearch.anagram,
      });
    }
  }
  render() {
    const {word, anagram} = this.state;
    return (
      <Share
        word={word}
        anagram={anagram}
      />
    );
  }
}

export default ShareContainer;