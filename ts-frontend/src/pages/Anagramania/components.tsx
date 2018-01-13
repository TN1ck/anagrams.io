import styled, {css} from 'styled-components';
import * as anagram from 'src/anagram';

import {withProps} from 'src/utility';
import {YELLOW} from 'src/constants';

export const ResultContainer = styled.div`
  position: relative;
  color: black;
  white-space: nowrap;
  margin-top: 5px;
`;

export const ShareButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.2;
  &:hover {
    opacity: 1.0;
    cursor: pointer;
  }
`;

export const HeaderContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export const Strong = styled.strong`
  color: black;
  font-size: 14px;
`;

export const AnagramResultsContainer = styled.div`
  margin-left: -10px;
  margin-right: -10px;
`;

export const AnagramResultRow = styled.div`
  float: left;
`;

export const AnagramResultGroup = withProps<{
    state: anagram.AnagramResultState;
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
  
export const ShowAllButton = styled.button`
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

export const DictionaryButton = withProps<{active: boolean}>()(styled.button)`
  background: ${props => props.active ? YELLOW : 'none'};
  border: none;
  color: black;
  margin-top: 10px;
  margin-right: 5px;
  padding: 5px 5pxpx;
  outline: none;
  text-transform: uppercase;
  &:hover {
    background: ${YELLOW};
    cursor: pointer;
  }
`;