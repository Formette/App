// Button.test.js
import React from 'react';
import NewForm from '../containers/NewForm';
import renderer from 'react-test-renderer';

test('New Form UI renders correctly', () => {
    const tree = renderer.create(
        <NewForm/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
