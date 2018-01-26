import styled from 'styled-components';
import {THEME} from 'src/theme';

export const Title = styled.a`
z-index: 1;
position: relative;
color: ${THEME.font.color};
font-weight: bold;
font-size: ${THEME.font.sizeTitle};
text-align: left;
display: inline-block;
padding: 0;
padding-bottom: 8px;
text-decoration: none;

&:before {
  z-index: -1;
  position: absolute;
  content: '';
  display: block;
  height: 4px;
  background: ${THEME.colors.primary};
  width: 100%;
  bottom: 0px;
  transition: height 0.15s ease-out;
}

&:hover {
  cursor: pointer;
  &:before {
    height: 100%;
  }
}

@media (max-width: 899px) {
  font-size: ${THEME.font.sizeTitleMobile};
}
`;

export const SubTitle = styled.h2`
  margin: ${THEME.margins.m2} 0;
  color: ${THEME.font.color};
  display: inline-block;

  & strong {
    background: ${THEME.font.highlightBackground};
    padding: ${THEME.margins.m1};
  }
`;

export const SmallTitle = styled.div`
  font-weight: bold;
`;
