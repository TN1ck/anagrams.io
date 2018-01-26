import styled from 'styled-components';
import {THEME} from 'src/theme';

export const Header = styled.div`
  background: #DDDDDD;
  color: black;
  padding: ${THEME.margins.m4} 0 ${THEME.margins.m4};
  display: flex;
  justify-content: center;
`;

export const HeaderContainer = styled.div`
  max-width: ${THEME.widths.headerContainer};
  margin: 0 auto;
`;

export const InnerContainer = styled.div`
  max-width: 900px;
  width: 100%;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 899px) {
    max-width: 100%;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

export const Card = styled.div`
  background-color: ${THEME.colors.foreground};
  color: ${THEME.font.color};
  padding: ${THEME.margins.m4};
  box-shadow: ${THEME.dropShadow.s1};
  position: relative;
`;

export const Footer = styled.div`
  opacity: 0.7;
  position: fixed;
  bottom: ${THEME.margins.m3};
  right: ${THEME.margins.m3};
  background-color: ${THEME.font.color};
  display: flex;
  justify-content: center;
  font-size: ${THEME.font.sizeTiny};
`;