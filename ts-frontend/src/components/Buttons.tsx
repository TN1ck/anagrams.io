import styled from 'styled-components';
import {withProps} from 'src/utility';
import {YELLOW} from 'src/constants';

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

export const SmallButton = withProps<{active: boolean}>()(styled.button)`
  background: ${props => props.active ? YELLOW : 'none'};
  border: none;
  color: black;
  margin-top: 10px;
  margin-right: 5px;
  padding: 2px 5px;
  outline: none;
  text-transform: uppercase;
  &:hover {
    background: ${YELLOW};
    cursor: pointer;
  }
`;

export const ShareButton = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.2;
  text-decoration: none;
  color: black;
  &:hover {
    opacity: 1.0;
    cursor: pointer;
    color: black;
  }
`;