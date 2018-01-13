import styled from 'styled-components';
import {YELLOW} from 'src/constants';

const AnagramaniaTitle = styled.h1`
color: black;
font-weight: bold;
font-size: 2.5rem;
text-align: left;
display: inline-block;
/* margin: 2.5rem; */
padding: 0;
border-bottom: 4px solid ${YELLOW};
margin-bottom: 20px;

@media (max-width: 899px) {
  font-size: 1.5rem;
}
`;

export default AnagramaniaTitle;