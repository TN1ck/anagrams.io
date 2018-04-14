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
  margin-top: ${THEME.margins.m2};
  position: relative;
  width: 0;
  height: 0;
  opacity: 0;
  margin-right: ${MARGIN_RAW.m3 + MARGIN_RAW.m1}px;
  display: inline-block;

  &:hover {
    cursor: pointer;
  }

`;

const StyledCheckboxSquare = withProps<{
  checked: boolean;
}>()(styled.div)`
  border-radius: ${THEME.borderRadius};
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: ${THEME.colors.backgroundBright};
  border: 1px solid ${THEME.colors.background};

  &:after {
    display: block;
    content: ${props => props.checked ? "'L'" : "''"};
    position: absolute;
    top: -4px;
    left: 5px;
    font-size: 17px;
    transform: scaleY(-1) rotate(-221deg);
  }

  &:hover {
    cursor: pointer;
  }

`;

const StyledLabel = styled.label`
  &:hover {
    cursor: pointer;
  }
`;

const StyledCheckboxContainer = styled.div`
  margin: ${THEME.margins.m2};
  position: relative;
`;

const Checkbox: React.StatelessComponent<{
  id: string;
  checked: boolean;
  onChange: () => any;
}> = ({id, onChange, checked, children}) => {
  return (
    <StyledCheckboxContainer>
      <StyledCheckbox
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <StyledCheckboxSquare
        checked={checked}
        onClick={onChange}
      />
      <StyledLabel htmlFor={id}>
        {children}
      </StyledLabel>
    </StyledCheckboxContainer>
  );
};

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
  flex-wrap: wrap;
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
          <Checkbox
            id='group'
            checked={store.groupByNumberOfWords}
            onChange={store.toggleGroupByNumberOfWords}
          >
            {'Group by number of words'}
          </Checkbox>
          <Checkbox
            id='one-word'
            checked={store.allowOnlyOneSmallWord}
            onChange={store.toggleAllowOnlyOneSmallWord}
          >
            {'Allow only one small word'}
          </Checkbox>
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

