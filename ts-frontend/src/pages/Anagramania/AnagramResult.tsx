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
} from './components';


const colorScale = d3Interpolate.interpolateLab(
  '#00DD22',
  '#FFFFFF',
);

const MAX_ITEMS_TO_SHOW_AT_ONCE = 3;

class Result extends React.Component<{
  result: anagram.IndexedWord[];
  index: number;
  color: string;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {result, index, color} = this.props;
    return (
      <ResultContainer style={{backgroundColor: color}}>
        {(index + 1) + '. ' + result.map(w => {
          return w.word.word;
        }).join(' ')}
      </ResultContainer>
    );
  }
}

interface AnagramResultProps {
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
      // wordStats,
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
      .domain([1, 4])
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
          <div style={{position: 'absolute', right: 0, top: 0}}>{counter}</div>
          {take(sortedList, !this.state.showAll ? MAX_ITEMS_TO_SHOW_AT_ONCE : list.length).map((a, i) => {
            const color = colorScale(scale(a.length));
            return <Result key={i} result={a} index={i} color={color} />
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