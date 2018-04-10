import * as React from 'react';
import {take} from 'lodash';

import * as anagram from 'src/anagram';
import {
  ShowAllButton,
  MutedButton,
  ResultContainer,
  AnagramResultGroup,
  SmallButton,
} from 'src/components';

import {Word, AnagramSausages, calculateWidths} from 'src/components/AnagramVisualizer';

const MAX_ITEMS_TO_SHOW_AT_ONCE = 3;

class ResultVisualisation extends React.Component<{
  word: string,
  query: string,
  index: number,
}> {
  render() {
    const {
      word,
      query,
      index,
    } = this.props;

    const WIDTH_PER_PIXEL = 0.5992857143;
    const HEIGHT_PER_PIXEL = 1.2857142857;
    const LETTER_WIDTH = WIDTH_PER_PIXEL * 14; // at 14px
    const LETTER_HEIGHT = HEIGHT_PER_PIXEL * 14;

    const strokeWidth = LETTER_WIDTH / 2;

    const maxLength = Math.max(word.length, query.length);
    const maxWidth = maxLength * LETTER_WIDTH;

    const height = 10 + maxLength * LETTER_WIDTH * 1.8 + 10;

    const marginLeft = (('' + (index + 1)).length + 2) * LETTER_WIDTH;

    return (
      <div style={{marginLeft: marginLeft}}>
        <AnagramSausages
          word={word}
          anagram={query}
          height={height}
          wordWidth={maxWidth}
          characterWidth={LETTER_WIDTH}
          characterHeight={14}
          paddingTop={10}
          strokeWidth={strokeWidth}
        />
      </div>
    );
  }
}

class Result extends React.Component<{
  result: anagram.SimpleWord[];
  index: number;
  query: string;
  share?: (anagram: string, word: string) => any;
  expandSelection: (index: number, expanded: boolean) => void;
}, {
  expanded: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
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
  shouldComponentUpdate(_, state) {
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
            <div>
              <span style={{opacity: 0}}>{(index + 1) + '. '}</span>
              <SmallButton
                onClick={(e) => {
                  this.props.share(word, query);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                active={true}>{'CHANGE & SHARE'}</SmallButton>
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
};

class AnagramResult extends React.Component<AnagramResultProps,
{
  showAll: boolean;
  expandedSelections: {[key: number]: boolean};
}
> {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      expandedSelections: null,
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
  shouldComponentUpdate(newProps: AnagramResultProps, newState) {
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
