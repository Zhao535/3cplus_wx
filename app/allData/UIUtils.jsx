import { App } from "../common";

let UIUtils = (() => {

    let findUI = (component, type) => {

        console.log(type,"tttttttt")
        App.api(`usr/ui/item`, {type: type}).then((ui) => {
            console.log(ui);
            component.setState({ui},()=>component.dealSecKill());
        })
    };
    return { findUI };
})();

export default UIUtils;