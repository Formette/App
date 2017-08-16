// Button.test.js
import React from 'react';
import FormDetails from '../containers/FormDetails';
import renderer from 'react-test-renderer';

test('Form Details UI renders correctly', () => {
    const tree = renderer.create(
        <FormDetails/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
