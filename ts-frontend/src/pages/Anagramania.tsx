import * as React from 'react';
import styled from 'styled-components';
import {observer, inject} from 'mobx-react';
import {MARGIN_RAW, THEME} from 'src/theme';

import store, {AppState} from 'src/state';

import {
  Footer,
  SearchBar,
  Header,
  InnerContainer,
  SubTitle,
  Title,
  HeaderContainer,
  LoadingBar,
  AnagramVisualizer,
  SmallTitle,
  TitleContainer,
  MutedButton,
} from 'src/components';

import {withProps} from 'src/utility';

import {Word, AnagramSausages, calculateWidths} from 'src/components/AnagramVisualizer';

import * as ReactModal from 'react-modal';
ReactModal.setAppElement('body');

import {AnagramState} from '../state';

import AnagramResults from 'src/molecules/AnagramResults';
import {
  SmallButton,
} from 'src/components';


const StyledCheckbox = styled.input`
  background: red;
  margin-top: ${THEME.margins.m2};
  margin-bottom: ${THEME.margins.m3};
  position: relative;
  width: 0;
  margin-right: 30px;
  display: inline-block;

  &:hover {
    cursor: pointer;
  }

  &:checked:after {
    position: absolute;
    top: -5px;
    left: 7px;
    display: block;
    content: 'L';
    font-size: 17px;
    transform: scaleY(-1) rotate(-221deg) ;
  }

  &:before {
    border-radius: ${THEME.borderRadius};
    position: absolute;
    top: -5px;
    left: 0;
    display: block;
    content: '';
    width: 20px;
    height: 20px;
    background: ${THEME.colors.backgroundBright};
    border: 1px solid ${THEME.colors.background};
  }
`;

const StyledLabel = styled.label`
  &:hover {
    cursor: pointer;
  }
`;

const StyledCheckboxContainer = styled.div`
  margin: ${THEME.margins.m2};
`;

@inject('store')
@observer
class AnagramInfoArea extends React.Component<{
  store?: AnagramState;
}> {
  render() {
    const store = this.props.store;
    const solutions = store.expandedSolutions;

    if (!store.showInfoArea) {
      return null;
    }

    return (
      <div className="mt-3">
        <AnagramaniaOptions />
        <SubTitle className="mb-2">
          <strong>{`${solutions.length}`}</strong>{` solutions`}
        </SubTitle>
        <LoadingBar progress={store.progress} />
        <AnagramResults />
      </div>
    );
  }
}

const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;

const OptionsCollapse = withProps<{
  show: boolean;
}>()(styled.div)`
  width: 100%;
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
`;

@inject('store')
@observer
class AnagramaniaOptions extends React.Component<{
  store?: AnagramState;
}> {
  render() {
    return (
      <OptionsContainer>
        <div style={{textAlign: 'center'}}>
          <SmallButton
            active={false}
            onClick={store.toggleShowOptions}
          >
            {store.showOptions ? 'Options -' : 'Options +'}
          </SmallButton>
        </div>
        <OptionsCollapse show={store.showOptions}>
          <StyledCheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              id="group"
              checked={store.groupByNumberOfWords}
              onChange={store.toggleGroupByNumberOfWords}
            />
            <StyledLabel htmlFor="group">
              {'Group by number of words'}
            </StyledLabel>
          </StyledCheckboxContainer>
          <StyledCheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              id="small-word"
              checked={store.allowOnlyOneSmallWord}
              onChange={store.toggleAllowOnlyOneSmallWord}
            />
            <StyledLabel htmlFor="small-word">
              {'Allow only one small word'}
            </StyledLabel>
          </StyledCheckboxContainer>
        </OptionsCollapse>
      </OptionsContainer>
    );
  }
}


@inject('store')
@observer
class AnagramaniaHeader extends React.Component<{
  store?: AnagramState;
}, {
  anagramIndex: number;
}> {
  anagrams: string[] = ['anagrams.io', 'so i anagram.', 'roams again.', 'mango arias.', 'anagrams.io'];
  word: string = 'anagrams.io';
  mounted: boolean = false;
  updateTimeout: number = 0;
  input: HTMLInputElement = null;

  constructor(props) {
    super(props);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.state = {
      anagramIndex: 0,
    };
  }
  setInputRef(dom) {
    this.input = dom;
    // is kind of annoying on mobile
    // if (this.input) {
    //   this.input.focus();
    // }
  }
  componentDidMount() {
    this.mounted = true;
    const duration = 3000;
    const update = () => {
      if (this.mounted) {
        const newIndex = (this.state.anagramIndex + 1);
        this.setState({
          anagramIndex: newIndex,
        });
        if (newIndex < this.anagrams.length) {
          this.updateTimeout = window.setTimeout(update, duration);
        }
      }
    };
    this.updateTimeout = window.setTimeout(update, 1500);
  }
  componentWillUnmount() {
    this.mounted = false;
    window.clearTimeout(this.updateTimeout);
  }
  onQueryChange(e) {
    window.clearTimeout(this.updateTimeout);
    if (this.word !== this.anagrams[this.state.anagramIndex % this.anagrams.length]) {
      this.setState({
        anagramIndex: 0,
      });
    }
    this.props.store.setQuery(e.target.value);
  }
  render() {
    const {
      dictionaries,
      selectedDictionaries,
      requestAnagram,
      setDictionary,
      query,
    } = this.props.store;

    const anagram = this.anagrams[this.state.anagramIndex % this.anagrams.length];
    const word = this.word;

    const maxWidth = 500;

    const anagramVis = calculateWidths(word, anagram, maxWidth);
    const wordWidth = calculateWidths(word, word, maxWidth).wordWidth;

    return (
      <Header>
        <InnerContainer>
          <TitleContainer>
            <div style={{position: 'relative', top: -110, height: 150}}>
              <AnagramSausages
                word={word}
                anagram={anagram}
                height={anagramVis.height}
                wordWidth={wordWidth}
                characterWidth={anagramVis.characterWidth}
                characterHeight={anagramVis.characterHeight}
                paddingTop={anagramVis.paddingTop}
                strokeWidth={MARGIN_RAW.m1 * 2}
              />
            </div>
            <Title href="/">
              <Word
                wordWidth={wordWidth}
                fontSize={anagramVis.fontSize}
                characterWidth={anagramVis.characterWidth}
                anagram={anagram}
                word={word}
              />
            </Title>
            <SmallTitle className="mt-1 mb-3">
              {'The best anagram finder in the world.'}
            </SmallTitle>
          </TitleContainer>
          <HeaderContainer>
            <SearchBar
              value={query}
              innerRef={this.setInputRef}
              onChange={this.onQueryChange}
              onSubmit={(e) => {
                e.preventDefault();
                requestAnagram();
              }}
            />
            {dictionaries.map(d => {
              return (
                <SmallButton
                  className="mr-1 mt-2"
                  key={d.id}
                  onClick={() => setDictionary(d.id)}
                  active={selectedDictionaries === d.id}
                >
                  {d.name}
                </SmallButton>
              );
            })}
          </HeaderContainer>
        </InnerContainer>
      </Header>
    );
  }
}

@inject('store')
@observer
class Anagramania extends React.Component<{
  store?: AnagramState;
}, {}> {
  worker: Worker;
  finished: boolean;
  constructor(props: any) {
    super(props);

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  onQueryChange(e) {
    this.props.store.setQuery(e.target.value);
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.store.requestAnagram();
  }
  onSelectChange(value) {
    this.props.store.setDictionary(value);
  }

  render() {

    const store = this.props.store;
    const appState = store.appState;

    return (
      <div>
        <ReactModal
          isOpen={store.showModal}
          onRequestClose={store.closeModal}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
          style={{
            overlay: {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 99},
            content: {
              padding: 15,
              background: 'none',
              borderRadius: 0,
              border: 'none',
              top: '50%',
              bottom: 'auto',
              left: '50%',
              right: 'auto',
              maxWidth: '800px',
              width: '100%',
              transform: `translate(-50%, -50%)`,
            }
          }}
        >
          <AnagramVisualizer
            anagram={store.modalAnagram}
            word={store.modalWord}
            close={store.closeModal}
            save={store.saveAnagram}
          />

        </ReactModal>

        <AnagramaniaHeader />

        <InnerContainer>
          <AnagramInfoArea />
        </InnerContainer>

        {
          appState === AppState.anagramViewer ?
            <InnerContainer>
              <div style={{marginTop: 30}}>
                <AnagramVisualizer
                  anagram={store.modalAnagram}
                  word={store.modalWord}
                  save={store.saveAnagram}
                />
              </div>
            </InnerContainer>
          : null
        }

        <Footer>
          <span>{'Made by '}</span>
          <a href="http://tomnick.org">{' Tom Nick '}</a>
          <span>{' & Taisia Tikhnovetskaya'}</span>
        </Footer>
      </div>
    );
  }
};


const ProvidedAnagramania = () => {
  return <Anagramania />;
};

export default ProvidedAnagramania;

