import styled, {css} from 'styled-components';
import {withProps} from 'src/utility';
import {THEME} from 'src/theme';

export const ShowAllButton = styled.button`
  background: none;
  border: none;
  font-size: ${THEME.font.sizeSmall};
  font-weight: normal;
  padding-left: 0;
  padding-right: 0;
  padding-top: ${THEME.margins.m2};
  padding-bottom: ${THEME.margins.m2};
  font-family: ${THEME.font.family};
  outline: none;
  color: ${THEME.colors.foregroundText};
  opacity: 0.5;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const SmallButton = withProps<{active: boolean}>()(styled.button)`
  background: ${props => props.active ? THEME.colors.primary : 'none'};
  border: none;
  color: ${props => props.active ? THEME.colors.primaryText : THEME.colors.foregroundText};
  margin: 0;
  padding: 2px 5px;
  outline: none;
  text-transform: uppercase;
  border-radius: ${THEME.borderRadius};
  font-family: ${THEME.font.family};
  &:hover {
    background: ${THEME.colors.primary};
    cursor: pointer;
  }
`;

export const MutedButton = withProps<{
  hovered?: boolean;
}>()(styled.a)`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.2;
  text-decoration: none;
  color: ${THEME.colors.foregroundText};

  ${props => props.hovered && css`
    opacity: 1.0;
    cursor: pointer;
    color: ${THEME.colors.foregroundText};
  `}

  &:hover {
    opacity: 1.0;
    cursor: pointer;
    color: ${THEME.colors.foregroundText};
  }
`;
