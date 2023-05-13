import React from 'react';
import {take} from 'lodash';

import * as anagram from 'src/anagram';
import {THEME} from 'src/theme';
import {
  ShowAllButton,
  MutedButton,
  ResultContainer,
  AnagramResultGroup,
  SmallButton,
} from 'src/components';


import {calculateWidths, Copyright} from 'src/components/AnagramVisualizer';
import AnagramSausages from 'src/components/AnagramSausages';

const MAX_ITEMS_TO_SHOW_AT_ONCE = 3;

export class ResultVisualisation extends React.Component<{
  word: string,
  query: string,
  index: number,
  noMargin?: boolean,
}> {
  render() {
    const {
      word,
      query,
      index,
      noMargin,
    } = this.props;

    const {
      height,
      width,
      letterHeight,
      letterWidth,
      strokeWidth,
    } = calculateWidths(word, query, 14);

    const paddingTop = 10;
    const paddingBottom = 10;

    const marginLeft = noMargin ? 0 : (('' + (index + 1)).length + 2) * letterWidth;

    return (
      <div style={{marginLeft: marginLeft, marginTop: 2, marginBottom: -3}}>
        <AnagramSausages
          word={word}
          anagram={query}
          height={height + paddingBottom * 2}
          wordWidth={width}
          characterWidth={letterWidth}
          characterHeight={letterHeight}
          paddingTop={paddingTop}
          strokeWidth={strokeWidth}
        />
      </div>
    );
  }
}

const AnagramResultGroupBestOf = AnagramResultGroup.extend`
  position: relative;
  text-decoration: none;
  cursor: default;
`;

const CopyrightBestOf = Copyright.withComponent('a').extend`
  top: auto;
  bottom: ${THEME.margins.m2};
`;

interface ResultBestOfProps {
  word: string;
  anagram: string;
  foundBy?: string;
  link?: string;
  share?: (anagram: string, word: string) => any;
}

export class ResultBestOf extends React.Component<ResultBestOfProps> {
  constructor(props: ResultBestOfProps) {
    super(props);
  }
  render() {
    const {word, anagram: wordAnagram, foundBy, link} = this.props;

    const {
      height,
      width,
      letterHeight,
      letterWidth,
      strokeWidth,
    } = calculateWidths(wordAnagram, word, 14);

    const paddingTop = 10;
    const paddingBottom = 10;

    return (
      <AnagramResultGroupBestOf
        // @ts-ignore
        // href={createShareLink(word, wordAnagram)}
        target="_blank"
        state={anagram.AnagramResultState.solved}
        noResults={false}
        style={{
          display: 'flex',
          justifyContent: 'center',
          minWidth: 260,
          width: 'auto',
          paddingBottom: foundBy ? 40 : 20,
        }}
      >
        <ResultContainer
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'default',
          }}
        >

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{
                fontWeight: 'bold',
              }}>
                {word}
              </div>
              <AnagramSausages
                word={word}
                anagram={wordAnagram}
                height={height + paddingBottom * 2}
                wordWidth={width}
                characterWidth={letterWidth}
                characterHeight={letterHeight}
                paddingTop={paddingTop}
                strokeWidth={strokeWidth}
              />
              <div style={{
                fontWeight: 'bold',
              }}>{wordAnagram}</div>
            </div>
          </div>

          {/* <div style={{textAlign: 'center'}}>
            <SmallButton
              onClick={(e) => {
                this.props.share(wordAnagram, word);
                e.preventDefault();
                e.stopPropagation();
              }}
              active={false}>{'CHANGE & SHARE'}</SmallButton>
          </div> */}

        </ResultContainer>
        {foundBy && <CopyrightBestOf
          // @ts-ignore
          href={link}
          target="_blank"
        >{`By: ${foundBy}`}</CopyrightBestOf>}
      </AnagramResultGroupBestOf>
    );
  }
}

interface ResultProps {
  result: anagram.SimpleWord[];
  index: number;
  query: string;
  share?: (anagram: string, word: string) => any;
  expandSelection: (index: number, expanded: boolean) => void;
  expanded: boolean;
}

interface ResultState {
  expanded: boolean;
}

export class Result extends React.Component<ResultProps, ResultState> {
  constructor(props: ResultProps) {
    super(props);
    this.state = {
      expanded: props.expanded,
    };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }
  toggleExpanded() {
    const expanded = !this.state.expanded
    this.setState({
      expanded,
    });
    this.props.expandSelection(this.props.index, expanded);
  }
  shouldComponentUpdate(props: ResultProps, state: ResultState) {
    return this.state !== state;
  }
  render() {
    const {result, index, query} = this.props;
    const expanded = this.state.expanded;
    // TODO
    const word = result.map(w => w.word).join(' ');
    return (
      <ResultContainer onClick={this.toggleExpanded}>
        <span style={{
          fontWeight: expanded ? 'bold' : 'normal',
        }}>{(index + 1) + '. ' + word}</span>
        <MutedButton hovered={expanded}>
          {expanded ? '-' : '+'}
        </MutedButton>
        {expanded && (
          <div>
            <ResultVisualisation
              word={word}
              query={query}
              index={index}
            />
            <span style={{opacity: 0}}>{(index + 1) + '. '}</span>
            <span style={{
              fontWeight: expanded ? 'bold' : 'normal',
            }}>{query}</span>
            <div style={{textAlign: 'right'}}>
              <span style={{opacity: 0}}>{(index + 1) + '. '}</span>
              <SmallButton
                onClick={(e) => {
                  this.props.share!(word, query);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                active={false}>{'CHANGE & SHARE'}</SmallButton>
            </div>
          </div>
        )}
      </ResultContainer>
    );
  }
}

interface AnagramResultProps {
  share?: (anagram: string, word: string) => any;
  query: string;
  result: anagram.AnagramResultState;
  word: string;
  list: anagram.SimpleWord[][];
  counter: number;
  columnWidth: number;
  maxLengthInGroup: number;
  expandFirst: boolean;
};

interface AnagramResultState {
  showAll: boolean;
  expandedSelections: {[key: number]: boolean} | null;
}

class AnagramResult extends React.Component<AnagramResultProps, AnagramResultState> {
  constructor(props: AnagramResultProps) {
    super(props);
    this.state = {
      showAll: false,
      expandedSelections: props.expandFirst ? {[0]: true} : null,
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
    this.expandSelection = this.expandSelection.bind(this);
  }
  toggleShowAll() {
    this.setState({
      showAll: !this.state.showAll,
    });
  }
  expandSelection(index: number, expanded: boolean) {
    const expandedSelections = this.state.expandedSelections || {};
    expandedSelections[index] = expanded;
    this.setState({
      expandedSelections,
    });
  }
  shouldComponentUpdate(newProps: AnagramResultProps, newState: AnagramResultState) {
    if (this.props.counter !== newProps.counter ||
        this.props.columnWidth !== newProps.columnWidth ||
        this.state !== newState ||
        this.props.result !== newProps.result ||
        this.props.maxLengthInGroup !== newProps.maxLengthInGroup
    ) {
        return true;
    }
    return false;
  }
  render() {
    const {
      word,
      list,
      counter,
      columnWidth,
      result,
      maxLengthInGroup,
      query,
    } = this.props;

    const minHeight = 22;
    const rowHeight = 23;
    const showAllSize = 27;
    const paddingSize = 20;

    const maxHeight = MAX_ITEMS_TO_SHOW_AT_ONCE * rowHeight + minHeight + paddingSize + showAllSize;

    const useMaxsize = maxLengthInGroup > MAX_ITEMS_TO_SHOW_AT_ONCE;

    let height: any = useMaxsize ? maxHeight : (minHeight + maxLengthInGroup * rowHeight + paddingSize);
    let useAutoHeight = this.state.showAll;
    if (this.state.expandedSelections) {
      useAutoHeight = useAutoHeight || Object.values(this.state.expandedSelections).some(n => n);
    }
    height = useAutoHeight ? 'auto' : height;

    const sortedList = list.sort((a, b) => {
      if (a.length < b.length) {
        return -1;
      } else if (a.length === b.length) {
        return 0;
      } else {
        return 1;
      }
    });

    return (
      <AnagramResultGroup
        state={result}
        noResults={counter === 0}
        style={{
          width: columnWidth - 20,
          height,
        }}
      >
        <div style={{position: 'relative'}}>
          <strong style={{letterSpacing: '0.6px'}}>
            {word}
          </strong>
          {/* <div style={{position: 'absolute', right: 0, top: 0}}>{counter}</div> */}
          {take(sortedList, !this.state.showAll ? MAX_ITEMS_TO_SHOW_AT_ONCE : list.length).map((a, i) => {
            return (
              <Result
                expanded={!!(this.state.expandedSelections && this.state.expandedSelections[i])}
                key={i}
                result={a}
                index={i}
                query={query}
                share={this.props.share}
                expandSelection={this.expandSelection}
              />
            )
          })}
          {
            list.length > MAX_ITEMS_TO_SHOW_AT_ONCE
              ?
                <ShowAllButton onClick={this.toggleShowAll}>
                  {this.state.showAll
                    ? `hide ${list.length - MAX_ITEMS_TO_SHOW_AT_ONCE} items`
                    : `show ${list.length - MAX_ITEMS_TO_SHOW_AT_ONCE} more`
                  }
                </ShowAllButton>

              : null
          }
        </div>
      </AnagramResultGroup>
    );
  }
}

export default AnagramResult;
