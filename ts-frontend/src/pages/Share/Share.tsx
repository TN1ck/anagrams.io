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

//
// Drawing cool paths
// * M is the start point
// * L draws a line to x/y
// * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
// * Z close the path
//

const ARC_RADIUS = 10;
const STROKE_WIDTH = 3;


function drawPath(x1: number, y1: number, x2: number, y2: number, yOffset: number): string {
  const xDistance = Math.abs(x2 - x1);
  const yDistance = Math.abs(y2 - y1);
  const intermediateY = y1 + ((yDistance / 2) + yOffset * STROKE_WIDTH);
  
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
  let index1 = 0;
  let index2 = 0;
  for (let s of w1) {
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
  }
  return resultMapping;
}

console.log(getAangramMapping('OOOscar Wilde', 'OCowards LieO'));

const Share: React.StatelessComponent<{
  word: string;
  anagram: string;
}> = ({word, anagram}) => {
  const CHARACTER_WIDTH = 22;
  const WORD_WIDTH = word.length * CHARACTER_WIDTH;

  const mapping = getAangramMapping(word, anagram);

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
          <div>
            <svg height="100px" width={WORD_WIDTH} style={{overflow: 'visible'}}>
              {mapping.map((newIndex, index) => {
                const x1 = (index * CHARACTER_WIDTH) + CHARACTER_WIDTH / 2;
                const y1 = 0;
                const x2 = (newIndex * CHARACTER_WIDTH) + CHARACTER_WIDTH / 2;
                const y2 = 100;
                return (
                  <path
                    stroke="white"
                    fill="transparent"
                    strokeWidth="2"
                    d={drawPath(x1, y1, x2, y2, index)}
                  />
                );
              }}
            </svg>
          </div>
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