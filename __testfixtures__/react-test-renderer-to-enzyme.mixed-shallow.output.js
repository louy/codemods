import React from 'react';
import { shallow, mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';

describe('test', () => {
  it('works with test renderer', () => {
    const Component = () => <span>test</span>;

    const wrapper = mount(<Component />);

    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('works with enzyme shallow', () => {
    const Component = () => <span>test</span>;

    const wrapper = shallow(<Component />);

    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});
