import * as React from 'react';
import styled from 'styled-components';
import { FRONTEND_URL } from 'src/constants';
import {drawPath, EasingFunctions} from 'src/utility';
import {getAnagramMapping, stringToWord, sanitizeQuery} from 'src/anagram';
import {Card} from 'src/components/Layout';
import {THEME, MARGIN_RAW} from 'src/theme';
import {interpolateArray} from 'd3-interpolate';

import {
  SmallButton,
} from './Buttons';
import { getHeapStatistics } from 'v8';

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

export const StyledWord = styled.strong`
  white-space: nowrap;
  display: block;
  /* color: transparent; */
  font-size: 36px;
  position: relative;
  font-family: ${THEME.font.family};
  letter-spacing: 0.5px;
  user-select: none;
`;

class WordLetter extends React.Component<{
  characterWidth: number;
  position: number;
  left: number;
  letter: string;
}> {
  render() {
    const {
      characterWidth,
      position,
      left,
      letter,
    } = this.props;
    return (
      <span
        style={{
          transition: 'all 500ms ease-in-out',
          display: 'block',
          width: characterWidth,
          position: 'absolute',
          top: 0,
          transform: `translate(${position}px, 0)`,
          left: left,
        }}>
        {letter}
      </span>
    );
  }
}

export class Word extends React.Component<{
  characterWidth: number;
  fontSize: number;
  word: string;
  anagram: string;
  wordWidth?: number;
}> {
  render() {
    const anagram = this.props.anagram;
    const word = this.props.word;
    const mapping = getAnagramMapping(word, anagram);
    const wordWidth = this.props.wordWidth || 0;
    return (
      <StyledWord style={{fontSize: this.props.fontSize, height: this.props.fontSize}}>
        {word.split('').map((_, i) => {
          const index = mapping[i]
          const position = index * this.props.characterWidth;
          const c2 = anagram[index];
          return (
            <WordLetter
              key={index}
              letter={c2}
              position={position}
              characterWidth={this.props.characterWidth}
              left={-wordWidth / 2}
            />
          );
        })}
      </StyledWord>
    );
  }
}

export function calculateWidths(
  word: string, anagram: string, fontSize: number
) {

  const WIDTH_PER_PIXEL = 0.5992857143;
  const HEIGHT_PER_PIXEL = 1.13;

  const letterWidth = WIDTH_PER_PIXEL * fontSize; // at 14px
  const letterHeight = HEIGHT_PER_PIXEL * fontSize;

  const strokeWidth = letterWidth / 2;

  const maxLength = Math.max(word.length, anagram.length);
  const width = maxLength * letterWidth;

  const height = maxLength * letterHeight;

  return {
    height,
    width,
    strokeWidth,
    letterWidth,
    letterHeight,
  };
}

interface AnagramVisualizerProps {
  word: string;
  anagram: string;
  save?: (word: string, anagram: string) => any;
  close?: () => any;
}

interface AnagramSausagesProps {
  anagram: string,
  word: string,
  height: number,
  wordWidth: number,
  characterWidth: number,
  characterHeight: number,
  paddingTop: number,
  strokeWidth: number,
  animationDuration?: number;
  letterOffsets?: Array<{x: number, y: number}>;
}

interface AnagramSausage {
  pathData: number[];
  strokeWidth: number;
  opacity: number;
}

export class AnagramSausages extends React.Component<AnagramSausagesProps, {
  sausages: AnagramSausage[],
}> {
  constructor(props) {
    super(props);
    const sausages = this.calculateSausages(props);
    this.state = {
      sausages,
    };
  }
  componentWillReceiveProps(newProps: AnagramSausagesProps) {
    if (newProps.anagram !== this.props.anagram || newProps.word !== this.props.word) {
      const newSausages = this.calculateSausages(newProps);
      const oldSausages = this.state.sausages;
      this.animateSausages(oldSausages, newSausages);
      // this.animateToProgress(oldSausages, newSausages, 0.2);
    }
  }
  animateToProgress(oldSausages, newSausages, progress) {
    const interpolatedSausages = oldSausages.map((s, i) => {
      const newSausage = newSausages[i];
      const pathInterpolator = interpolateArray(s.pathData, newSausage.pathData);
      return pathInterpolator;
    });
    const newInterpolatedSausages = oldSausages.map((s, i) => {
      const interpolator = interpolatedSausages[i];
      return {
        ...s,
        pathData: interpolator(progress),
      }
    });
    this.setState({sausages: newInterpolatedSausages});
  }
  animateSausages(oldSausages: AnagramSausage[], newSausages: AnagramSausage[]) {
    const interpolatedSausages = oldSausages.map((s, i) => {
      const newSausage = newSausages[i];
      const pathInterpolator = interpolateArray(s.pathData, newSausage.pathData);
      return pathInterpolator;
    });
    const animationDuration = this.props.animationDuration || 500;
    const startTime = +(new Date());
    const updater = () => {
      const now = +(new Date());
      const diff = now - startTime;
      const progress = diff / animationDuration;
      if (progress < 1.0) {
        const newInterpolatedSausages = oldSausages.map((s, i) => {
          const interpolator = interpolatedSausages[i];
          return {
            ...s,
            pathData: interpolator(EasingFunctions.easeInOutQuad(progress)),
          }
        });
        this.setState({sausages: newInterpolatedSausages});
        requestAnimationFrame(updater);
      } else {
        this.setState({sausages: newSausages});
      }
    };
    updater();
  }
  calculateSausages(props: AnagramSausagesProps) {
    const {
      height,
      characterWidth,
      word,
      anagram,
      characterHeight,
      paddingTop,
      strokeWidth,
    } = props;
    const mapping = getAnagramMapping(word, anagram);

    const opacityScale = (index) => {
      return 0.2 + (0.8 / word.length * (word.length - index));
    };

    const values = mapping.map((newIndex, index) => {
      if (newIndex === undefined) {
        return null;
      }
      const x1 = (index * characterWidth) + characterWidth / 2;
      const y1 = 0;
      const x2 = (newIndex * characterWidth) + characterWidth / 2;
      const y2 = height;
      const opacity = opacityScale(index);
      const yOffset = paddingTop + characterHeight * index;
      return {
        opacity,
        strokeWidth,
        pathData: [
          x1,
          y1,
          x2,
          y2,
          yOffset,
        ],
      };
    });
    return values;
  }

  render() {
    const {
      height,
      wordWidth,
    } = this.props;

    return (
      <svg height={height} width={wordWidth} style={{overflow: 'visible'}}>
        {this.state.sausages.map((d, index) => {
          if (d === null) {
            return;
          }
          const {strokeWidth, opacity, pathData} = d;
          const [x1, y1, x2, y2, yOffset] = pathData;
          let letterOffset = {x: 0, y: 0};
          if (this.props.letterOffsets) {
            const letterOffsetFromProp = this.props.letterOffsets[index];
            if (letterOffsetFromProp) {
              letterOffset.x = letterOffsetFromProp.x;
              letterOffset.y = letterOffsetFromProp.y;
            }
          }
          const path = drawPath(x1, y1, x2 + letterOffset.x, y2 + letterOffset.y, yOffset, strokeWidth);
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
  }

};

class AnagramVisualizer extends React.Component<AnagramVisualizerProps, {
  mode: string;
  currentWord: string;
  currentAnagram: string;
  wordDragState: {
    activeIndex: number;
    mouseDown: boolean;
    isDragging: boolean;
    initialX: number;
    initialY: number;
  };
  wordPositions: {
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
  }[]
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
      wordDragState: {
        mouseDown: false,
        isDragging: false,
        activeIndex: 0,
        initialX: 0,
        initialY: 0,
      },
      wordPositions: [],
    };
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.setWordPosition = this.setWordPosition.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
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
  copyToClipboard() {
    const input: HTMLInputElement = document.getElementById('link-input') as HTMLInputElement;
    input.select();
    try {
      document.execCommand('copy');
    } catch(err) {
      console.log('Copy did not work');
    }
  }
  getWordPosition(index: number) {
    return this.state.wordPositions[index] || {
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
    }
  }
  setWordPosition(ref: HTMLElement, index: number) {
    if (!ref || this.state.wordPositions[index]) {
      return;
    }
    console.log(ref);
    const targetPosition = ref.getBoundingClientRect() as DOMRect;
    const position = {
      width: targetPosition.width,
      height: targetPosition.height,
      startX: targetPosition.x,
      startY: targetPosition.y,
      offsetX: 0,
      offsetY: 0,
    };
    this.state.wordPositions[index] = position;
    this.setState({
      wordPositions: this.state.wordPositions,
    });
  }
  onMouseDown(e: React.MouseEvent<HTMLElement>, wordIndex: number) {
    console.log('on mouse down', wordIndex);
    const pageX = e.pageX;
    const pageY = e.pageY;

    this.setState({
      wordDragState: {
        ...this.state.wordDragState,
        activeIndex: wordIndex,
        mouseDown: true,
        initialX: pageX,
        initialY: pageY,
      }
    });
  }
  onMouseUp(wordIndex) {
    this.setState({
      wordDragState: {
        ...this.state.wordDragState,
        activeIndex: wordIndex,
        mouseDown: false,
      }
    });
  }
  onMouseMove(e) {
    const dragState = this.state.wordDragState;
    const pageX = e.pageX;
    const pageY = e.pageY;
    if (dragState.mouseDown) {
      if (!dragState.isDragging) {
        dragState.isDragging = true;
      }

      const wordPosition = this.state.wordPositions[dragState.activeIndex];

      // console.log(e);
      const offsetX = pageX - dragState.initialX;
      const offsetY = pageY - dragState.initialY;

      wordPosition.offsetX = offsetX,
      wordPosition.offsetY = offsetY,

      this.setState({
        wordDragState: {
          ...dragState,
          isDragging: true,
        },
        wordPositions: this.state.wordPositions,
      })
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

    const fontSize = Math.min(22, window.innerWidth / 20);

    const {
      width,
      height,
      strokeWidth,
      letterHeight,
      letterWidth,
    } = calculateWidths(word, anagram, fontSize);

    const mapping = getAnagramMapping(word, anagram);

    const LINK = `${FRONTEND_URL}/share?anagram=${encodeURIComponent(currentAnagram)}&word=${encodeURIComponent(currentWord)}`;

    const anagramIndexed: Array<[string, number]> = [...anagram]
      .map((w, i) => {
        return [w, i];
      }) as any;

    const anagramSplitted: Array<Array<[string, number]>> = [];
    let currentIndexedWord: Array<[string, number]> = [];
    for (const [w, i] of anagramIndexed) {
      if (w === ' ' && currentIndexedWord.length > 0) {
        anagramSplitted.push(currentIndexedWord);
        currentIndexedWord = [];
        continue;
      }
      currentIndexedWord.push([w, i]);
    }
    if (currentIndexedWord.length > 0) {
      anagramSplitted.push(currentIndexedWord);
    }

    // const anagramSplitted = anagram.split(' ');

    const wordComponents = [];
    let index = 0;
    let wordIndex = 0;
    const dragState = this.state.wordDragState;


    const letterOffsets = [];

    for (const word of anagramSplitted) {

      const wordPosition = this.state.wordPositions[wordIndex];
      const top = wordPosition ? wordPosition.offsetY : 0;
      const left = wordPosition ? wordPosition.offsetX : 0;

      for (const [, i] of word) {
        // reverse mapping
        const mappingIndex =  mapping.indexOf(i);
        letterOffsets[mappingIndex] = {x: left, y: top};
      }

      const onMouseDown = ((wordIndex) => {
        return (e) => this.onMouseDown(e, wordIndex)
      })(wordIndex);

      const setRef = ((wordIndex) => {
        return (ref) => this.setWordPosition(ref, wordIndex);
      })(wordIndex);

      wordComponents.push(
        <StyledWord
          innerRef={setRef}
          onMouseDown={onMouseDown}
          onMouseEnter={() => console.log('enter')}
          onMouseLeave={() => console.log('leave')}
          key={wordIndex}
          style={{
            fontSize: fontSize,
            height: fontSize,
            background: 'red',
            width: word.length * letterWidth,
            position: 'absolute',
            top,
            left,
            transform: `translate(${index * letterWidth}px, 0)`
          }}
        >
          {
            [...word].map(([w], j) => {

              const letter = (
                <WordLetter
                  key={j}
                  characterWidth={letterWidth}
                  position={j * letterWidth}
                  letter={w}
                  left={0}
                />
              );
              index += 1;
              return letter;
            })
          }
        </StyledWord>
      );
      index += 1;
      wordIndex += 1;
    }

    return (
      <Card style={{paddingBottom: 60, ...(editable ? {border: '2px dashed grey'} : {})}}>
        <WordContainer>
          <div>
            <div style={{marginBottom: MARGIN_RAW.m2}}>
              <Word
                fontSize={fontSize}
                characterWidth={letterWidth}
                word={word}
                anagram={word}
              />
            </div>
            <div>
              <AnagramSausages
                anagram={anagram}
                word={word}
                height={height}
                wordWidth={width}
                characterWidth={letterWidth}
                characterHeight={letterHeight}
                paddingTop={20}
                letterOffsets={letterOffsets}
                strokeWidth={strokeWidth}
              />
            </div>
            <div style={{position: 'relative', height: 20}}>
              {wordComponents}
            </div>
            {/* <Word
              fontSize={fontSize}
              characterWidth={letterWidth}
              word={word}
              anagram={anagram}>
              {anagram}
            </Word> */}
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
        {/* <SmallButton
          onClick={editable ? this.save : this.edit}
          active={false}
          style={{position: 'absolute', left: THEME.margins.m2, bottom: THEME.margins.m2}}
        >
          {editable ? 'Save': 'Edit'}
        </SmallButton> */}
        <Copyright>
          {'anagrams.io'}
        </Copyright>
      </Card>
    );
  }
};

export default AnagramVisualizer;
