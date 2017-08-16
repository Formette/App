// Button.test.js
import React from 'react';
import MyForms from '../containers/MyForms';
import renderer from 'react-test-renderer';

test('My Forms UI renders correctly', () => {
    const tree = renderer.create(
        <MyForms/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
