import styled from 'styled-components';
import {YELLOW, ORANGE} from 'src/constants';

const SubHeader = styled.h2`
  color: black;
  /* padding: 5px 10px; */
  /* background: ${YELLOW}; */
  /* background: #FFF; */
  display: inline-block;
  /* border: 1px solid grey; */

  & strong {
    background: #DDD;
    padding: 4px;
    /* border-bottom: 4px solid ${ORANGE}; */
  }
`;

export default SubHeader;