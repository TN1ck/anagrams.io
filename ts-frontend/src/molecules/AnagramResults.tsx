import * as React from 'react';
import {take} from 'lodash';

import {
  SubTitle,
  AnagramResultsContainer,
  AnagramResultRow,
} from 'src/components';

import * as anagram from 'src/anagram';
import {partitionArray} from 'src/utility';

import AnagramResult from './AnagramResult';
import { AnagramResultState } from 'src/anagram';

class AnagramResults extends React.Component<
{
  anagramIteratorState: anagram.SerializedAnagramIteratorState;
  isDone: boolean;
  subanagrams: anagram.IndexedWord[];
  wordStats: {
    average: number;
    min: number;
    max: number;
  },
  query: string;
  share: (anagram: string, word: string) => any;
},
{
  columnWidth: number;
  numberOfColumns: number;
  showAll: boolean;
}
> {
  dom: HTMLElement;
  constructor(props) {
    super(props);
    this.state = {
      columnWidth: 250,
      numberOfColumns: 1,
      showAll: false,
    };
    this.setRef = this.setRef.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setColumnWidth();
    });
    this.setColumnWidth();
  }
  // we use javascript for this, becaus flexbox might be to slow
  calculateColumnWidth() {
    const width = this.dom.clientWidth;
    const MIN_COLUMN_WIDTH = 250;

    
    const numberOfColumns = Math.floor(width / MIN_COLUMN_WIDTH);
    const columnWidth = width / numberOfColumns;
    return {
      columnWidth,
      numberOfColumns,
    };
  }
  setColumnWidth() {
    this.setState(this.calculateColumnWidth());
  }
  setRef(dom) {
    this.dom = dom;
  }
  render() {
    const {anagramIteratorState, subanagrams, query} = this.props;
    const {solutions, currentSubanagrams, solvedSubanagrams, unsolvedSubanagrams} = anagramIteratorState;
    const isDone = unsolvedSubanagrams.length === 0;
    // only show 500 subanagrams, browser would die else
    const MAX_NUMBER_FOR_BROWSER = 500;
    const someAreHidden = subanagrams.length > MAX_NUMBER_FOR_BROWSER && !this.state.showAll && !isDone;
    const groupedAnagrams = anagram.groupAnagramsByStartWord(subanagrams, solutions);

    let reducedgroupedAnagrams = (this.state.showAll || isDone) ? groupedAnagrams : take(groupedAnagrams, MAX_NUMBER_FOR_BROWSER);
    let groupedAnagramsWithoutSolutions;
    let groupedAnagramsThatAppearAbove;

    if (isDone) {
      const anagramsWithoutSolutions = reducedgroupedAnagrams.filter(a => {
        return a.counter === 0;
      });
      const anagramsThatappearAbove = reducedgroupedAnagrams.filter(a => {
        return a.counter > 0 && a.list.length === 0;
      });
      groupedAnagramsWithoutSolutions = partitionArray(anagramsWithoutSolutions, this.state.numberOfColumns);
      groupedAnagramsThatAppearAbove = partitionArray(anagramsThatappearAbove, this.state.numberOfColumns);
      reducedgroupedAnagrams = reducedgroupedAnagrams.filter(a => {
        return a.list.length > 0;
      });
    }

    const groupedAngramsContainer = partitionArray(reducedgroupedAnagrams, this.state.numberOfColumns);

    return (
      <AnagramResultsContainer innerRef={this.setRef}>
        {groupedAngramsContainer.map((group, i) => {
          const maxLengthInGroup = Math.max(...group.map(g => g.list.length));
          return (
            <AnagramResultRow key={i}>
              {group.map((d) => {
                const {word, list, counter, wordIndex} = d;
                let resultState = anagram.AnagramResultState.unsolved;
                if (currentSubanagrams.find(index => wordIndex === index) !== undefined) {
                  resultState = anagram.AnagramResultState.active;
                } else if (solvedSubanagrams.find(index => index === wordIndex) !== undefined) {
                  resultState = anagram.AnagramResultState.solved;
                }
                return (
                  <AnagramResult
                    key={word}
                    share={this.props.share}
                    columnWidth={this.state.columnWidth}
                    result={resultState}
                    word={word}
                    list={list}
                    counter={counter}
                    maxLengthInGroup={maxLengthInGroup}
                    wordStats={this.props.wordStats}
                    query={query}
                  />
                );
              })}
            </AnagramResultRow>
          );
        })}
        {
          isDone ? (
            <div>
                {groupedAnagramsThatAppearAbove.length > 0 ? (
                  <div>
                    <div style={{float: 'left', width: '100%', marginLeft: '10px'}}>
                      <SubTitle>{'Subanagrams that are included in the results above:'}</SubTitle>
                    </div>
                    {groupedAnagramsThatAppearAbove.map((group, i) => {
                      return (
                        <AnagramResultRow key={i}>
                          {group.map((d) => {
                            const {word, list, counter} = d;
                            return (
                              <AnagramResult
                                key={word}
                                share={this.props.share}
                                columnWidth={this.state.columnWidth}
                                result={AnagramResultState.solved}
                                word={word}
                                list={list}
                                counter={counter}
                                maxLengthInGroup={0}
                                wordStats={this.props.wordStats}
                                query={query}
                              />
                            );
                          })}
                        </AnagramResultRow>
                      );
                    })}
                  </div>
                ) : null}
              <div style={{float: 'left', width: '100%', marginLeft: '10px'}}>
                <SubTitle>{'Subanagrams that had no solution:'}</SubTitle>
              </div>
              {groupedAnagramsWithoutSolutions.map((group, i) => {
                return (
                  <AnagramResultRow key={i}>
                    {group.map((d) => {
                      const {word, list, counter} = d;
                      return (
                        <AnagramResult
                          key={word}
                          columnWidth={this.state.columnWidth}
                          result={AnagramResultState.unsolved}
                          word={word}
                          list={list}
                          counter={counter}
                          maxLengthInGroup={0}
                          wordStats={this.props.wordStats}
                          query={query}
                        />
                      );
                    })}
                  </AnagramResultRow>
                );
              })}
            </div>
          ) : null
        }
        {
          someAreHidden
            ? (
              <div onClick={() => this.setState({showAll: !this.state.showAll})}>
                <strong style={{color: 'white', padding: 10, float: 'left'}}>
                  {`I hid ${subanagrams.length - MAX_NUMBER_FOR_BROWSER} additional groups. Click to show them all, it could cause slowdowns.`}
                </strong>
              </div>
            )
            : null
        }
      </AnagramResultsContainer>
    );
  }
};

export default AnagramResults;