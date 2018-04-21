import * as React from 'react';
import styled from 'styled-components';

import {withProps} from 'src/utility';
import {THEME} from 'src/theme';

const LoadingBar = withProps<{
    progress: number;
}>()(styled.div)`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: ${THEME.margins.m1};
  // box-shadow: ${THEME.dropShadow.s1};
  border-radius: ${THEME.borderRadius};
  background: ${props => {
    return `linear-gradient(to right, ${THEME.colors.primary} 0%, ${THEME.colors.primary} ${props.progress}%, ${THEME.colors.backgroundBright} ${props.progress}%, ${THEME.colors.backgroundBright} 100%);`;
  }}
  margin-bottom: ${THEME.margins.m2};
  width: 100%;
`;

class LoadingBarWrapped extends React.Component<{
  progress: number;
}> {
  render() {
    return (
      <LoadingBar progress={this.props.progress}>
        {this.props.children}
        <div style={{position: 'absolute', right: THEME.margins.m2, top: THEME.margins.m2}}>
        </div>
      </LoadingBar>
    );
  }
}

export default LoadingBarWrapped;
