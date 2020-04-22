import React from 'react'
import { shallow } from 'enzyme'

import Home from './index'

describe('pages/home', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper).toMatchSnapshot()
  })
})
