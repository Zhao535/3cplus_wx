import React, {Component} from 'react';
import {App} from "../../common";
import "../../assets/css/generalCoupon.scss";
import {Toast} from "antd-mobile";

class GeneralCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
        }

    }

    componentDidMount() {
        this.loadCoupons()
    }

    loadCoupons = () => {
        App.api(`/usr/coupon/all_coupons`, {couponQo: JSON.stringify({})}).then((res) => {
            let {content = []} = res;
            this.setState({
                coupons: content
            })
        })
    }
    saveGeneralCoupon = (id, index) => {
        App.api(`/usr/coupon/save`, {id: id}).then(() => {
            Toast.success("领取成功");
            let {coupons = []} = this.state;
            coupons[index].userCoupon = {id: 1};
            this.setState({coupons});
        })
    }

    render() {
        let {coupons = []} = this.state;

        return (
            <div className="general-coupon">
                {coupons.map((coupon, index) => {
                    let {rule = {}, status, payload = {}, duration, userCoupon = {}} = coupon;
                    let {values = []} = rule;
                    let {type} = payload;
                    return <li className="_coupon" key={index}>
                        <div className="coupon-left">
                            <div className="coupon-price">
                                <div className="sym">￥</div>
                                <div className="num">{values[0] / 100}</div>
                            </div>
                            <div className="coupon-p">
                                {rule.type === 1 && "每减"}
                                {rule.type === 2 && "满减"}
                                {rule.type === 3 && "直减"}
                            </div>
                        </div>
                        <div className="_kong">
                            <div className="kong"/>
                        </div>

                        <div className="coupon-right">
                            <div className="coupon-detail">
                                <div className="_data">
                                    {rule.type === 1 && `每${values[0] / 100}减${values[1] / 100}`}
                                    {rule.type === 2 && `满${values[0] / 100}减${values[1] / 100}`}
                                    {rule.type === 3 && `直减${values[0] / 100}`}
                                </div>
                                <div className="coupon-intro">
                                    <div className="coupon-type">{
                                        type === 1 ? "全场通用" : type === 2 ? "分类优惠券" : "商品优惠券"
                                    }</div>
                                    <div className="date">{duration}天</div>
                                </div>
                            </div>
                            <div className="_intro">

                                {!userCoupon.id ? <div className='use-btn' onClick={() => {
                                    this.saveGeneralCoupon(coupon.id, index);
                                }
                                }>立即领取</div> : <div className="used-btn">已领取</div>}

                                {status === 2 && <img src={require('../../assets/3cimages/coupon/coupon_used.png')}/>}
                                {status === 3 &&
                                <img src={require('../../assets/3cimages/coupon/coupon_expired.png')}/>}
                            </div>

                        </div>
                    </li>
                })}
            </div>
        );
    }
}

export default GeneralCoupon;