import styled from 'styled-components';
import {withProps} from 'src/utility';
import {YELLOW} from 'src/constants';

const LoadingBar = withProps<{
    progress: number;
}>()(styled.div)`
  position: relative;
  border: 1px solid grey;
  padding 10px;
  background: ${props => {
    return `linear-gradient(to right, ${YELLOW} 0%, ${YELLOW} ${props.progress}%, #CCC ${props.progress}%, #CCC 100%);`;
  }}
  width: 100%;
`;

export default LoadingBar;