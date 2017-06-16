import React from 'react';
import { create } from 'react-test-renderer';

describe('test', () => {
  it('works', () => {
    const Component = () => <span>test</span>;

    const wrapper = create(<Component />);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
