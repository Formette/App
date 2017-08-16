// Button.test.js
import React from 'react';
import Profile from '../containers/Profile';
import renderer from 'react-test-renderer';

test('Profile UI renders correctly', () => {
    const tree = renderer.create(
        <Profile/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
