import React from 'react';
import { create as createRenderer } from 'react-test-renderer';

describe('test', () => {
  it('works', () => {
    const Component = () => <span>test</span>;

    const wrapper = createRenderer(<Component />);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
