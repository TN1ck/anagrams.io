import React from 'react';
import {createRoot} from 'react-dom/client'
import {Provider} from 'mobx-react';
import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "@tanstack/react-location";

import {injectGlobal} from 'styled-components';
import store from 'src/state';

import {MARGIN_RAW, THEME} from './theme';
import {Footer} from './components';
import {SmallButton} from './components';
import Anagramania from './pages/Anagramania';
import About from './pages/About';
import Styleguide from './pages/Styleguide';
import Share from './pages/Share';

injectGlobal`
  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  font-family: ${THEME.font.family};

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

  a.link {
    color: black;
    font-weight: bold;
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


const location = new ReactLocation();
const routes = [
    { path: "/", element: <Anagramania /> },
    {
      path: "/about",
      element: <About/>,
    },
    {
      path: "/share",
      element: <Share />,
    },
    {
      path: "/styleguide",
      element: <Styleguide/>,
    },
    {
      path: "*",
      element: <Anagramania />,
    },
    // {
    //   path: "/performance",
    //   element: <Performance/>,
    // },
    // {
    //   path: "/bestof",
    //   element: <BestO/>f
    // },
  ];

const App = () => {
  return (
    <Provider store={store}>
      <Router
      location={location}
      routes={routes}
    >
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
              activeOptions={{
                exact: true,
              }}
              getActiveProps={() => {
                return {
                  style: {
                    fontWeight: 'bold',
                  },
                };
              }}
            >
              <SmallButton
                active={false}
                useFontWeightHover
                style={{fontWeight: 'inherit'}}
              >{'Search'}</SmallButton>
            </Link>
            {/* <Link
              to='/bestof'
              activeOptions={{
                exact: true,
              }}
              getActiveProps={() => {
                return {
                  style: {
                    fontWeight: 'bold',
                  },
                };
              }}
            >
              <SmallButton
                active={false}
                useFontWeightHover
                style={{fontWeight: 'inherit'}}
              >{'Best Of'}</SmallButton>
            </Link> */}
            <Link
              to='/about'
              activeOptions={{
                exact: true,
              }}
              getActiveProps={() => {
                return {
                  style: {
                    fontWeight: 'bold',
                  },
                };
              }}
            >
              <SmallButton
                active={false}
                useFontWeightHover
                style={{fontWeight: 'inherit'}}
              >{'About'}</SmallButton>
            </Link>
          </div>

          <Outlet />
          <Footer>
            <span>{'Made by '}</span>
            <a href="http://tn1ck.com">{'Tom Nick'}</a>
            {' '}
            <span>{' & Taisia Tikhnovetskaya'}</span>
          </Footer>
        </div>
      </Router>
    </Provider>
  )
};

createRoot(document.getElementById("root")!).render(<App />)

