import styled from 'styled-components';
import {YELLOW} from 'src/constants';

export const Title = styled.a`
z-index: 1;
position: relative;
color: black;
font-weight: bold;
font-size: 2.5rem;
text-align: left;
display: inline-block;
/* margin: 2.5rem; */
padding: 0;
padding-bottom: 8px;
margin-bottom: 20px;
text-decoration: none;

&:before {
  z-index: -1;
  position: absolute;
  content: '';
  display: block;
  height: 4px;
  background: ${YELLOW};
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
  font-size: 1.5rem;
}
`;

export const SubTitle = styled.h2`
  color: black;
  /* padding: 5px 10px; */
  /* background: ${YELLOW}; */
  /* background: #FFF; */
  display: inline-block;
  /* border: 1px solid grey; */

  & strong {
    background: #DDD;
    padding: 4px;
  }
`;

export const SmallTitle = styled.div`
  margin-top: -15px;
  margin-bottom: 20px;
`;
