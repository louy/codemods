import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';

describe('test', () => {
  it('works with test renderer', () => {
    const Component = () => <span>test</span>;

    const wrapper = renderer.create(<Component />);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('works with enzyme shallow', () => {
    const Component = () => <span>test</span>;

    const wrapper = shallow(<Component />);

    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});
