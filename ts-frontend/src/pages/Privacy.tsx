import React from 'react';
import * as Components from '../components';
import {MARGIN_RAW} from 'src/theme';


import {Card} from 'src/components/Layout';

class Privacy extends React.Component<{
  privacyHtml: string;
}> {
  render() {
    return (
      <div>
        <Components.Header style={{paddingBottom: MARGIN_RAW.m2, background: 'transparent'}}>
          <Components.InnerContainer style={{maxWidth: 670}}>
            <Components.Title>
              {'Privacy'}
            </Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer style={{maxWidth: 740}}>
        <Card dangerouslySetInnerHTML={{__html: this.props.privacyHtml}}>
        </Card>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default Privacy;
