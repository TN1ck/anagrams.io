import styled from 'styled-components';
import {withProps} from 'src/utility';
import {THEME} from 'src/theme';

export const ShowAllButton = styled.button`
  background: none;
  border: none;
  font-size: ${THEME.font.sizeSmall};
  font-weight: bold;
  padding-top: ${THEME.margins.m2};
  padding-bottom: ${THEME.margins.m2};
  outline: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const SmallButton = withProps<{active: boolean}>()(styled.button)`
  background: ${props => props.active ? THEME.colors.primary : 'none'};
  border: none;
  color: ${THEME.font.color};
  margin: 0;
  padding: 2px 5px;
  outline: none;
  text-transform: uppercase;
  &:hover {
    background: ${THEME.colors.primary};
    cursor: pointer;
  }
`;

export const ShareButton = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.2;
  text-decoration: none;
  color: ${THEME.font.color};
  &:hover {
    opacity: 1.0;
    cursor: pointer;
    color: ${THEME.font.color};
  }
`;