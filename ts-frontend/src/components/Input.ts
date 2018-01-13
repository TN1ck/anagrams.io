import styled from 'styled-components';
import {YELLOW} from 'src/constants';

const AnagramaniaInput = styled.input`
border: 1px solid rgba(0, 0, 0, 0.4);
width: 100%;
background: rgba(0, 10, 25, 0.5);
box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
font-size: 1.25rem;
padding: 0.75rem 1.5rem;
color: white;
border-top-left-radius: 5px;
border-bottom-left-radius: 5px;

&:focus {
  border-color: ${YELLOW};
  outline: 0;
}
`;

export default AnagramaniaInput;