import * as React from 'react';
import styled from 'styled-components';

import Header from 'src/components/Header';
import Title from 'src/components/Title';
import HeaderContainer from 'src/components/HeaderContainer';
import InnerContainer from 'src/components/InnerContainer';
import { YELLOW, ORANGE } from 'src/constants';
import {
  SmallButton,
} from '../Anagramania/components';

const WordContainer = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background-color: #EEE;
  width: 500px;
  margin: 0 auto;
  margin-top: 40px;
  padding: 40px;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.2);
  position: relative;
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
  color: black;
  transition: left 0.3s ease-out;
`;

const CTAButton = styled.a`
  background: none;
  padding-bottom: 2px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  outline: none;
  color: black;
  border-bottom: 4px solid ${YELLOW};
  text-decoration: none;
  &:hover {
    border-bottom: 4px solid ${ORANGE};
  }
`;

const ExplainText = styled.p`
  color: black;
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

//
// Drawing cool paths
// * M is the start point
// * L draws a line to x/y
// * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
// * Z close the path
//

const ARC_RADIUS = 10;

function drawPath(x1: number, y1: number, x2: number, y2: number, yOffset: number): string {
  // const xDistance = Math.abs(x2 - x1);
  const yDistance = Math.abs(y2 - y1);
  const intermediateY = y1 + (yOffset);
  
  if (x2 > x1) {
    return `
      M ${x1}, ${y1}
      L ${x1},${intermediateY}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 ${x1 + ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      L ${x2 - ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${x2} ${intermediateY + ARC_RADIUS * 2}
      L ${x2} ${y2}
    `;
  }

  if (x1 > x2) {
    return `
      M ${x1}, ${y1}
      L ${x1},${intermediateY}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${x1 - ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      L ${x2 + ARC_RADIUS} ${intermediateY + ARC_RADIUS}
      A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 ${x2} ${intermediateY + ARC_RADIUS * 2}
      L ${x2} ${y2}
    `;
  }

  if (x1 === x2) {
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
    `;
  }
}

function getAangramMapping(w1: string, w2: string): number[] {
  w1 = w1.toLowerCase();
  w2 = w2.toLowerCase();
  const mapping = {};
  const resultMapping = [];
  // let index1 = 0;
  // let index2 = 0;
  // let index = 0;
  for (let s of w1) {
    if (s === ' ') {
      resultMapping.push(undefined);
      continue;
    }
    // check if the char was already used once
    let chars = mapping[s] || [];
    mapping[s] = chars;
    let lastPosition = 0;
    if (chars.length > 0) {
      // add +1 to search starting from the next string
      lastPosition = chars[chars.length - 1] + 1;
    }
    const sInW2 = w2.indexOf(s, lastPosition);
    chars.push(sInW2);
    resultMapping.push(sInW2);
    // index++;
  }
  return resultMapping;
}

console.log(getAangramMapping('OOOscar Wilde', 'OCowards LieO'));

class Share extends React.Component<{
  word: string;
  anagram: string;
}> {
  render() {
    const {word, anagram} = this.props;
    const CHARACTER_WIDTH = 22;
    const WORD_WIDTH = word.length * CHARACTER_WIDTH;

    const mapping = getAangramMapping(word, anagram);

    const STROKE_WIDTH = 10;
    const PADDING_TOP = 20;
    const PADDING_BOTTOM = 20;
    const HEIGHT_PER_CHARACTER = STROKE_WIDTH * 1.8
    const HEIGHT = PADDING_TOP + word.length * HEIGHT_PER_CHARACTER + PADDING_BOTTOM;

    return (
      <div>
        <Header>
          <InnerContainer>
            <HeaderContainer>
              <Title>
                {'Anagramania.io'}
              </Title>
            </HeaderContainer>
          </InnerContainer>
        </Header>
        <Card>
          <InnerContainer>
            <ExplainText
              style={{textAlign: 'center'}}
              dangerouslySetInnerHTML={{
                __html: `Did you know that <strong>${word}</strong><br/>is an anagram of <strong>${anagram}</strong>?`
              }}
            />
            <WordContainer>
              <div>
                <Word>
                  {word}
                  {[...word].map((c, i) => {
                    const left = i * CHARACTER_WIDTH;
                    return <Character style={{left}}>{c}</Character>
                  })}
                </Word>
                <div>
                  <svg height={HEIGHT} width={WORD_WIDTH} style={{overflow: 'visible'}}>
                    {mapping.map((newIndex, index) => {
                      if (newIndex === undefined) {
                        return null;
                      }
                      const x1 = (index * CHARACTER_WIDTH) + CHARACTER_WIDTH / 2;
                      const y1 = 0;
                      const x2 = (newIndex * CHARACTER_WIDTH) + CHARACTER_WIDTH / 2;
                      const y2 = HEIGHT;
                      const opacity = 1 - (0.05 * index);
                      const yOffset = PADDING_TOP + HEIGHT_PER_CHARACTER * index;
                      const path = drawPath(x1, y1, x2, y2, yOffset);
                      return (
                        <path
                          opacity={opacity}
                          stroke="black"
                          fill="transparent"
                          strokeWidth={STROKE_WIDTH}
                          d={path}
                        />
                      );
                    })}
                  </svg>
                </div>
                <Word>
                  {anagram}
                  {[...anagram].map((c, i) => {
                    const left = i * CHARACTER_WIDTH;
                    return <Character style={{left}}>{c}</Character>
                  })}
                </Word>
              </div>
            </WordContainer>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
              <CTAButton href="/">
                {'Find your own anagram now!'}
              </CTAButton>
            </div>
          </InnerContainer>
          <SmallButton
            style={{position: 'absolute', bottom: '5px', left: '5px'}}
            active={false}
          >{'Edit'}</SmallButton>
        </Card>
      </div>
    );
  }
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