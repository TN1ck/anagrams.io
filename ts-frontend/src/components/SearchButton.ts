import styled from 'styled-components';

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

export default SearchButton;