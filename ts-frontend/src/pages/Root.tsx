import * as React from 'react';
import Anagramania from './Anagramania';
import Performance from './Performance';

const Root: React.StatelessComponent<{}> = () => {
  const location = window.location;
  const path = location.pathname;
  const pathArray = path.split('/');
  const page = pathArray[1];

  console.log(page, pathArray);
  switch (page) {
    case 'performance':
      return <Performance />;
    default:
      return <Anagramania />;
  }
};

export default Root;