import styled from 'styled-components';
import {THEME} from 'src/theme';

export const Title = styled.a`
z-index: 1;
position: relative;
color: ${THEME.colors.foregroundText};
font-weight: bold;
font-size: ${THEME.font.sizeTitle};
text-align: center;
display: inline-block;
padding: 0;
padding-bottom: 8px;
text-decoration: none;
text-align: center;

@media (max-width: 899px) {
  font-size: ${THEME.font.sizeTitleMobile};
}
`;

export const SubTitle = styled.h2`
  margin: ${THEME.margins.m2} 0;
  color: ${THEME.colors.backgroundText};
  text-align: center;
`;

export const SubTitleContainer = styled.div`
  float: left;
  width: 100%;
  margin-left: ${THEME.margins.m2};
`;

export const SmallTitle = styled.div`
  font-weight: normal;
`;
