import * as React from 'react';
import {Provider} from 'mobx-react';
import { BrowserRouter } from 'react-router-dom'

import {injectGlobal} from 'styled-components';
import {THEME} from 'src/theme';
import store from 'src/state';

import App from './App';

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

  /* Margin classes */

  ${Object.values(THEME.margins).map((margin, i) => {
    const index = i + 1;
    return `
      .mt-${index} {
        margin-top: ${margin}
      }
      .mb-${index} {
        margin-bottom: ${margin}
      }
    `;
  }).join('\n')}

  /*
  When the modal is opened a ReactModal__Body--open class is added to the body tag.
  You can use this to remove scrolling on the body while the modal is open.
  */
  .ReactModal__Body--open {
    overflow: hidden;
  }
`;

const Root: React.StatelessComponent<{}> = () => {
  return (
    <div>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </div>
  )
};

export default Root;
