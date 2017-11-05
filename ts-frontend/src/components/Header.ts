import styled from 'styled-components';
import {LIGHT_COLOR, LIGHTER_COLOR} from 'src/constants';

const AnagramaniaHeader = styled.div`
background: radial-gradient(circle at 50% 1%, ${LIGHTER_COLOR}, ${LIGHT_COLOR});
box-shadow: 0 10px 80px -2px rgba(0, 0, 0, 0.4);
padding: 2rem 0 2rem;
display: flex;
justify-content: center;
`;

export default AnagramaniaHeader;