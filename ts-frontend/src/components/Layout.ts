import styled from 'styled-components';

export const Header = styled.div`
  background: #DDDDDD;
  color: black;
  /* box-shadow: 0 10px 80px -2px rgba(0, 0, 0, 0.4); */
  padding: 2rem 0 2rem;
  display: flex;
  justify-content: center;
`;

export const HeaderContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export const InnerContainer = styled.div`
  max-width: 900px;
  width: 100%;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 899px) {
    max-width: 100%;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

export const Card = styled.div`
  background-color: #FFF;
  padding: 40px;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.2);
  position: relative;

`;

export const Footer = styled.div`
  opacity: 0.7;
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: black;
  display: flex;
  justify-content: center;
  font-size: 10px;
`;