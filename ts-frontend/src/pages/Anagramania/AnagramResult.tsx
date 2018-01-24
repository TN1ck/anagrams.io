import * as React from 'react';
import {take} from 'lodash';
import * as d3Scale from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
// import * as d3ScaleChromatic from 'd3-scale-chromatic';

import * as anagram from 'src/anagram';


import {
  ResultContainer,
  AnagramResultGroup,
  ShowAllButton,
  ShareLink,
} from './components';


const colorScale = d3Interpolate.interpolateLab(
  '#FFFFFF',
  '#FFFFFF',
);

const MAX_ITEMS_TO_SHOW_AT_ONCE = 3;

class Result extends React.Component<{
  result: anagram.IndexedWord[];
  index: number;
  color: string;
  query: string;
  share?: (anagram: string, word: string) => any;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {result, index, color, query} = this.props;
    const word = result.map(w => w.word.word).join(' ');
    return (
      <ResultContainer style={{backgroundColor: color}}>
        {(index + 1) + '. ' + word}
        <ShareLink onClick={() => this.props.share(word, query)}>
          {'share'}
        </ShareLink>
      </ResultContainer>
    );
  }
}

interface AnagramResultProps {
  share?: (anagram: string, word: string) => any;
  query: string;
  result: anagram.AnagramResultState;
  word: string;
  list: anagram.IndexedWord[][];
  counter: number;
  columnWidth: number;
  maxLengthInGroup: number;
  wordStats: {
    average: number;
    min: number;
    max: number;
  }
};

class AnagramResult extends React.Component<AnagramResultProps,
{
  showAll: boolean;
}
> {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }
  toggleShowAll() {
    this.setState({
      showAll: !this.state.showAll,
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
      wordStats,
      query,
    } = this.props;

    const minHeight = 17;
    const rowHeight = 21;
    const showAllSize = 30;
    const paddingSize = 20;

    const maxHeight = MAX_ITEMS_TO_SHOW_AT_ONCE * rowHeight + minHeight + paddingSize + showAllSize;

    const useMaxsize = maxLengthInGroup > MAX_ITEMS_TO_SHOW_AT_ONCE;

    let height: any = useMaxsize ? maxHeight : (minHeight + maxLengthInGroup * rowHeight + paddingSize);
    height = this.state.showAll ? 'auto' : height;

    const sortedList = list.sort((a, b) => {
      if (a.length < b.length) {
        return -1;
      } else if (a.length === b.length) {
        return 0;
      } else {
        return 1;
      }
    });

    // wordLength => 0, 1
    const scale = d3Scale.scaleLinear()
      .domain([wordStats.min, wordStats.min + 2])
      .range([0, 1]);

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
          <strong>
            {word}
          </strong>
          {/* <div style={{position: 'absolute', right: 0, top: 0}}>{counter}</div> */}
          {take(sortedList, !this.state.showAll ? MAX_ITEMS_TO_SHOW_AT_ONCE : list.length).map((a, i) => {
            const color = colorScale(scale(a.length));
            return <Result key={i} result={a} index={i} color={color} query={query} share={this.props.share} />
          })}
          {
            list.length > MAX_ITEMS_TO_SHOW_AT_ONCE
              ? 
                <ShowAllButton onClick={this.toggleShowAll}>
                  {this.state.showAll
                    ? `... hide ${list.length - MAX_ITEMS_TO_SHOW_AT_ONCE} items`
                    : `... show ${list.length - MAX_ITEMS_TO_SHOW_AT_ONCE} more`
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