import {App} from "../common";

let TemplateUtils = (() => {

    let CategoryList = (component,qo) => {
        App.api("usr/template/items", {qo: JSON.stringify(qo)}).then((result) => {
            component.setState({templates: result.content})

        })
    };
    return {CategoryList};

})();

export default TemplateUtils;