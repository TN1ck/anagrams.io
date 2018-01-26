import * as React from 'react';
import styled from 'styled-components';
import * as Components from 'src/components';
import AnagramResults from 'src/molecules/AnagramResults';
import mockState from 'src/assets/anagramPageMock';

const Card = styled.div`
  margin-top: 10px;
  background-color: #FFF;
  padding: 10px;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.2);
  position: relative;
`;

class StyleguideComponent extends React.Component<any> {
  render() {
    return (
      <Card>
        <div>{this.props.description}</div>
        <div>
          {this.props.children}
        </div>
      </Card>
    )
  }
}

class StyleguideSection extends React.Component<any> {
  render() {
    return (
      <div>
        <Components.SubTitle>{this.props.description}</Components.SubTitle>
        {this.props.children}
      </div>
    );
  }
}

class Styleguide extends React.Component {
  render() {
    return (
      <div>
        <Components.Header>
          <Components.InnerContainer>
            <Components.Title>
              {'Styleguide'}
            </Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer>

          <StyleguideSection description={'Typographie styles that are used throughout the page.'}>
            <StyleguideComponent description={'Page Header'}>
              <Components.Title>{'This is a test title'}</Components.Title>
            </StyleguideComponent>
            <StyleguideComponent description={'Subtitle'}>
              <Components.SubTitle>{'This is a test Title'}</Components.SubTitle>
            </StyleguideComponent>
            <StyleguideComponent description={'Small Title'}>
              <Components.SmallTitle>{'This is a a small title'}</Components.SmallTitle>
            </StyleguideComponent>
          </StyleguideSection>

          <StyleguideSection description={'Visualizer'}>
            <Components.AnagramVisualizer anagram={'Oscar Wilde'} word={'Cowards Lie'}/>
          </StyleguideSection>

          <StyleguideSection description={'Searchbar'}>
            <Components.SearchBar onChange={() => 2} onSubmit={() => 2}/>
          </StyleguideSection>

          <StyleguideSection description={'Loading Bar'}>
            <Components.LoadingBar progress={50}/>
          </StyleguideSection>

          <StyleguideSection description={'Anagram Results'}>
            <AnagramResults
              share={() => 2}
              subanagrams={mockState.subanagrams}
              anagramIteratorState={mockState.anagramIteratorState}
              isDone={false}
              wordStats={{average: 0, min: 0, max: 0}}
              query={mockState.query}

            />
          </StyleguideSection>
          

        </Components.InnerContainer>
      </div>
    );
  }
}

export default Styleguide;