import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom'

import App from '../../App';

it('App renders without crashing', () => {
  const wrapper = shallow(<App />)
})

it('App will call componentWillMount when mounted', () => {
  const onWillMount = jest.fn()
  App.prototype.componentWillMount = onWillMount
  const wrapper = mount(<Router><App/></Router>)
  expect(onWillMount).toHaveBeenCalledTimes(1)
})
