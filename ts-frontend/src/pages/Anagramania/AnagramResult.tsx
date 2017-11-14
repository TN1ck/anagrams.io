import * as React from 'react';
import styled, {css} from 'styled-components';
import {take} from 'lodash';

import {withProps} from 'src/utility';

import * as anagram from 'src/anagram';

const ResultContainer = styled.div`
  color: black;
  white-space: nowrap;
  margin-top: 5px;
`;

class Result extends React.Component<{
  result: anagram.IndexedWord[];
  index: number;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {result, index} = this.props;
    return (
      <ResultContainer>
        {(index + 1) + '. ' + result.map(w => {
          return w.word.word;
        }).join(' ')}
      </ResultContainer>
    );
  }
}

const AnagramResultGroup = withProps<{
  state: anagram.AnagramResultState;
  noResults: boolean;
}>()(styled.div)`
  float: left;
  width: 300px;
  background: white;
  margin: 10px;
  padding: 10px;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  opacity: 0.3;
  ${(props: any) => anagram.AnagramResultState.solved === props.state && css`
    opacity: 1.0;
  `}
  ${(props: any) => props.noResults && css`
    opacity: 0.3;
  `}
  ${(props: any) => anagram.AnagramResultState.active === props.state && css`
    opacity: 1.0;
    background: #2ecc71;
  `}
`;

const ShowAllButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 10px;
  outline: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface AnagramResultProps {
    result: anagram.AnagramResultState;
    word: string;
    list: anagram.IndexedWord[][];
    counter: number;
    columnWidth: number;
    maxLengthInGroup: number;
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
    } = this.props;

    const minHeight = 17;
    const rowHeight = 21;
    const maxHeight = 262;

    let height: any = (maxLengthInGroup > 10 ? maxHeight : minHeight + (rowHeight * maxLengthInGroup)) + 20;
    height = this.state.showAll ? 'auto' : height;

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
          {take(list, !this.state.showAll ? 10 : list.length).map((a, i) => {
            return <Result key={i} result={a} index={i} />
          })}
          {
            list.length > 10
              ? 
                <ShowAllButton onClick={this.toggleShowAll}>
                  {this.state.showAll
                    ? `... hide ${list.length - 10} items`
                    : `... show ${list.length - 10} more`
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