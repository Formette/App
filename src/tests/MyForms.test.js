// MyForms.test.js
//Utils
import './helpers/browser';
import './helpers/mock-localstorage';
import React from 'react';
import {MyForms} from '../containers/MyForms';
import renderer from 'react-test-renderer';

describe('My Forms', () => {
    it('UI renders correctly', () => {
        const data = {
            loading: true,
        };
        const tree = renderer.create(
            <MyForms allFormsQuery={data}/>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

