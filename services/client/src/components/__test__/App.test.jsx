import React from 'react';
import { shallow } from 'enzyme';

import App from '../../App';

it('App renders without crashing', () => {
  const wrapper = shallow(<App />)
})
