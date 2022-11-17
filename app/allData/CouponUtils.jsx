import {App} from "../common";

let CouponUtils = (() => {
    let couponForUser = (status,component) => {
        App.api(`usr/coupon/user_coupons`,{status}).then((userCoupons) => {
            component.setState({userCoupons});
        })
    };
    return {couponForUser};
})();

export default CouponUtils;
