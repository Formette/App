// NewForm.test.js
//Utils
import './helpers/browser';
import './helpers/mock-localstorage';
import React from 'react';
import NewForm from '../containers/NewForm';
//import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';


describe('New Form', () => {
    it('UI renders correctly', () => {
        const component = shallow(<NewForm/>);
        component.setState({
            generateID: '51a12dc1bfb47a2f',
            name: "Newsletter",
            description: "A form for the newsletter",
            customEndpoint: "nl",
        });

        expect(component.state().generateID).toEqual("51a12dc1bfb47a2f");
        expect(component.state().name).toEqual("Newsletter");
        expect(component.state().description).toEqual("A form for the newsletter");
        expect(component.state().customEndpoint).toEqual("nl");
    });
});
