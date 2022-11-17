import {App} from "../common";

let MerchantUtils = (() => {

    let CategoryList = (component,qo) => {
        App.api("usr/merchant/items", {qo: JSON.stringify(qo)}).then((result) => {
            component.setState({merchant: result.content})

        })
    };
    return {CategoryList};

})();

export default MerchantUtils;