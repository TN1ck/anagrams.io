import React from 'react';
import * as Components from '../components';
import {MARGIN_RAW, THEME} from 'src/theme';
import {
  ResultBestOf,
} from 'src/molecules/AnagramResult';

const BEST_OF_DATA_ENGLISH = [
  {
    word: 'Vladimir Putin',
    anagram: 'I invalid Trump'
  },
  // {
  //   word: 'Oscar Wilde',
  //   anagram: 'Cowards Lie'
  // },
  {
    word: 'United States of America',
    anagram: 'Administrates a cute foe'
  },
  {
    word: 'Russian Federation',
    anagram: 'Infantries aroused'
  },
  {
    word: 'Friendzone',
    anagram: 'I end frozen'
  },
  {
    word: 'Americans',
    anagram: 'Can armies'
  },
  {
    word: 'Germany',
    anagram: 'My anger'
  },
  {
    word: 'Paradise',
    anagram: 'A despair',
  },
  {
    word: 'Christianity',
    anagram: 'Hi tiny racist'
  },
  {
    word: 'Make a selfie',
    anagram: 'Same fake lie'
  },
  {
    word: 'We won this',
    anagram: 'Now we shit'
  }
];

const BEST_OF_DATA_GERMAN = [
  {
    word: 'Bundesregierung',
    anagram: 'Unsre Beerdigung'
  },
  {
    word: 'Angela Merkel',
    anagram: 'Klare Maengel'
  },
  {
    word: 'Albert Einstein',
    anagram: 'Internatsliebe'
  },
  {
    word: 'Martin Schulz',
    anagram: 'Schmilzt Uran'
  }
];

class About extends React.Component {
  render() {
    return (
      <div>
        <Components.Header style={{paddingBottom: MARGIN_RAW.m2, background: 'transparent'}}>
          <Components.InnerContainer style={{maxWidth: 670}}>
            <Components.Title>
              {'Best Of'}
            </Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer style={{maxWidth: 740}}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: -10,
        }}>
          <Components.SubTitleContainer>
            <Components.SubTitle>
              {'English'}
            </Components.SubTitle>
          </Components.SubTitleContainer>
          {
            BEST_OF_DATA_ENGLISH.map(({word, anagram}, i) => {
              return (
                <ResultBestOf
                  key={i}
                  anagram={anagram}
                  word={word}
                />
              );
            })
          }
          <Components.SubTitleContainer>
            <Components.SubTitle>
              {'German'}
            </Components.SubTitle>
          </Components.SubTitleContainer>
          {
            BEST_OF_DATA_GERMAN.map(({word, anagram}, i) => {
              return (
                <ResultBestOf
                  key={i}
                  anagram={anagram}
                  word={word}
                />
              );
            })
          }
          <Components.SubTitleContainer style={{textAlign: 'center', marginTop: THEME.margins.m4}}>
            <a className="link" href="mailto:tomwanick@gmail.com">Found a cool anagram? Send it to us!</a>
          </Components.SubTitleContainer>
        </div>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default About;
