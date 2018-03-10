import * as React from 'react';
import styled from 'styled-components';
import {THEME} from 'src/theme';

const SearchBarForm = styled.form`
  display: flex;
  position: relative;
  width: 100%;
`;

const SearchBarInput = styled.input`
  margin: 0;
  border: 1px solid ${THEME.colors.border};
  border: none;
  width: 100%;
  background: ${THEME.searchBar.barBackgroundColor};
  box-shadow: ${THEME.dropShadow.s1};
  font-size: ${THEME.font.sizeLarge};
  padding: ${THEME.margins.m2} ${THEME.margins.m2};
  color: ${THEME.colors.foregroundText};
  border-radius: 0;
  border-top-left-radius: ${THEME.borderRadius};
  border-bottom-left-radius: ${THEME.borderRadius};
  font-family: ${THEME.font.family};

  &:focus {
    outline: 0;
  }
`;

const SearchButton = styled.button`
  transition: all 300ms ease-out;
  border: 1px solid ${THEME.colors.border};
  border-left: none;
  background: ${THEME.searchBar.buttonColor};
  font-size: ${THEME.font.sizeLarge};
  color: ${THEME.searchBar.buttonTextColor};
  box-shadow: ${THEME.dropShadow.s1};
  padding: 0 ${THEME.margins.m3};
  border-radius: 0;
  border-top-right-radius: ${THEME.borderRadius};
  border-bottom-right-radius: ${THEME.borderRadius};
  margin: 0;
  font-family: ${THEME.font.family};
  /* margin-left: 5px; */

  &:hover {
    background: ${THEME.searchBar.buttonColorHover};
    cursor: pointer;
  }

  &:focus {
    outline: 0;
  }
`;

class SearchBar extends React.Component<{
  onSubmit: any,
  onChange: any,
}> {
  input: HTMLElement;
  setInput(dom: HTMLInputElement) {
    this.input = dom;
  }
  render() {
    const {
      onSubmit,
      onChange,
    } = this.props;
    return (
      <SearchBarForm onSubmit={onSubmit}>
        <SearchBarInput
          type="text"
          innerRef={(e) => this.setInput(e)}
          onChange={onChange}
        />
        <SearchButton>
          {'Go!'}
        </SearchButton>
      </SearchBarForm>
    );
  }
}

export default SearchBar;