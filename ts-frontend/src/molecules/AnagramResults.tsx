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
    this.setWidth = this.setWidth.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.setWidth);
    this.setWidth();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setWidth);
  }
  setWidth() {
    if (this.dom) {
      const width = this.dom.clientWidth;
      this.props.store.setWidth(width);
    }
  }
  setRef(dom) {
    this.dom = dom;
  }
  render() {
    const store = this.props.store;

    const query = store.query;
    const groupedAnagrams = store.groupedAnagrams;
    const grouped = store.grouped;

    const {
      columnWidth,
    } = store.getColumnWidth;

    return (
      <AnagramResultsContainer innerRef={this.setRef}>
        {
          groupedAnagrams.length === 0 ? (
            <AnagramResult
              share={store.openModal}
              columnWidth={columnWidth}
              result={anagram.AnagramResultState.unsolved}
              word={'No word found yet...'}
              list={[]}
              counter={0}
              maxLengthInGroup={0}
              query={query}
            />
          ) : null
        }
        {grouped.map(({group, name}, i) => {
          return (
            <div key={i}>
              {name !== null && <SubTitleContainer>
                <SubTitle>{name}</SubTitle>
              </SubTitleContainer>}
              {group.map((g, i) => {
                return (
                  <AnagramResultRow key={i}>
                    {g.map((d) => {
                      const {word, list, counter} = d;
                      const maxLengthInGroup = Math.max(...g.map(a => a.list.length));
                      return (
                        <AnagramResult
                          key={word}
                          share={store.openModal}
                          columnWidth={columnWidth}
                          result={AnagramResultState.solved}
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
            </div>
          );
        })}
      </AnagramResultsContainer>
    );
  }
};

export default AnagramResults;
