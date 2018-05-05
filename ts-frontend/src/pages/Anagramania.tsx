import React from 'react';
import styled from 'styled-components';
import {observer, inject} from 'mobx-react';
import {MARGIN_RAW, THEME} from 'src/theme';

import store from 'src/state';

import {
  SearchBar,
  SearchBarInput,
  Header,
  InnerContainer,
  SubTitle,
  Title,
  HeaderContainer,
  LoadingBar,
  SmallTitle,
  TitleContainer,
  AnagramVisualizer,
  SearchBarForm,
} from 'src/components';

import {withProps} from 'src/utility';

import {Word, calculateWidths} from 'src/components/AnagramVisualizer';
import AnagramSausages from 'src/components/AnagramSausages';

import ReactModal from 'react-modal';

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
      <div style={{marginTop: THEME.margins.m3}}>
        <AnagramaniaOptions />
        <SubTitle style={{marginBottom: THEME.margins.m2}}>
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
class ExcludeOptions extends React.Component<{
  store?: AnagramState;
}> {
  render() {
    return (
      <div style={{
        display: 'inline-block',
        float: 'right',
        paddingTop: MARGIN_RAW.m2,
        paddingRight: 40,
      }}>
        <div>
          <SmallButton
            active={false}
            onClick={store.toggleExclude}
          >
            {store.showExclude ? 'Preselect Words -' : 'Preselect Words +'}
          </SmallButton>
        </div>
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
    if (typeof window !== 'undefined') {
      window.clearTimeout(this.updateTimeout);
    }
  }
  onQueryChange(e) {
    if (typeof window !== 'undefined') {
      window.clearTimeout(this.updateTimeout);
    }
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

    const fontSize = 30;

    const paddingTop = 0;
    const anagramVis = calculateWidths(word, anagram, fontSize);
    const wordWidth = word.length * anagramVis.letterWidth;

    return (
      <Header>
        <InnerContainer>
          <TitleContainer>
            <div style={{position: 'relative', top: -45, height: 150}}>
              <AnagramSausages
                word={word}
                anagram={anagram}
                height={word.length * anagramVis.letterHeight / 2 + 10}
                wordWidth={wordWidth}
                characterWidth={anagramVis.letterWidth}
                characterHeight={anagramVis.letterHeight}
                paddingTop={paddingTop}
                strokeWidth={anagramVis.strokeWidth}
              />
            </div>
            <Title href="/">
              <Word
                wordWidth={wordWidth}
                fontSize={fontSize}
                characterWidth={anagramVis.letterWidth}
                anagram={anagram}
                word={word}
              />
            </Title>
            <SmallTitle style={{
              marginTop: THEME.margins.m2,
              marginBottom: THEME.margins.m3,
            }}>
              {'The best anagram finder in the world.'}
            </SmallTitle>
          </TitleContainer>
          <HeaderContainer>
              <SearchBar
                value={query}
                disabled={dictionaries.length === 0}
                innerRef={this.setInputRef}
                onChange={this.onQueryChange}
                onSubmit={(e) => {
                  e.preventDefault();
                  requestAnagram();
                }}
              />
              {
                dictionaries.length === 0 ? (
                  <SmallButton
                    active={false}
                    style={{
                      marginRight: THEME.margins.m1,
                      marginTop: THEME.margins.m2,
                    }}
                  >{'Loading dictionaries...'}</SmallButton>
                ) : null
              }
              {dictionaries.map(d => {
                return (
                  <SmallButton
                    style={{
                      marginRight: THEME.margins.m1,
                      marginTop: THEME.margins.m2,
                    }}
                    key={d.id}
                    onClick={() => setDictionary(d.id)}
                    active={selectedDictionaries === d.id}
                  >
                    {d.name}
                  </SmallButton>
                );
              })}
              <ExcludeOptions />
              <SearchBarForm
                onSubmit={(e) => {
                  e.preventDefault();
                  requestAnagram();
                }}
              >
                <OptionsCollapse show={store.showExclude}>
                  <div style={{
                    paddingRight: 45,
                    marginTop: MARGIN_RAW.m2,
                    width: '100%',
                  }}>
                    <SearchBarInput
                      value={store.excludeWords}
                      type="text"
                      placeholder={'Words to be always included...'}
                      onChange={e => store.setExcludeWords(e.target.value)}
                    />
                    <div style={{marginTop: MARGIN_RAW.m1, color: 'red'}}>
                      {store.isExcludeInputValid ? '' : 'The words you entered do not appear in the search result. You cannot search with these words.'}
                    </div>
                  </div>
                </OptionsCollapse>
              </SearchBarForm>
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
    if (typeof document !== 'undefined') {
      ReactModal.setAppElement('body');
    }
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
            viewState={'edit'}
          />

        </ReactModal>

        <AnagramaniaHeader />

        <InnerContainer>
          <AnagramInfoArea />
        </InnerContainer>
      </div>
    );
  }
};

export default Anagramania;
