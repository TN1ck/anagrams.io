import * as React from 'react';
import * as ReactDom from 'react-dom';

import Root from './pages/Root';

import 'src/assets/styles.css';

//
// https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari
// disable zooming on ios 10.3+
//

document.addEventListener('touchmove', function(event: any) {
  if (event.scale !== 1) {
     event.preventDefault();
  }
}, false);

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

//
// render the app
//

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
