import styled from 'styled-components';
import {YELLOW} from 'src/constants';

const AnagramaniaInput = styled.input`
border: 1px solid rgba(0, 0, 0, 0.4);
width: 100%;
background: rgba(0, 10, 25, 0.1);
box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
font-size: 1.25rem;
padding: 10px 10px;
color: black;

&:focus {
  outline: 0;
}
`;

export default AnagramaniaInput;