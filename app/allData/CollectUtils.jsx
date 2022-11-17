import {App} from "../common";

let CollectUtils = (() => {
    let collectList = (component, qo) => {
        App.api(`usr/collect/items`, {qo: JSON.stringify(qo)}).then((res) => {
           if(qo.type===1){
               component.setState({products:res})
           }
            if(qo.type===2){
                component.setState({articles:res})
            }
            if(qo.type===3){
                component.setState({scenes:res})
            }
            if(qo.type===4){
                component.setState({merchants:res})
            }
        })
    };

    let collected = (type, fromId) => {
        if (!type || !fromId) {
            return false;
        }
        let isCollect = false;
        App.api(`usr/collect/item`, {type: type, fromId: fromId}).then((res) => {
            let {status} = res;
            isCollect = status === 1;
        })
        return isCollect;
    };
    return {collectList, collected};
})();

export default CollectUtils;