import App from '../../common/App.jsx'
import {Toast} from "antd-mobile";

let CartUtils = {
    get: () => {
        return App.api('usr/cart/items').then((carts) => {
            return carts;
        });
    },


    add: (cart) => {
        return App.api('usr/cart/save', {cart: JSON.stringify(cart)}).then(() => {
            Toast.success('添加成功，在购物车等亲~')
        });
    }

};

export default CartUtils;
