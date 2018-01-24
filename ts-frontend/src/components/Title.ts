import styled from 'styled-components';
import {YELLOW} from 'src/constants';

const AnagramaniaTitle = styled.a`
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

export default AnagramaniaTitle;