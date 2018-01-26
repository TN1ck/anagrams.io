import * as React from 'react';
import Anagramania from './Anagramania';
import Performance from './Performance';
import Styleguide from './Styleguide';

const Root: React.StatelessComponent<{}> = () => {
  const location = window.location;
  const path = location.pathname;
  const pathArray = path.split('/');
  const page = pathArray[1];

  switch (page) {
    case 'performance':
      return <Performance />;
    case 'styleguide':
      return <Styleguide />;
    default:
      return <Anagramania />;
  }
};

export default Root;