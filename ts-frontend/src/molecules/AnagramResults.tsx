import * as React from 'react';
import styled from 'styled-components';
import {observer, inject} from 'mobx-react';
import {THEME} from 'src/theme';

import {
  SubTitle,
  AnagramResultsContainer,
  AnagramResultRow,
} from 'src/components';

import {AnagramState} from '../state';

import * as anagram from 'src/anagram';

import AnagramResult from './AnagramResult';
import { AnagramResultState } from 'src/anagram';

const SubTitleContainer = styled.div`
  float: left;
  width: 100%;
  margin-left: ${THEME.margins.m2};
`;

@inject('store')
@observer
class AnagramResults extends React.Component<{
  store?: AnagramState;
}> {
  dom: HTMLElement;
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setWidth();
    });
    this.setWidth();
  }
  setWidth() {
    const width = this.dom.clientWidth;
    this.props.store.setWidth(width);
  }
  setRef(dom) {
    this.dom = dom;
  }
  render() {
    const store = this.props.store;

    const query = store.query;
    const groupedAnagrams = store.groupedAnagrams;
    const partitionedAnagramsWithSolution = store.partitionedAnagramsWithSolution;
    const partitionedAnagramsWithNoOwnSolution = store.partitionedAnagramsWithNoOwnSolution;
    const partitionedAnagramsWithoutSolution = store.partitionedAnagramsWithoutSolution;

    return (
      <AnagramResultsContainer innerRef={this.setRef}>
        {
          groupedAnagrams.length === 0 ? (
            <AnagramResult
              share={store.openModal}
              columnWidth={store.columnWidth}
              result={anagram.AnagramResultState.unsolved}
              word={'No word found yet...'}
              list={[]}
              counter={0}
              maxLengthInGroup={0}
              query={query}
            />
          ) : null
        }
        {partitionedAnagramsWithSolution.map((group, i) => {
          const maxLengthInGroup = Math.max(...group.map(g => g.list.length));
          return (
            <AnagramResultRow key={i}>
              {group.map((d) => {
                const {word, list, counter} = d;
                return (
                  <AnagramResult
                    key={word}
                    share={store.openModal}
                    columnWidth={store.columnWidth}
                    result={anagram.AnagramResultState.solved}
                    word={word}
                    list={list}
                    counter={counter}
                    maxLengthInGroup={maxLengthInGroup}
                    query={query}
                  />
                );
              })}
            </AnagramResultRow>
          );
        })}
        {
          store.isDone ? (
            <div>
                {partitionedAnagramsWithNoOwnSolution.length > 0 ? (
                  <div>
                    <SubTitleContainer>
                      <SubTitle>{'Subanagrams that are included in the results above:'}</SubTitle>
                    </SubTitleContainer>
                    {partitionedAnagramsWithNoOwnSolution.map((group, i) => {
                      return (
                        <AnagramResultRow key={i}>
                          {group.map((d) => {
                            const {word, list, counter} = d;
                            return (
                              <AnagramResult
                                key={word}
                                share={store.openModal}
                                columnWidth={store.columnWidth}
                                result={AnagramResultState.solved}
                                word={word}
                                list={list}
                                counter={counter}
                                maxLengthInGroup={0}
                                query={query}
                              />
                            );
                          })}
                        </AnagramResultRow>
                      );
                    })}
                  </div>
                ) : null}
              <SubTitleContainer>
                <SubTitle>{'Subanagrams that had no solution:'}</SubTitle>
              </SubTitleContainer>
              {partitionedAnagramsWithoutSolution.map((group, i) => {
                return (
                  <AnagramResultRow key={i}>
                    {group.map((d) => {
                      const {word, list, counter} = d;
                      return (
                        <AnagramResult
                          key={word}
                          columnWidth={store.columnWidth}
                          result={AnagramResultState.unsolved}
                          word={word}
                          list={list}
                          counter={counter}
                          maxLengthInGroup={0}
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
      </AnagramResultsContainer>
    );
  }
};

export default AnagramResults;
