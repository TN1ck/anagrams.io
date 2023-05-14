import styled, { css } from "styled-components";
import { THEME } from "src/theme";

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

export const SmallButton = styled.button<{
  active: boolean;
  useFontWeightHover?: boolean;
}>`
  background: ${(props) => (props.active ? THEME.colors.primary : "none")};
  border: none;
  color: ${(props) =>
    props.active ? THEME.colors.primaryText : THEME.colors.foregroundText};
  margin: 0;
  padding: 2px 5px;
  border: ${(props) =>
    props.active
      ? "1px rgba(0, 0, 0, 0.08) solid"
      : "1px rgba(0, 0, 0, 0) solid"};
  outline: none;
  text-transform: uppercase;
  border-radius: ${THEME.borderRadius};
  font-family: ${THEME.font.family};
  &:hover {
    background: ${(props) =>
      props.useFontWeightHover ? "none" : THEME.colors.primary};
    font-weight: ${(props) =>
      props.useFontWeightHover ? "bold" : "inherit"} !important;
    cursor: pointer;
  }
`;

export const NormalButton = styled.button<{
  active: boolean;
  useFontWeightHover?: boolean;
}>`
  background: ${THEME.colors.background};
  border: none;
  color: ${(props) =>
    props.active ? THEME.colors.primaryText : THEME.colors.foregroundText};
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border: ${(props) =>
    props.active
      ? "1px rgba(0, 0, 0, 0.08) solid"
      : "1px rgba(0, 0, 0, 0) solid"};
  outline: none;
  font-weight: bold;
  // text-transform: uppercase;
  border-radius: ${THEME.borderRadius};
  font-family: ${THEME.font.family};
  &:hover {
    background: ${THEME.colors.primary};
    cursor: pointer;
  }
`;

export const MutedButton = styled.button<{
  hovered?: boolean;
}>`
  border: none;
  background: none;
  opacity: 0.2;
  text-decoration: none;
  color: ${THEME.colors.foregroundText};

  ${(props) =>
    props.hovered &&
    css`
      opacity: 1;
      cursor: pointer;
      color: ${THEME.colors.foregroundText};
    `}

  &:hover {
    opacity: 1;
    cursor: pointer;
    color: ${THEME.colors.foregroundText};
  }
`;
