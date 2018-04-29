import 'babel-polyfill';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import App from './App';

//
// https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari
// disable zooming on ios 10.3+
//

if (typeof document !== 'undefined') {
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
}

//
// render the app
//

// Export your top level component as JSX (for static rendering)
export default App;

// Render your app
if (typeof document !== "undefined") {
  const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate || ReactDom.render;
  const render = (Comp: any) => {
    renderMethod(<Comp />, document.getElementById("root"));
  };

  // Render!
  render(App);
}
