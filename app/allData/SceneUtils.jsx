import {App} from "../common";

let SceneUtils = (() => {

    let sceneList = (component, qo) => {
        qo = {pageSize: 5}
        App.api(`usr/sceneShopping/items`, {qo: JSON.stringify(qo)}).then((result) => {
            component.setState({scenes: result.content})
        })

    };

    let sceneTypes = (component) => {
        App.api(`usr/scene/items`).then((sceneTypes) => {
            component.setState({sceneTypes})
        });
    }

    return {sceneList, sceneTypes};

})();

export default SceneUtils;