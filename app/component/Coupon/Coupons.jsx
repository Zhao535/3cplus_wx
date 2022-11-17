import React from 'react';
import {_DATA, App, U, Utils} from "../../common";
import {CommonTabs, CouponList} from '../Comps';
import "../../assets/css/coupon.scss";


export default class Coupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            userCoupons: [],
        };
    }

    componentDidMount() {
        U.setWXTitle('优惠券');
        this.loadData();
    }

    loadData = () => {
        let {status} = this.state;
        App.api(`usr/coupon/user_coupons`, {status: status}).then((result) => {
            this.setState({
                userCoupons: result
            })
        })
    };


    onChange = (index) => {
        this.setState({status: index}, this.loadData)
    }

    render() {
        let {userCoupons = []} = this.state
        return <div className='coupon-page'>
            <CommonTabs tabs={['未使用', '已使用', '已过期']} onChange={(index) => {
                this.onChange(index + 1);

            }}/>
            <div className="_coupons">
                {userCoupons.length > 0 && userCoupons.map((item, index) => {
                    let {coupon, id,status} = item;
                    let {rule = {}, payload = {}, duration} = coupon;
                    let {values = []} = rule;
                    let {type, category,product} = payload;
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
                                        type === 1 ? "全场通用" : type === 2 ? `仅限${category.name}类商品可用` : "商品优惠券"
                                    }</div>
                                    <div className="date">{duration}天</div>
                                </div>
                            </div>
                            <div className="_intro">
                                {status === 1 && <div className='use-btn' onClick={()=>{
                                    {type===1&&App.go('/home')}
                                    {type===2&&App.go(`/choose/${category.id}`)}
                                    {type===3&&App.go(`/product/${product.id}`)}
                                }}>立即使用</div>}
                                {status === 2 && <img src={require('../../assets/3cimages/coupon/coupon_used.png')}/>}
                                {status === 3 &&
                                <img src={require('../../assets/3cimages/coupon/coupon_expired.png')}/>}
                            </div>

                        </div>
                    </li>
                })}
            </div>

        </div>
    }
}
