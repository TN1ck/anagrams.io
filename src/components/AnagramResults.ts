import styled, {css} from 'styled-components';
import {AnagramResultState} from 'src/anagram';

import {THEME, MARGIN_RAW} from 'src/theme';

export const ResultContainer = styled.div`
  position: relative;
  color: ${THEME.colors.foregroundText};
  white-space: nowrap;
  margin-top: ${THEME.margins.m1};

  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`;

export const AnagramResultsContainer = styled.div`
  margin-left: -${THEME.margins.m2};
  margin-right: -${THEME.margins.m2};

  /* Clear Fix! */
  &:after {
    content: '';
    display: block;
    clear: both;
  }
`;

export const AnagramResultRow = styled.div`
  float: left;
`;

export const AnagramResultGroup = styled.div<{
  state: AnagramResultState;
  noResults: boolean;
}>`
    float: left;
    width: 300px;
    background: ${THEME.colors.foreground};
    margin: ${THEME.margins.m2};
    padding: ${THEME.margins.m2} ${MARGIN_RAW.m2 + 2}px;
    box-shadow: ${THEME.dropShadow.s1};
    border-radius: ${THEME.borderRadius};
    opacity: 0.3;
    ${(props: any) => AnagramResultState.solved === props.state && css`
      opacity: 1.0;
    `}
    ${(props: any) => props.noResults && css`
      opacity: 0.3;
    `}
    ${(props: any) => AnagramResultState.active === props.state && css`
      opacity: 1.0;
      background: #2ecc71;
    `}
`;
