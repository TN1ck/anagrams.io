import * as React from 'react';
import styled from 'styled-components';
import { FRONTEND_URL } from 'src/constants';
import {drawPath} from 'src/utility';
import {getAnagramMapping, stringToWord, sanitizeQuery} from 'src/anagram';
import {Card} from 'src/components/Layout';
import {THEME} from 'src/theme';

import {
  SmallButton,
} from './Buttons';

const Copyright = styled.div`
  font-size: ${THEME.font.sizeSmall};
  position: absolute;
  top: ${THEME.margins.m2};
  left: ${THEME.margins.m2};
  opacity: 0.3;
`;

const WordContainer = styled.div`
  padding-top: ${THEME.margins.m2};
  display: flex;
  justify-content: center;
`;

export const Word = styled.strong`
  white-space: nowrap;
  display: inline-block;
  /* color: transparent; */
  font-size: 36px;
  position: relative;
  font-family: ${THEME.font.family};
  letter-spacing: 0.5px;
  & span {
    display: inline-block;
    margin-bottom: -2px;
    height: 1.1em;
    width: 100%;
    &.edit {
      outline: none;
      border-bottom: 4px dashed ${THEME.colors.border};
    }
  }
`;

const ShareSection = styled.div`
  margin-top: ${THEME.margins.m3};
  text-align: center;
  margin-left: -${THEME.margins.m4};
  margin-right: -${THEME.margins.m4};
`;

const CopyButton = styled.button`
  margin: 0;
  color: ${THEME.searchBar.buttonTextColor};
  font-size: ${THEME.font.sizeSmall};
  background-color: ${THEME.searchBar.buttonColor};
  outline: none;
  border: none;
  padding: ${THEME.margins.m1} ${THEME.margins.m2};
  border: 1px solid ${THEME.colors.border};
  &:hover {
    background-color: ${THEME.searchBar.buttonColorHover};
    cursor: pointer;
  }
`;

const CopyInput = styled.input`
  margin: 0;
  display: inline-block;
  outline: none;
  border: 1px solid ${THEME.colors.border};
  border-right: none;
  font-size: ${THEME.font.sizeSmall};
  padding: ${THEME.margins.m1};
  border-radius: ${THEME.borderRadius};
  margin: 0;
  min-width: 190px;
`;

const ExplainText = styled.p`
  color: ${THEME.colors.foregroundText};
  text-align: center;
`;

const PADDING_TOP = 20;
const PADDING_BOTTOM = 20;

export function calculateWidths(
  word: string, anagram: string, maxWidth: number, paddingTop = PADDING_TOP, paddingBottom = PADDING_BOTTOM,
) {
  const CHARACTER_WIDTH_RATIO = 1.95;
  const CHARACTER_HEIGHT_RATIO = 1.8;

  const wordLength = Math.max(word.length, anagram.length);
  const characterWidth = Math.min(maxWidth / (wordLength * 1.5), 22);
  const wordWidth = wordLength * characterWidth;

  const strokeWidth = characterWidth / 2;
  const characterHeight = strokeWidth * CHARACTER_HEIGHT_RATIO;
  const height = paddingTop + word.length * characterHeight + paddingBottom;

  const fontSize = characterWidth * CHARACTER_WIDTH_RATIO;


  return {
    height,
    fontSize,
    wordWidth,
    strokeWidth,
    characterHeight,
    characterWidth,
    paddingTop,
    paddingBottom,
  };
}

interface AnagramVisualizerProps {
  word: string;
  anagram: string;
  save?: (word: string, anagram: string) => any;
  close?: () => any;
}

export const AnagramSausages: React.StatelessComponent<{
  anagram: string,
  word: string,
  height: number,
  wordWidth: number,
  characterWidth: number,
  characterHeight: number,
  paddingTop: number,
  strokeWidth: number,
}> = ({
  height,
  wordWidth,
  characterWidth,
  word,
  anagram,
  characterHeight,
  paddingTop,
  strokeWidth,
}) => {

  const mapping = getAnagramMapping(word, anagram);

  const opacityScale = (index) => {
    return 0.2 + (0.8 / word.length * (word.length - index));
  };

  return (
    <svg height={height} width={wordWidth} style={{overflow: 'visible'}}>
      {mapping.map((newIndex, index) => {
        if (newIndex === undefined) {
          return null;
        }
        const x1 = (index * characterWidth) + characterWidth / 2;
        const y1 = 0;
        const x2 = (newIndex * characterWidth) + characterWidth / 2;
        const y2 = height;
        const opacity = opacityScale(index);
        const yOffset = paddingTop + characterHeight * index;
        const path = drawPath(x1, y1, x2, y2, yOffset, strokeWidth);
        return (
          <path
            key={index}
            opacity={opacity}
            stroke="black"
            fill="transparent"
            strokeWidth={strokeWidth}
            d={path}
          />
        );
      })}
    </svg>
  );
};

class AnagramVisualizer extends React.Component<AnagramVisualizerProps, {
  mode: string;
  currentWord: string;
  currentAnagram: string;
}> {
  wordSpan: HTMLSpanElement;
  anagramSpan: HTMLSpanElement;
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
  componentDidMount() {
    this.setSpanContent(this.props);
  }
  componentWillReceiveProps(props) {
    if (this.props.word !== props.word || this.props.anagram !== this.props.anagram) {
      this.setSpanContent(props);
    }
  }
  setSpanContent(props: AnagramVisualizerProps) {
    this.anagramSpan.innerHTML = props.anagram;
    this.wordSpan.innerHTML = props.word;
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

    const maxWidth = Math.min(700, window.innerWidth - (60 + 30) );
    const {
      wordWidth,
      fontSize,
      height,
      characterWidth,
      characterHeight,
      strokeWidth,
    } = calculateWidths(word, anagram, maxWidth);
    const minWidth = wordWidth + 30 * 2;

    const LINK = `${FRONTEND_URL}/share?anagram=${encodeURIComponent(currentAnagram)}&word=${encodeURIComponent(currentWord)}`;

    return (
      <Card style={{minWidth, paddingBottom: 60, ...(editable ? {border: '2px dashed grey'} : {})}}>
          {/* {
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
          } */}
          <WordContainer>
            <div>
              <Word style={{minWidth: wordWidth, fontSize: fontSize}}>
                <span
                  onInput={this.onChangeWord}
                  id="word-span"
                  className={editable ? 'edit' : ''}
                  contentEditable={editable}
                  ref={(dom) => this.wordSpan = dom}
                />
              </Word>
              <div>
                <AnagramSausages
                  anagram={anagram}
                  word={word}
                  height={height}
                  wordWidth={wordWidth}
                  characterWidth={characterWidth}
                  characterHeight={characterHeight}
                  paddingTop={PADDING_TOP}
                  strokeWidth={strokeWidth}
                />
              </div>
              <Word style={{minWidth: wordWidth, fontSize: fontSize}}>
                <span
                  onInput={this.onChangeAnagram}
                  id="anagram-span"
                  className={editable ? 'edit' : ''}
                  contentEditable={editable}
                  ref={(dom) => this.anagramSpan = dom}
                />
              </Word>
            </div>
          </WordContainer>
        <ShareSection>
          {`Share it using this Link: `}
          <CopyInput readOnly id="link-input" type="text" value={LINK} />
          <CopyButton onClick={this.copyToClipboard}>{'Copy'}</CopyButton>
        </ShareSection>
        {this.props.close ? <SmallButton
          onClick={this.props.close}
          active={false}
          style={{position: 'absolute', right: THEME.margins.m2, top: THEME.margins.m2}}
        >
          {'Close'}
        </SmallButton> : null}
        <SmallButton
          onClick={editable ? this.save : this.edit}
          active={false}
          style={{position: 'absolute', left: THEME.margins.m2, bottom: THEME.margins.m2}}
        >
          {editable ? 'Save': 'Edit'}
        </SmallButton>
        <Copyright>
          {'anagrams.io'}
        </Copyright>
      </Card>
    );
  }
};

export default AnagramVisualizer;