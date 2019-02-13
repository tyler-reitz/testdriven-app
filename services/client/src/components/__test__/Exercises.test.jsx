import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'

import AceEditor from 'react-ace'
jest.mock('react-ace')

import Exercises from '../Exercises'

it('Exercises renders properly when not authenticated', () => {
  const wrapper = shallow(<Exercises isAuthenticated={false} />)
  const element = wrapper.find('h5')
  expect(element.length).toBe(1)
  const alert = wrapper.find('.notification')
  expect(alert.length).toBe(1)
  const alertMessage = wrapper.find('.notification > span')
  expect(alertMessage.get(0).props.children).toContain(
    'Please log in to submit an exercise.'
  )
})

it('Exercises renders properly when authenticated', () => {
  const wrapper = shallow(<Exercises isAuthenticated={true} />)
  const heading = wrapper.find('h5')
  expect(heading.length).toBe(1)
  const alert = wrapper.find('.notifiction')
  expect(alert.length).toBe(0)
})

it('Exercises renders a snapshot properly', () => {
  const tree = renderer.create(<Exercises />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('Exercises will call componentWillMount when mounted', () => {
  const onWillMount = jest.fn()
  Exercises.prototype.componentWillMount = onWillMount
  const wrapper = mount(<Exercises />)
  expect(onWillMount).toHaveBeenCalledTimes(1)
})
