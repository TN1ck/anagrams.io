import * as React from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
import { THEME } from "src/theme";

import {
  SubTitle,
  AnagramResultsContainer,
  AnagramResultRow,
  SmallButton,
  SubTitleContainer,
} from "src/components";

import { AnagramState } from "../state";

import * as anagram from "src/anagram";

import AnagramResult from "./AnagramResult";
import { AnagramResultState } from "src/anagram";

const ShowMoreButtonContainer = styled.div`
  margin-top: ${THEME.margins.m2};
  margin-bottom: ${THEME.margins.m2};
  text-align: center;
  clear: both;
`;

interface AnagramResultGroupProps {
  group: anagram.GroupedAnagramSolutions[][];
  name: string;
  store?: AnagramState;
  index: number;
}

const AnagramResultGroup = inject("store")(
  observer(
    class AnagramResultGroup extends React.Component<
      AnagramResultGroupProps,
      {
        expanded: boolean;
      }
    > {
      constructor(props: AnagramResultGroupProps) {
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
        const { group, name, store, index } = this.props;

        const { columnWidth } = store!.getColumnWidth;
        const query = store!.cleanedQueryWithSpaces;

        const expanded = this.state.expanded;

        const firstGroup = index === 0;
        const maxRows = index === 0 ? 1000 : Math.max(100 - 10 * index, 5);
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
              const expanded = firstGroup && i === 0;
              return (
                <AnagramResultRow
                  key={i}
                  style={{
                    display: expanded ? "flex" : "block",
                  }}
                >
                  {g.map((d) => {
                    const { word, list, counter } = d;
                    const maxLengthInGroup = Math.max(
                      ...g.map((a) => a.list.length)
                    );
                    return (
                      <AnagramResult
                        expandFirst={expanded}
                        key={word}
                        share={store!.openModal}
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
            {canExpand ? (
              <ShowMoreButtonContainer>
                <SmallButton active={false} onClick={this.toggleExpand}>
                  {expanded
                    ? `Hide ${howManyHidden} again`
                    : `Show ${howManyHidden} more`}
                </SmallButton>
              </ShowMoreButtonContainer>
            ) : null}
          </div>
        );
      }
    }
  )
);

interface AnagramResultsProps {
  store?: AnagramState;
}

const AnagramResults = inject("store")(
  observer(
    class AnagramResults extends React.Component<
      AnagramResultsProps,
      {
        expanded: boolean;
      }
    > {
      dom: HTMLElement | null;
      constructor(props: AnagramResultsProps) {
        super(props);
        this.dom = null;
        this.setRef = this.setRef.bind(this);
        this.setWidth = this.setWidth.bind(this);
      }
      componentDidMount() {
        if (typeof window !== "undefined") {
          window.addEventListener("resize", this.setWidth);
        }
        this.setWidth();
      }
      componentWillUnmount() {
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", this.setWidth);
        }
      }
      setWidth() {
        if (this.dom) {
          const width = this.dom.clientWidth;
          this.props.store!.setWidth(width);
        }
      }
      setRef(dom: HTMLDivElement) {
        this.dom = dom;
      }
      render() {
        const store = this.props.store!;

        const query = store.query;
        const grouped = store.grouped;

        const { columnWidth } = store.getColumnWidth;

        const noResultsYet = store.noResultsYet;

        return (
          <AnagramResultsContainer ref={this.setRef}>
            {noResultsYet ? (
              <AnagramResult
                expandFirst={false}
                share={store.openModal}
                columnWidth={columnWidth}
                result={anagram.AnagramResultState.unsolved}
                word={"No word found yet..."}
                list={[]}
                counter={0}
                maxLengthInGroup={0}
                query={query}
              />
            ) : null}
            {grouped.map(({ group, name }, i) => {
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
    }
  )
);

export default AnagramResults;