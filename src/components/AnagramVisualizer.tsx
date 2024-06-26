import React from "react";
import { sortBy } from "lodash";
import styled from "styled-components";
import { FRONTEND_URL } from "src/constants";
import { getAnagramMapping } from "src/anagram";
import { Card } from "src/components/Layout";
import { THEME, MARGIN_RAW } from "src/theme";

import { SmallButton } from "./Buttons";

import AnagramSausages from "./AnagramSausages";
import { Link } from "@tanstack/react-location";

export const Copyright = styled.div`
  font-size: ${THEME.font.sizeSmall};
  position: absolute;
  top: ${THEME.margins.m2};
  left: ${THEME.margins.m2};
  opacity: 0.3;
  color: black;
  text-decoration: none;
`;

const WordContainer = styled.div`
  padding-top: ${THEME.margins.m2};
  display: flex;
  justify-content: center;
`;

const ShareSection = styled.div`
  margin-top: ${THEME.margins.m3};
  /* text-align: center; */
  /* margin-left: -${THEME.margins.m4};
  margin-right: -${THEME.margins.m4}; */
`;

const CopyInput = styled.input`
  display: none;
`;

const ShareLink = styled.a`
  word-wrap: break-word;
  font-weight: bold;
  color: black;
  padding: 2px;
  text-decoration: none;
  /* background: ${THEME.colors.primary}; */

  &:visited {
    color: black;
  }

  &:hover {
    /* border-bottom: 1px ${THEME.colors.primary} solid; */
    background: ${THEME.colors.background};
  }
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

export const MovableStyledWord = styled(StyledWord)`
  &:hover {
    cursor: move;
    background: ${THEME.colors.background};
  }
`;

class WordLetter extends React.Component<{
  characterWidth: number;
  position: number;
  left: number;
  letter: string;
}> {
  render() {
    const { characterWidth, position, left, letter } = this.props;
    return (
      <span
        style={{
          transition: "all 500ms ease-in-out",
          display: "block",
          width: characterWidth,
          position: "absolute",
          top: 0,
          transform: `translate(${position}px, 0)`,
          left: left,
        }}
      >
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
      <StyledWord
        style={{ fontSize: this.props.fontSize, height: this.props.fontSize }}
      >
        {word.split("").map((_, i) => {
          const index = mapping[i]!;
          const position = index * this.props.characterWidth;
          const c2 = anagram[index];
          return (
            <WordLetter
              key={i}
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

export function createShareLink(word: string, anagram: string) {
  return `${FRONTEND_URL}/share?anagram=${encodeURIComponent(
    anagram
  )}&word=${encodeURIComponent(word)}`;
}

export function calculateWidths(
  word: string,
  anagram: string,
  fontSize: number
) {
  const WIDTH_PER_PIXEL = 0.5992857143;
  const HEIGHT_PER_PIXEL = 1.13;

  const letterWidth = WIDTH_PER_PIXEL * fontSize; // at 14px
  const letterHeight = HEIGHT_PER_PIXEL * fontSize;

  const strokeWidth = letterWidth / 2;

  const maxLength = Math.max(word.length, anagram.length);
  const width = maxLength * letterWidth;

  const height = (maxLength * letterHeight) / 2;

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
  viewState?: string;
  save?: (word: string, anagram: string) => any;
  close?: () => any;
  asBlock?: boolean;
}

function splitWord(word: string) {
  const wordIndexed: Array<[string, number]> = [...word].map((w, i) => {
    return [w, i];
  }) as any;

  const wordSplitted: Array<Array<[string, number]>> = [];
  let currentIndexedWord: Array<[string, number]> = [];

  for (const [w, i] of wordIndexed) {
    if (w === " " && currentIndexedWord.length > 0) {
      wordSplitted.push(currentIndexedWord);
      currentIndexedWord = [];
      continue;
    }
    currentIndexedWord.push([w, i]);
  }
  if (currentIndexedWord.length > 0) {
    wordSplitted.push(currentIndexedWord);
  }
  return wordSplitted;
}

class AnagramVisualizer extends React.Component<
  AnagramVisualizerProps,
  {
    word: string;
    anagram: string;
    viewState: string;
    anagramSplitted: [string, number][][];
    containerPosition: {
      x: number;
      y: number;
    };
    wordDragState: {
      activeIndex: number;
      mouseDown: boolean;
      isDragging: boolean;
      initialX: number;
      initialY: number;
    };
    wordPositions: {
      x: number;
      y: number;
    }[];
    wordOffsets: {
      x: number;
      y: number;
    }[];
  }
> {
  componentIsMounted: boolean = false;
  container: HTMLElement | null;
  constructor(props: AnagramVisualizerProps) {
    super(props);
    this.container = null;

    this.resetState();

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.setContainerRef = this.setContainerRef.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.setNormalMode = this.setNormalMode.bind(this);
  }

  resetState() {
    const word = this.props.word;
    const anagram = this.props.anagram;
    const state = this.setAnagram(anagram, word);

    this.state = {
      word,
      anagram,
      ...state,
      wordDragState: {
        mouseDown: false,
        isDragging: false,
        activeIndex: -1,
        initialX: 0,
        initialY: 0,
      },
      containerPosition: {
        x: 0,
        y: 0,
      },
      viewState: this.props.viewState || "normal",
    };
  }

  componentDidMount() {
    this.componentIsMounted = true;
    if (typeof document !== "undefined") {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("touchend", this.onTouchEnd);
      document.addEventListener("touchmove", this.onTouchMove);
    }
  }
  componentWillUnmount() {
    this.componentIsMounted = false;
    if (typeof document !== "undefined") {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseMove);
      document.removeEventListener("touchmove", this.onTouchMove);
      document.removeEventListener("touchend", this.onTouchEnd);
    }
  }
  setContainerRef(container: HTMLInputElement) {
    this.container = container;
    if (!container) {
      return;
    }
    const position = this.container.getBoundingClientRect();
    this.setState({
      containerPosition: {
        x: position.left,
        y: position.top,
      },
    });
  }
  copyToClipboard() {
    const input: HTMLInputElement = document.getElementById(
      "link-input"
    ) as HTMLInputElement;
    input.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Copy did not work");
    }
  }
  getWordPosition(index: number) {
    return (
      this.state.wordPositions[index] || {
        offsetX: 0,
        offsetY: 0,
      }
    );
  }
  onTouchStart(e: React.TouchEvent<HTMLElement>, wordIndex: number) {
    const touches = e.touches;
    const touch = touches[0];
    if (!touch) {
      return;
    }
    this.onDown(touch.pageX, touch.pageY, wordIndex);
  }
  onMouseDown(e: React.MouseEvent<HTMLElement>, wordIndex: number) {
    const pageX = e.pageX;
    const pageY = e.pageY;
    this.onDown(pageX, pageY, wordIndex);
  }
  onDown(pageX: number, pageY: number, wordIndex: number) {
    if (!this.componentIsMounted) {
      return;
    }
    const wordOffset = this.state.wordOffsets[wordIndex];

    this.setState({
      wordDragState: {
        ...this.state.wordDragState,
        activeIndex: wordIndex,
        mouseDown: true,
        initialX: pageX - wordOffset.x,
        initialY: pageY - wordOffset.y,
      },
    });
  }
  onTouchEnd() {
    this.onMouseUp();
  }
  onMouseUp() {
    if (!this.componentIsMounted) {
      return;
    }
    this.state.wordDragState.activeIndex = -1;
    this.setState({
      wordDragState: {
        ...this.state.wordDragState,
        mouseDown: false,
        isDragging: false,
        activeIndex: -1,
      },
    });
    const newAnagram = this.rearrangeAnagram();
    this.setState({
      anagram: newAnagram,
    });
  }
  setAnagram(anagram: string, word: string) {
    const anagramSplitted = splitWord(anagram);

    const fontSize = this.fontSize;

    const { letterWidth } = calculateWidths(word, anagram, fontSize);

    const wordPositions = [];

    let x = 0;
    for (const word of anagramSplitted) {
      wordPositions.push({ x, y: 0 });
      // 1 is for the space
      x += (word.length + 1) * letterWidth;
    }

    const wordOffsets = anagramSplitted.map(() => {
      return {
        x: 0,
        y: 0,
      };
    });
    return {
      wordOffsets,
      anagramSplitted,
      wordPositions,
    };
  }

  onMouseMove(e: MouseEvent) {
    this.onMove(e.pageX, e.pageY);
  }

  onTouchMove(e: TouchEvent) {
    const touches = e.touches;
    const touch = touches[0];
    this.onMove(touch.pageX, touch.pageY);
  }

  onMove(pageX: number, pageY: number) {
    if (!this.componentIsMounted) {
      return;
    }
    const dragState = this.state.wordDragState;
    if (dragState.mouseDown) {
      if (!dragState.isDragging) {
        dragState.isDragging = true;
      }

      const wordPosition = this.state.wordOffsets[dragState.activeIndex];

      const offsetX = pageX - dragState.initialX;
      const offsetY = pageY - dragState.initialY;

      (wordPosition.x = offsetX),
        (wordPosition.y = offsetY),
        this.setState({
          wordDragState: {
            ...dragState,
            isDragging: true,
          },
          wordOffsets: this.state.wordOffsets,
        });
      this.rearrangeAnagram();
    }
  }

  rearrangeAnagram(): string {
    const wordsWithOffset = this.state.wordPositions.map((p, i) => {
      const offset = this.state.wordOffsets[i];
      return {
        x: p.x + offset.x,
        y: p.y + offset.y,
        index: i,
      };
    });

    const sortedWords = sortBy(wordsWithOffset, (w) => w.x);

    const newAnagram = sortedWords
      .map(({ index }) => {
        const word = this.state.anagramSplitted[index];
        return word.map((l) => l[0]).join("");
      })
      .join(" ");

    let x = 0;
    const { letterWidth } = calculateWidths(
      this.props.word,
      this.props.anagram,
      this.fontSize
    );

    const newPositions = [];
    for (const word of sortedWords) {
      const newPosition = {
        x,
        y: 0,
        index: word.index,
      };
      const anagram = this.state.anagramSplitted[word.index];
      x += (anagram.length + 1) * letterWidth;
      newPositions.push(newPosition);
    }

    // overwrite positions
    newPositions.map((p) => {
      if (p.index !== this.state.wordDragState.activeIndex) {
        const oldPosition = this.state.wordPositions[p.index];
        const oldOffset = this.state.wordOffsets[p.index];
        oldOffset.x = p.x - oldPosition.x;
        oldOffset.y = p.y - oldPosition.y;
      }
    });
    this.setState({
      wordOffsets: this.state.wordOffsets,
    });

    return newAnagram;
  }

  setEditMode() {
    this.setState({
      viewState: "edit",
    });
  }

  setNormalMode() {
    this.setState({
      viewState: "normal",
    });
  }

  get fontSize() {
    return Math.min(
      22,
      typeof window !== "undefined" ? window.innerWidth / 20 : 14
    );
  }

  render() {
    const isWindowUndefined = typeof window === "undefined";
    if (isWindowUndefined) {
      return null;
    }

    let { word, anagram } = this.props;
    let { word: currentWord, anagram: currentAnagram } = this.state;

    const fontSize = this.fontSize;

    const { width, height, strokeWidth, letterHeight, letterWidth } =
      calculateWidths(word, anagram, fontSize);

    const mapping = getAnagramMapping(word, anagram);

    const LINK = createShareLink(word, anagram);

    const wordComponents = [];
    let wordIndex = 0;

    const anagramSplitted = splitWord(anagram);
    const letterOffsets = [];

    for (const word of anagramSplitted) {
      const wordPosition = this.state.wordPositions[wordIndex];
      const wordOffset = this.state.wordOffsets[wordIndex];
      // const top = wordPosition ? wordPosition.offsetY : 0;
      const top = 0;
      const left = wordPosition ? wordPosition.x : 0;
      const leftOffset = wordOffset ? wordOffset.x : 0;

      for (const [, i] of word) {
        // reverse mapping
        const mappingIndex = mapping.indexOf(i);
        letterOffsets[mappingIndex] = { x: leftOffset, y: top };
      }

      const onMouseDown = ((wordIndex) => {
        return (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
          this.onMouseDown(e, wordIndex);
      })(wordIndex);

      const onTouchStart = ((wordIndex) => {
        return (e: React.TouchEvent<HTMLElement>) =>
          this.onTouchStart(e, wordIndex);
      })(wordIndex);

      wordComponents.push(
        <MovableStyledWord
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          key={wordIndex}
          style={{
            display: "block",
            fontSize: fontSize,
            height: fontSize,
            width: word.length * letterWidth,
            paddingBottom: 30,
            paddingLeft: letterWidth / 2,
            paddingRight: letterWidth / 2,
            position: "absolute",
            top,
            left,
            transform: `translate(${leftOffset}px, 0)`,
          }}
        >
          {[...word].map(([w], j) => {
            const letter = (
              <WordLetter
                key={j}
                characterWidth={letterWidth}
                position={j * letterWidth}
                letter={w}
                left={0}
              />
            );
            return letter;
          })}
        </MovableStyledWord>
      );
      wordIndex += 1;
    }

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          style={{
            display: this.props.asBlock ? "block" : "inline-block",
            maxWidth: "100%",
            width: this.props.asBlock ? "100%" : "auto",
          }}
        >
          <WordContainer>
            <div>
              <div style={{ marginBottom: MARGIN_RAW.m2 }}>
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
                  height={height + 40}
                  wordWidth={width}
                  characterWidth={letterWidth}
                  characterHeight={letterHeight}
                  paddingTop={20}
                  letterOffsets={letterOffsets}
                  strokeWidth={strokeWidth}
                />
              </div>
              <div
                style={{ position: "relative", height: letterHeight * 1.3 }}
                ref={this.setContainerRef}
              >
                {wordComponents}
              </div>
            </div>
          </WordContainer>
          <ShareSection>
            <div
              style={{ marginTop: MARGIN_RAW.m3, marginBottom: MARGIN_RAW.m1 }}
            >
              {`Share it using this Link: `}
            </div>
            <ShareLink target="_blank" href={LINK}>
              {LINK}
            </ShareLink>
            <br />
            <CopyInput readOnly id="link-input" type="text" value={LINK} />
          </ShareSection>
          <div style={{ marginTop: MARGIN_RAW.m3 }}>
            {/* {this.state.viewState === 'edit' ? (
              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <NormalButton active={true} onClick={this.setNormalMode}>{'Save'}</NormalButton>
                <span style={{paddingLeft: MARGIN_RAW.m2}}>{'Save when you are done rearranging words'}</span>
              </div>
            ) : null}
            {this.state.viewState === 'normal' ? (
              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <NormalButton active={true} onClick={this.setEditMode}>{'Edit'}</NormalButton>
                <span style={{paddingLeft: MARGIN_RAW.m2}}>{'When editing you can rearrange the words'}</span>
              </div>
            ) : null} */}
            <span>
              {"You can "}
              <strong>{"rearrange"}</strong>
              {" the words by dragging the words."}
            </span>
          </div>
          {this.props.close ? (
            <SmallButton
              onClick={this.props.close}
              active={false}
              style={{
                position: "absolute",
                right: THEME.margins.m2,
                top: THEME.margins.m2,
              }}
            >
              {"Close"}
            </SmallButton>
          ) : null}
          <Link to="/">
            <Copyright>{"anagrams.io"}</Copyright>
          </Link>
        </Card>
      </div>
    );
  }
}

export default AnagramVisualizer;
