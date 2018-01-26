import styled, {css} from 'styled-components';
import {AnagramResultState} from 'src/anagram';

import {withProps} from 'src/utility';

export const ResultContainer = styled.div`
  position: relative;
  color: black;
  white-space: nowrap;
  margin-top: 5px;
`;

export const AnagramResultsContainer = styled.div`
  margin-left: -10px;
  margin-right: -10px;
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
    background: white;
    margin: 10px;
    padding: 10px;
    box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.2);
    // border-radius: 2px;
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
