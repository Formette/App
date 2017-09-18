// FormDetails.test.js
//Utils
import './helpers/browser';
import './helpers/mock-localstorage';
import React from 'react';
import {FormDetails} from '../containers/FormDetails';
import { mount } from 'enzyme';

describe('Form Details', () => {
    it.skip('UI renders correctly', () => {
        const url = {
            params: {
                id: "cj6e1w3rd0loh0148839kzl2q"
            }
        };
        const tree = mount(
            <FormDetails match={url} formDataQuery={[]}/>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});