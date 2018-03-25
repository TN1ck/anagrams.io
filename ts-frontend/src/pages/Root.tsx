import * as React from 'react';
import {ThemeProvider, injectGlobal} from 'styled-components';
import {THEME} from 'src/theme';

import Anagramania from './Anagramania';
import Performance from './Performance';
import Styleguide from './Styleguide';

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
      .m-${index} {
        margin: ${margin};
      }
      .mt-${index} {
        margin-top: ${margin}
      }
      .mb-${index} {
        margin-bottom: ${margin}
      }
      .ml-${index} {
        margin-left: ${margin}
      }
      .mr-${index} {
        margin-right: ${margin}
      }

      .p-${index} {
        padding: ${margin};
      }
      .pt-${index} {
        padding-top: ${margin}
      }
      .pb-${index} {
        padding-bottom: ${margin}
      }
      .pl-${index} {
        padding-left: ${margin}
      }
      .pr-${index} {
        padding-right: ${margin}
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
  const location = window.location;
  const path = location.pathname;
  const pathArray = path.split('/');
  const page = pathArray[1];

  let component = null;

  switch (page) {
    case 'performance':
      component = <Performance />;
      break;
    case 'styleguide':
      component = <Styleguide />;
      break;
    default:
      component = <Anagramania />;
  }

  return (
    <ThemeProvider theme={THEME}>
      {component}
    </ThemeProvider>
  )
};

export default Root;
