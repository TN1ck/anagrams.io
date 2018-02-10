import styled from 'styled-components';
import {THEME} from 'src/theme';

export const Header = styled.div`
  background: ${THEME.colors.backgroundBright};
  color: ${THEME.colors.foregroundText};
  padding: ${THEME.margins.m4} 0 ${THEME.margins.m4};
  display: flex;
  justify-content: center;
`;

export const HeaderContainer = styled.div`
  max-width: ${THEME.widths.headerContainer};
  margin: 0 auto;
`;

export const InnerContainer = styled.div`
  max-width: ${THEME.widths.innerContainer};
  width: 100%;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 899px) {
    max-width: 100%;
    padding-left: ${THEME.margins.m3};
    padding-right: ${THEME.margins.m3};
  }
`;

export const Card = styled.div`
  background-color: ${THEME.colors.foreground};
  color: ${THEME.colors.foregroundText};
  padding: ${THEME.margins.m4};
  box-shadow: ${THEME.dropShadow.s1};
  position: relative;
`;

export const Footer = styled.div`
  opacity: 0.4;
  position: absolute;
  bottom: ${THEME.margins.m3};
  right: ${THEME.margins.m3};
  left: ${THEME.margins.m3};
  color: ${THEME.colors.foregroundText};
  font-size: ${THEME.font.sizeTiny};

  a {
    /* font-weight: bold; */
    color: ${THEME.colors.foregroundText};
  }
`;