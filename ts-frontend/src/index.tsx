import * as React from 'react';
import * as ReactDom from 'react-dom';

import Root from './pages/Root';

function renderApp(Component) {
  ReactDom.render(
    <Component />,
    document.getElementById('root'),
  );
}

renderApp(Root);

if (module.hot) {
  module.hot.accept();
  module.hot.accept(['./pages/Root.tsx'], () => {
    console.log('hey');
    renderApp(require('./pages/Root.tsx').default);
  });
}