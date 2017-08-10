// Button.test.js
import React from 'react';
import Button from '../components/atoms/Button';
import renderer from 'react-test-renderer';

test('Button changes the state when hovered', () => {
    const component = renderer.create(
        <Button type="button" color="#000">Hello</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});