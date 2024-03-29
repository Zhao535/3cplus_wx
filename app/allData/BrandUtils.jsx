import {App} from "../common";

let BrandUtils = (() => {
    // 其版本修改
    
    let merchantBrandList = (component,id) => {
        App.api("usr/product/merchantBrands", {merchantId:id}).then((result) => {
            component.setState({merchantBrands: result})

        })
    };

    let allBrands =(component)=>{
        App.api("usr/product/allBrands").then((result) => {
            component.setState({brands: result})

        })
    };

    return {merchantBrandList,allBrands};

})();

export default BrandUtils;