import * as React from 'react';
import {take} from 'lodash';
import styled from 'styled-components';

import * as anagram from 'src/anagram';

import AnagramResult from './AnagramResult';

// import mockState from 'src/assets/anagramPageMock';

const AnagramResultsContainer = styled.div`
  margin-left: -10px;
  margin-right: -10px;
`;

const AnagramResultRow = styled.div`
  float: left;
`;

class AnagramResults extends React.Component<
{
  anagramIteratorState: anagram.SerializedAnagramIteratorState;
  isDone: boolean;
  subanagrams: anagram.IndexedWord[];
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
    const {anagramIteratorState, subanagrams} = this.props;
    const {solutions, currentSubanagrams, solvedSubanagrams} = anagramIteratorState;
    // only show 500 subanagrams, browser would die else
    const MAX_NUMBER_FOR_BROWSER = 500;
    const someAreHidden = subanagrams.length > MAX_NUMBER_FOR_BROWSER && !this.state.showAll;
    const groupedAnagrams = anagram.groupAnagramsByStartWord(subanagrams, solutions);
    const reducedgroupedAnagrams = this.state.showAll ? groupedAnagrams : take(groupedAnagrams, MAX_NUMBER_FOR_BROWSER);

    const groupedAngramsContainer: anagram.GroupedAnagramSolutions[][] = [];
    let currentGroup: anagram.GroupedAnagramSolutions[] = [];
    for (let ga of reducedgroupedAnagrams) {
      currentGroup.push(ga);
      if (currentGroup.length === this.state.numberOfColumns) {
        groupedAngramsContainer.push(currentGroup);
        currentGroup = [];
      }
    }
    if (currentGroup.length !== 0) {
      groupedAngramsContainer.push(currentGroup);
    }

    return (
      <AnagramResultsContainer innerRef={this.setRef}>
        {groupedAngramsContainer.map((group, i) => {
          return (
            <AnagramResultRow key={i}>
              {group.map((d) => {
                const {word, list, counter, wordIndex} = d;
                let resultState = anagram.AnagramResultState.unsolved;
                if (currentSubanagrams.find(index => wordIndex === index)) {
                  resultState = anagram.AnagramResultState.active;
                } else if (solvedSubanagrams.find(index => index === wordIndex)) {
                  resultState = anagram.AnagramResultState.solved;
                }
                return (
                  <AnagramResult
                    key={word}
                    columnWidth={this.state.columnWidth}
                    result={resultState}
                    word={word}
                    list={list}
                    counter={counter}
                  />
                );
              })}
            </AnagramResultRow>
          );
        })}
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