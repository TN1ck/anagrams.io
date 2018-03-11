import * as React from 'react';
import styled from 'styled-components';
import {THEME} from 'src/theme';
import Lense from './Lense';

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
  /* box-shadow: ${THEME.dropShadow.s1}; */
  font-size: ${THEME.font.sizeLarge};
  padding: ${THEME.margins.m2} ${THEME.margins.m2};
  color: ${THEME.colors.foregroundText};
  border-radius: ${THEME.borderRadius};
  font-family: ${THEME.font.family};

  &:focus {
    outline: 0;
  }
`;

const SearchButton = styled.button`
  transition: all 300ms ease-out;
  border: 1px solid ${THEME.colors.border};
  border: none;
  border-left: none;
  background: ${THEME.colors.background};
  font-size: ${THEME.font.sizeLarge};
  color: ${THEME.searchBar.buttonTextColor};
  /* box-shadow: ${THEME.dropShadow.s1}; */
  border-radius: ${THEME.borderRadius};
  padding: 0 ${THEME.margins.m2};
  margin: 0;
  margin-left: ${THEME.margins.m1};
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
          <Lense />
        </SearchButton>
      </SearchBarForm>
    );
  }
}

export default SearchBar;