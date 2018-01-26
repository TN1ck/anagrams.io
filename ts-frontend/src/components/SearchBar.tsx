import * as React from 'react';
import styled from 'styled-components';

const SearchBarForm = styled.form`
  display: flex;
  position: relative;
  width: 100%;
`;

const SearchBarInput = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.4);
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
  font-size: 1.25rem;
  padding: 10px 10px;
  color: black;

  &:focus {
    outline: 0;
  }
`;

const SearchButton = styled.button`
  transition: all 300ms ease-out;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-left: none;
  background: rgba(0, 10, 25, 0.5);
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
  padding: 0 1.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    box-shadow: 0 5px 12px -2px rgba(255, 255, 255, 0.3);
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