import React from 'react';
import renderer from 'react-test-renderer';

describe('test', () => {
  it('works', () => {
    const Component = () => <span>test</span>;

    const wrapper = renderer.create(<Component />);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
