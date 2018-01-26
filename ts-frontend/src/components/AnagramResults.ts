import styled, {css} from 'styled-components';
import {AnagramResultState} from 'src/anagram';

import {withProps} from 'src/utility';
import {THEME} from 'src/theme';

export const ResultContainer = styled.div`
  position: relative;
  color: ${THEME.colors.foregroundText};
  white-space: nowrap;
  margin-top: ${THEME.margins.m1};
`;

export const AnagramResultsContainer = styled.div`
  margin-left: -${THEME.margins.m2};
  margin-right: -${THEME.margins.m2};
`;

export const AnagramResultRow = styled.div`
  float: left;
`;

export const AnagramResultGroup = withProps<{
    state: AnagramResultState;
    noResults: boolean;
  }>()(styled.div)`
    float: left;
    width: 300px;
    background: ${THEME.colors.foreground};
    margin: ${THEME.margins.m2};
    padding: ${THEME.margins.m2};
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
