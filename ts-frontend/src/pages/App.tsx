import * as React from 'react';
import {Route, NavLink} from 'react-router-dom';

import {MARGIN_RAW, THEME} from '../theme';
import {Footer} from '../components';
import {SmallButton} from '../components';
import Anagramania from './Anagramania';
import Performance from './Performance';
import Styleguide from './Styleguide';
import About from './About';

class App extends React.Component {
  render() {
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: MARGIN_RAW.m2,
          right: MARGIN_RAW.m2,
          background: THEME.colors.backgroundBright,
          zIndex: 99,
        }}>
          <NavLink
            to='/'
            exact
            activeStyle={{
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            <SmallButton
              active={false}
              useFontWeightHover
              style={{fontWeight: 'inherit'}}
            >{'Search'}</SmallButton>
          </NavLink>
          <NavLink
            to='/about'
            exact
            activeStyle={{
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            <SmallButton
              active={false}
              useFontWeightHover
              style={{fontWeight: 'inherit'}}
            >{'About'}</SmallButton>
          </NavLink>
        </div>
        <div>
          <Route
            path="/"
            component={Anagramania}
            exact
          />
          <Route
            path="/performance"
            exact
            component={Performance}
          />
          <Route
            path="/about"
            exact
            component={About}
          />
          <Route
            path="/styleguide"
            exact
            component={Styleguide}
          />
        </div>
        <Footer>
          <span>{'Made by '}</span>
          <a href="http://tomnick.org">{' Tom Nick '}</a>
          <span>{' & Taisia Tikhnovetskaya'}</span>
        </Footer>
      </div>
    );
  }
};

export default App;
