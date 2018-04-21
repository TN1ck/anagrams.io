import * as React from 'react';
import styled from 'styled-components';
import {observer, inject} from 'mobx-react';
import {THEME} from 'src/theme';

import {
  SubTitle,
  AnagramResultsContainer,
  AnagramResultRow,
  SmallButton,
} from 'src/components';

import {AnagramState, AppState} from '../state';

import * as anagram from 'src/anagram';

import AnagramResult from './AnagramResult';
import { AnagramResultState } from 'src/anagram';

const SubTitleContainer = styled.div`
  float: left;
  width: 100%;
  margin-left: ${THEME.margins.m2};
`;

const ShowMoreButtonContainer = styled.div`
  margin-top: ${THEME.margins.m2};
  margin-bottom: ${THEME.margins.m2};
  text-align: center;
  clear: both;
`;


@inject('store')
@observer
class AnagramResultGroup extends React.Component<{
  group: anagram.GroupedAnagramSolutions[][];
  name: string;
  store?: AnagramState;
  index: number;
}, {
  expanded: boolean
}> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }
  render() {
    const {
      group,
      name,
      store,
      index,
    } = this.props;

    const {
      columnWidth,
    } = store.getColumnWidth;
    const query = store.cleanedQueryWithSpaces;

    const expanded = this.state.expanded;

    const maxRows = index === 0 ? 1000 : Math.max((100 - 10 * index), 5);
    const expandedGroup = expanded ? group : group.slice(0, maxRows);
    const howManyHidden = group.length - maxRows;
    const canExpand = howManyHidden > 0;

    return (
      <div>
        {name !== null && (
          <SubTitleContainer>
            <SubTitle>{name}</SubTitle>
          </SubTitleContainer>
        )}
        {expandedGroup.map((g, i) => {
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
        {
          canExpand ? (
            <ShowMoreButtonContainer>
              <SmallButton
                active={false}
                onClick={this.toggleExpand}
              >
                {expanded ? `Hide ${howManyHidden} again` :`Show ${howManyHidden} more`}
              </SmallButton>
            </ShowMoreButtonContainer>
          ) : null
        }
      </div>
    );
  }
}

@inject('store')
@observer
class AnagramResults extends React.Component<{
  store?: AnagramState;
}, {
  expanded: boolean;
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

    const noResultsYet = groupedAnagrams.length === 0 && store.appState === AppState.search;

    return (
      <AnagramResultsContainer innerRef={this.setRef}>
        {
          noResultsYet ? (
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
            <AnagramResultGroup
              key={i}
              group={group}
              name={name}
              index={i}
            />
          );
        })}
      </AnagramResultsContainer>
    );
  }
};

export default AnagramResults;
