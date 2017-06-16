import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('test', () => {
  it('works', () => {
    const Component = () => <span>test</span>;

    const wrapper = mount(<Component />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
