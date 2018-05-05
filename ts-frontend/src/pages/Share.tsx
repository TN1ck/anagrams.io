import React from 'react';
import {observer, inject} from 'mobx-react';

import {AnagramState} from '../state';
import * as Components from '../components';
import {MARGIN_RAW} from 'src/theme';

@inject('store')
@observer
class About extends React.Component<{
  store?: AnagramState;
}> {
  componentWillmount() {
    this.props.store.setShareWords();
  }
  render() {
    const store = this.props.store;
    return (
      <div>
        <Components.Header style={{paddingBottom: MARGIN_RAW.m2}}>
          <Components.InnerContainer>
            <Components.Title>
              {'Share'}
            </Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer>
          <div style={{marginTop: 30}}>
            <Components.AnagramVisualizer
              anagram={store.modalAnagram}
              word={store.modalWord}
              save={store.saveAnagram}
            />
          </div>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default About;
