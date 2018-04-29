import React from 'react';
import {Provider} from 'mobx-react';
import { Router, Link } from "react-static";
import { hot } from "react-hot-loader";

import {injectGlobal} from 'styled-components';
import store from 'src/state';

import {MARGIN_RAW, THEME} from './theme';
import {Footer} from './components';
import {SmallButton} from './components';

import Routes from "react-static-routes";

injectGlobal`
  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    font-family: ${THEME.font.family};
    margin: 0;
    padding: 0;
    background-color: ${THEME.colors.background};
    font-size: ${THEME.font.sizeBase};
    padding-bottom: 100px;
    min-height: 100%;
    position: relative;
  }

  /*
  When the modal is opened a ReactModal__Body--open class is added to the body tag.
  You can use this to remove scrolling on the body while the modal is open.
  */
  .ReactModal__Body--open {
    overflow: hidden;
  }

  .ReactModal__Content {
    max-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
`;

const App: React.StatelessComponent<{}> = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <div style={{
            position: 'absolute',
            top: MARGIN_RAW.m2,
            right: MARGIN_RAW.m2,
            background: THEME.colors.backgroundBright,
            zIndex: 99,
          }}>
            <Link
              to='/'
              exact
              activeStyle={{
                fontWeight: 'bold',
              }}
            >
              <SmallButton
                active={false}
                useFontWeightHover
                style={{fontWeight: 'inherit'}}
              >{'Search'}</SmallButton>
            </Link>
            <Link
              to='/about'
              exact
              activeStyle={{
                fontWeight: 'bold',
              }}
            >
              <SmallButton
                active={false}
                useFontWeightHover
                style={{fontWeight: 'inherit'}}
              >{'About'}</SmallButton>
            </Link>
            <Link
              to='/share'
              exact
              activeStyle={{
                fontWeight: 'bold',
              }}
            >
              <SmallButton
                active={false}
                useFontWeightHover
                style={{fontWeight: 'inherit'}}
              >{'Share'}</SmallButton>
            </Link>
          </div>

          <Routes />
        </div>
        <Footer>
          <span>{'Made by '}</span>
          <a href="http://tomnick.org">{' Tom Nick '}</a>
          <span>{' & Taisia Tikhnovetskaya'}</span>
        </Footer>
      </Router>
    </Provider>
  )
};

export default hot(module)(App);

