import React from 'react';
import { Checkbox, Icon, InputItem, Toast } from 'antd-mobile'
import { inject, observer } from "mobx-react";
import { App, U, Utils } from "../../common";
import "../../assets/css/trade.scss"
import CartUtils from "../cart/CartUtils";
import AddressUtils from "../../allData/AddressUtils";
import { CouponModal, UserCouponsModal } from "../Comps";

const CheckboxItem = Checkbox.CheckboxItem;

@inject('carts')
@observer
export default class Trade extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ids: this.props.match.params.ids,
            secKillId: this.props.match.params.secKillId,
            carts: [],
            total: 0,
            payMethod: 0,
            show_modal: false,
            address: {},
            addresses: [],
            userCoupon: {},
            userCoupons: [],
            couponAmount: 0,
            secKill: {}
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { ids, secKillId } = this.state;

        {
            secKillId > 0 && App.api(`usr/secKill/secKill`, { id: secKillId }).then((res) => {
                this.setState({
                    secKill: res
                })
            })
        }

        let cartIds = JSON.parse(decodeURIComponent(decodeURIComponent(ids)));
        App.api(`/usr/cart/cart_list`, { ids: JSON.stringify(cartIds) }).then((carts) => {
            this.setState({ carts: carts }, () => this.dealSecKill());

        });

        App.api('/usr/address/items').then((result) => {
            let address = result.find(add => add.isDefault === 1) || {};
            this.setState({ address: address, addresses: result });
        });

        App.api(`/usr/coupon/user_coupons`, { status: 1 }).then((result) => {
            this.setState({
                userCoupons: result
            })
        })


    };
    dealSecKill = () => {
        let { carts = [] } = this.state;
        let secKillIds = []
        if (carts.length > 0) {
            carts.map((cart, index) => {
                let { cartPayload = {} } = cart
                let { type, id } = cartPayload;
                if (type === 2) {
                    secKillIds.push(id)
                }
            })
        }
        this.setState({ secKillIds }, () => this.loadSecKill())
    }

    loadSecKill = () => {
        let { secKillIds = [] } = this.state;
        App.api(`usr/secKill/secKills`, {
            secKillQo: JSON.stringify({
                ids: secKillIds,
                pageNumber: 1,
                pageSize: 100,
            })
        }).then((result) => {
            this.setState({ realTimeSecKill: result.content }, () => this.totalAmount())
        })
    }

    totalAmount = () => {
        let { carts = [], secKill, realTimeSecKill = [] } = this.state;
        let TradePayload = [];
        let total = 0;
        carts.map((cart, index) => {
            let { num } = cart;
            let _specs = U.price.secSpec(cart, realTimeSecKill) || {}
            let { price = 0 } = _specs;
            total = num * price + total
        });
        realTimeSecKill.map((secKill, index) => {
            let { id, secKillSpec = [] } = secKill;
            if (Object.keys(secKillSpec).length > 0) {
                let { price } = secKillSpec[0];
                TradePayload.push({ id: id, realPrice: price })
            }
        })
        this.setState({ total: total, TradePayload });

    };


    saveTrade = (userCoupon) => {
        let { carts = [], address = {}, payMethod, TradePayload = [] } = this.state;
        if (payMethod === 0) {
            Toast.fail('请选择支付方式');
            return;
        }

        if (address.id == null) {
            Toast.fail('请添加收货地址');
            return;
        }
        App.api('/usr/trade/save', {
            trade: JSON.stringify({
                tradeItems: [...carts],
                address: address,
                payment: payMethod,
                tradePayloads: TradePayload,
            }),
            userCouponId: userCoupon.id || 0
        }).then((result) => {
            Toast.success('下单成功', 1, null, false);
            App.replace(`/trade-detail/${result}`);
        });

    };
    updateUserCouponStatus = () => {
        let { userCoupon = {} } = this.state;
        let { id, status, coupon = {} } = userCoupon;
        let { duration, getAt } = coupon;
        App.api(`/usr/coupon/update_status`, {
            id: id,
            status: status + 1
        }).then(() => {
            this.setState({
                userCoupon: userCoupon
            })
        })
    }


    syncItem = (show_modal, address) => {
        this.setState({
            show_modal, address
        });
    };

    syncUserCoupon = (userCoupon, couponAmount) => {
        this.setState({
            userCoupon, couponAmount
        });
    };

    couponModal = (carts) => {
        Utils.common.renderReactDOM(<UserCouponsModal carts={carts} syncUserCoupon={this.syncUserCoupon} />)
    }

    render() {
        let {
            carts = [],
            total,
            payMethod,
            address,
            addresses = [],
            show_modal,
            userCoupon = {},
            couponAmount,
            userCoupons = [],
            secKill,
            realTimeSecKill = []
        } = this.state;
        let { coupon = {} } = userCoupon;
        let { rule = {} } = coupon;
        let { type = '', values = [] } = rule;
        let { name, id, code = '', detail, mobile = '' } = address;
        let codes = Utils.addr.getPCD(code);
        let _cart = carts.find((a) => a.product.status === 1) || {};
        let strMobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
        return <div className='trade-page'>
            {!id && <div className='user-location-none' onClick={() => App.go('/user-location')}>
                <div className='create-location'>
                    +添加收货地址
                </div>
                <div className='divider' />
            </div>}

            {id && <div className='addr-bar' onClick={() => {
                show_modal = true;
                AddressUtils.addressModal(show_modal, addresses, this.syncItem);
            }}>
                <div className='user-info'>
                    <span className='name'>{name}</span>
                    <span className='mobile'>{strMobile}</span>
                </div>
                <div className='addr-detail'>
                    <span>{codes}&nbsp;{detail}</span>
                </div>
                <Icon type='right' />
            </div>}

            <div className='cart-list'>
                {secKill && carts.map((cart, index) => {
                    let { num, product = {} } = cart;
                    let _spe = U.price.secSpec(cart, realTimeSecKill);
                    let { price = 0, linePrice, imgs = [], params = [] } = _spe;
                    return <div className='product-detail' key={index}>
                        <div className='inner'>
                            <img src={imgs[0]} />
                            <div className='right-info'>
                                <div className='name'>{product.name}</div>
                                {params.map((item, index) => {
                                    let { label, value } = item;
                                    return <span className='param' key={index}>
                                        <span className='label'>{label}：</span>
                                        <span className='value'>{value}</span>
                                    </span>;
                                })}
                                <span className='number'>x{num}</span>
                                <div className='price-info'>
                                    <span className='line-price'>
                                        <em>￥</em>{U.price.cent2yuan(linePrice, false)}
                                    </span>
                                    <span className='price'><em>￥</em>{U.price.cent2yuan(price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                })}


                {!secKill && carts.map((cart, index) => {
                    let { productSno, num, product = {} } = cart;
                    let { specs = [], title } = product;
                    let _specs = specs.filter(spec => spec.sno === productSno) || {};
                    return <div className='product-detail' key={index}>
                        {_specs.map((item, index) => {
                            let { price, linePrice, imgs = [], params = [] } = item;
                            return <div className='inner' key={index}>
                                <img src={imgs[0]} />
                                <div className='right-info'>
                                    <div className='name'>{product.name}</div>
                                    {params.map((item, index) => {
                                        let { label, value } = item;
                                        return <span className='param' key={index}>
                                            <span className='label'>{label}：</span>
                                            <span className='value'>{value}</span>
                                        </span>;
                                    })}
                                    <span className='number'>x{num}</span>
                                    <div className='price-info'>
                                        <span className='line-price'>
                                            <em>￥</em>{linePrice}
                                        </span>
                                        <span className='price'><em>￥</em>{U.price.cent2yuan(price)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        })}
                    </div>
                })}
            </div>

            <div className='delivery-method'>
                <span className='label'>配送方式</span>
                <span className='value'>送货上门</span>
            </div>
            <div className='note'>
                <span className='label'>订单备注</span>
                <InputItem type="text" placeholder="选填，请与卖家协商一致" onChange={(value) => {
                    this.setState({
                        mark: value
                    });
                }} />
            </div>

            <div className='coupon' onClick={() => {
                userCoupons.length === 0 ? '' : this.couponModal(carts);
            }}>
                <div className='test' />
                <span className='label'>优惠券</span>
                {userCoupons.length === 0 ? <span className='value'>暂无可用优惠券</span> : <React.Fragment>
                    {userCoupon.id ? <span className='value'>
                        {type === 1 && `满${values[0] / 100}减${values[1] / 100}`}
                        {type === 2 && `每${values[0] / 100}减${values[1] / 100}`}
                        {type === 3 && `直减${values[0] / 100}`}&nbsp;&nbsp;</span> :
                        <span className='value'>选择&nbsp;&nbsp;</span>}
                </React.Fragment>}

            </div>

            <div className='total-detail'>
                <div className='amount'>
                    <p>商品金额</p>
                    <i><em>￥</em>{U.price.cent2yuan(total)}</i>
                </div>
                <div className='amount'>
                    <p>优惠券</p>
                    <i><em>-￥</em>{couponAmount}</i>
                </div>
                <div className='amount'>
                    <p>运费</p>
                    <i><em>+￥</em>{0}</i>
                </div>
                <div className='total-amount'>
                    <span>合计</span>
                    <i><em>￥</em>{(U.price.cent2yuan(total) - couponAmount) < 0 ? 0 : (U.price.cent2yuan(total) - couponAmount)}
                    </i>
                </div>
            </div>

            <div className='pay-method'>
                <div className='pay'>
                    <div className='icon-wechat' />
                    <span className='span-word'>微信支付</span>
                    <Checkbox checked={payMethod === 1} onChange={() => {
                        if (payMethod === 1) {
                            this.setState({ payMethod: 0 });
                        } else {
                            this.setState({ payMethod: 1 });
                        }
                    }} />
                </div>

                <div className='pay'>
                    <div className='icon-out-line' />
                    <span className='span-word'>线下支付</span>
                    <Checkbox checked={payMethod === 2} onChange={() => {
                        if (payMethod === 2) {
                            this.setState({ payMethod: 0 });
                        } else {
                            this.setState({ payMethod: 2 });
                        }
                    }} />
                </div>
            </div>

            <div className='down-menu'>
                <div className='left'>
                    实付金额：
                    <i><em>￥</em>{(U.price.cent2yuan(total) - couponAmount) < 0 ? 0 : (U.price.cent2yuan(total) - couponAmount)}
                    </i>

                </div>
                <div className='right' onClick={() => {
                    this.saveTrade(userCoupon);
                    CartUtils.get().then((carts) => {
                        this.props.carts.setCarts(carts);
                    });
                    if (userCoupon.id) {
                        this.updateUserCouponStatus();
                    }
                }}>提交订单
                </div>
            </div>

        </div>

    }
}