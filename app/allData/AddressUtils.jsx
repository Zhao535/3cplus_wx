import {Utils} from "../common";
import React from 'react';
import {AddressComps} from "../component/Comps"

let AddressUtils = (() => {

    let addressModal = (show_modal, addresses, syncItem) => {
        Utils.common.renderReactDOM(<AddressComps show_modal={show_modal} addresses={addresses} syncItem={syncItem}/>);
    };


    return {addressModal,};

})();

export default AddressUtils;