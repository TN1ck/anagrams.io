import * as React from 'react';
import styled from 'styled-components';
import {observer, inject, Provider} from 'mobx-react';
import {MARGIN_RAW, THEME} from 'src/theme';

import store from 'src/state';

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

@inject('store')
@observer
class AnagramInfoArea extends React.Component<{
  store?: AnagramState;
}> {
  render() {
    const store = this.props.store;
    const anagramIteratorState = store.anagramIteratorState;

    if (!anagramIteratorState) {
      return null;
    }

    const {
      solutions,
    } = anagramIteratorState;

    return (
      <div className="mt-3">
        <SubTitle className="mb-2">
          <strong>{`${solutions.length}`}</strong>{` solutions`}
        </SubTitle>
        <LoadingBar progress={store.progress} />
        <br />
        <div style={{textAlign: 'center'}}>
          <StyledCheckbox
            type="checkbox"
            id="group"
            onChange={store.toggleGroupByNumberOfWords}
          />
          <StyledLabel htmlFor="group">
            {'Group by number of words'}
          </StyledLabel>
        </div>
        <AnagramResults />
      </div>
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
  anagrams: string[] = ['anagrams', 'a mars nag', 'mara sang'];
  word: string = 'anagrams';
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
    if (this.input) {
      this.input.focus();
    }
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
        if (newIndex < 3) {
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
            <div style={{position: 'relative', top: -50, height: 150}}>
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
        {appState === 'search' ?
          <InnerContainer>
            <AnagramInfoArea />
          </InnerContainer> :
          null
        }
        {
          appState === 'anagramViewer' ?
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
  return <Provider store={store}><Anagramania /></Provider>;
};

export default ProvidedAnagramania;

