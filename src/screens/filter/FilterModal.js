import React from 'react';
import {Modal} from "semantic-ui-react";
import FilterScreen from "../../vastuscomponents/components/props/FilterScreen";

type Props = {
    open: boolean,
    onClose: () => void
};

const FilterModal = (props: Props) => (
    <Modal open={props.open} onClose={props.onClose} closeIcon>
        <FilterScreen/>
    </Modal>
);

export default FilterModal;
