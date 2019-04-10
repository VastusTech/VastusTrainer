import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import TestHelper from "./vastuscomponents/logic/TestHelper";

export function store(initialState) {
    if (initialState) {
        return configureStore()(initialState);
    }
    else {
        return configureStore()({});
    }
}

export default () => {
    TestHelper.setTest();
    configure({
        adapter: new Adapter()
    });
}