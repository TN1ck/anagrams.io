import * as React from 'react';
import * as ReactDom from 'react-dom';

import Anagramania from './pages/Main';

function renderApp(Component) {
  ReactDom.render(
    <Component />,
    document.getElementById('root'),
  );
}

renderApp(Anagramania);

if (module.hot) {
  module.hot.accept();
  module.hot.accept(['./pages/Main.tsx'], () => {
    console.log('hey');
    renderApp(require('./pages/Main.tsx').default);
  });
}