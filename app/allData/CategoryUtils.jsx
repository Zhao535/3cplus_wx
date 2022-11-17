import {App, U} from "../common";
import {Loading} from "../component/Comps";
import React from "react";

let CategoryUtils = (() => {

    let categoryList = (component, qo) => {
        App.api("usr/category/items", {qo: JSON.stringify(qo)}).then((result) => {
            component.setState({categories: result.content})

        })
    };

    let choiceCategory = (component) => {
        App.api(`usr/category/choiceCategory`).then((res = []) => {
            component.setState({choiceCategories: res})
        })
    };

    return {categoryList, choiceCategory};

})();

export default CategoryUtils;