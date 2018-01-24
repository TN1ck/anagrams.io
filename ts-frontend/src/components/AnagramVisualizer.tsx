import * as React from 'react';
import styled from 'styled-components';
import { YELLOW, ORANGE } from 'src/constants';
import {drawPath} from 'src/utility';
import {getAangramMapping, stringToWord, sanitizeQuery} from 'src/anagram';
import Card from './Card';
import InnerContainer from './InnerContainer';

import {
  SmallButton,
} from '../pages/Anagramania/components';

const WordContainer = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
`;

const Word = styled.strong`
  white-space: nowrap;
  display: inline-block;
  /* color: transparent; */
  font-size: 36px;
  position: relative;
  font-family: monospace;
  letter-spacing: 0.5px;
  & span {
    display: inline-block;
    margin-bottom: -2px;
    height: 1.1em;
    width: 100%;
    &.edit {
      outline: none;
      border-bottom: 4px dashed grey;
    }
  }
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

const ShareSection = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const CopyButton = styled.button`
  background-color: ${YELLOW};
  outline: none;
  border: none;
  padding: 6px;
  &:hover {
    background-color: ${ORANGE};
    cursor: pointer;
  }
`;

const CopyInput = styled.input`
  display: inline-block;
  outline: none;
  font-size: 12px;
  padding: 4px;
  min-width: 200px;
`;

const ExplainText = styled.p`
  color: black;
  text-align: center;
`;

class AnagramVisualizer extends React.Component<{
  word: string;
  anagram: string;
  save?: (word: string, anagram: string) => any;
  close?: () => any;
}, {
  mode: string;
  currentWord: string;
  currentAnagram: string;
}> {
  constructor(props) {
    super(props);
    this.state = {
      // mode: 'view',
      mode: 'view',
      currentWord: this.props.word,
      currentAnagram: this.props.anagram,
    };
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.onChangeAnagram = this.onChangeAnagram.bind(this);
    this.onChangeWord = this.onChangeWord.bind(this);
  }
  edit() {
    this.setState({
      mode: 'edit',
    });
  }
  save() {
    this.props.save(this.state.currentAnagram, this.state.currentWord);
    this.setState({
      mode: 'view',
    });
  }
  onChangeWord(e) {
    const currentWord = e.target.innerText;
    this.setState({
      currentWord,
    })
  }
  onChangeAnagram(e) {
    const currentAnagram = e.target.innerText;
    this.setState({
      currentAnagram,
    })
  }
  copyToClipboard() {
    const input: HTMLInputElement = document.getElementById('link-input') as HTMLInputElement;
    input.select();
    try {
      document.execCommand('copy');
    } catch(err) {
      console.log('Copy did not work');
    }
  }
  render() {

    let {word, anagram} = this.props;
    const {currentAnagram, currentWord} = this.state;

    const anagramWord = stringToWord(sanitizeQuery(currentAnagram));
    const wordWord = stringToWord(sanitizeQuery(currentWord));
    const isCorrectAnagram = anagramWord.set === wordWord.set;

    const editable = this.state.mode === 'edit';
    const useState = editable && isCorrectAnagram;

    if (useState) {
      word = currentWord;
      anagram = currentAnagram;
    }

    const MAX_WIDTH = Math.min(700, window.innerWidth - 60);

    const WORD_LENGTH = Math.max(word.length, anagram.length);
    const CHARACTER_WIDTH = Math.min(MAX_WIDTH / WORD_LENGTH, 22);
    const WORD_WIDTH = WORD_LENGTH * CHARACTER_WIDTH;

    const mapping = getAangramMapping(word, anagram);

    const STROKE_WIDTH = 10;
    const PADDING_TOP = 20;
    const PADDING_BOTTOM = 20;
    const HEIGHT_PER_CHARACTER = STROKE_WIDTH * 1.8
    const HEIGHT = PADDING_TOP + word.length * HEIGHT_PER_CHARACTER + PADDING_BOTTOM;

    const CHARACTER_WIDTH_RATIO = 1.63;
    const FONT_SIZE = CHARACTER_WIDTH * CHARACTER_WIDTH_RATIO;

    const opacityScale = (index) => {
      return 0.2 + (0.8 / word.length * (word.length - index));
    };

    const minWidth = WORD_WIDTH + 30 * 2;

    const LINK = `${window.location.hostname}/share?anagram=${encodeURIComponent(currentAnagram)}&word=${encodeURIComponent(currentWord)}`;

    return (
      <Card style={{minWidth, paddingBottom: 60, ...(editable ? {border: '2px dashed grey'} : {})}}>
          {
            editable ?
            <ExplainText
              dangerouslySetInnerHTML={{
                __html: `
                  You are in edit mode.
                  <br/>
                  Here you can change both anagrams and save it.
                  <br/>
                  Change the <strong>order</strong>, <strong>capitalisation</strong> or add some <strong>spaces</strong>.
                  <br/>
                  You're current edit is
                  ${isCorrectAnagram ? "<strong style='color: green'>valid</strong>" : "<strong style='color: red'>invalid</strong>"}.
                  `
              }}
            />
            : <ExplainText
              dangerouslySetInnerHTML={{
                __html: `Did you know that <br/><strong>${word}</strong><br/>is an anagram of <br/><strong>${anagram}</strong>?`
              }}
            />
          }
          <WordContainer>
            <div>
              <Word style={{minWidth: WORD_WIDTH, fontSize: FONT_SIZE}}>
                <span onInput={this.onChangeWord} id="word-span" className={editable ? 'edit' : ''} contentEditable={editable}>
                  {this.props.word}
                </span>
                {/* {[...word].map((c, i) => {
                  const left = i * CHARACTER_WIDTH;
                  return <Character style={{left}}>{c}</Character>
                })} */}
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
                    const opacity = opacityScale(index);
                    const yOffset = PADDING_TOP + HEIGHT_PER_CHARACTER * index;
                    const path = drawPath(x1, y1, x2, y2, yOffset);
                    return (
                      <path
                        key={index}
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
              <Word style={{minWidth: WORD_WIDTH, fontSize: FONT_SIZE}}>
                <span onInput={this.onChangeAnagram} id="anagram-span" className={editable ? 'edit' : ''} contentEditable={editable}>
                  {this.props.anagram}
                </span>
                {/* {[...anagram].map((c, i) => {
                  const left = i * CHARACTER_WIDTH;
                  return <Character style={{left}}>{c}</Character>
                })} */}
              </Word>
            </div>
          </WordContainer>
        <ShareSection>
          {`Share it using this Link: `}
          <CopyInput id="link-input" type="text" value={LINK} />
          <CopyButton onClick={this.copyToClipboard}>{'COPY'}</CopyButton>
        </ShareSection>
        {this.props.close ? <SmallButton
          onClick={this.props.close}
          active={false}
          style={{position: 'absolute', right: 10, top: 5}}
        >
          {'Close'}
        </SmallButton> : null}
        <SmallButton
          onClick={editable ? this.save : this.edit}
          active={false}
          style={{position: 'absolute', left: 10, bottom: 10}}
        >
          {editable ? 'Save': 'Edit'}
        </SmallButton>
      </Card>
    );
  }
};

export default AnagramVisualizer;