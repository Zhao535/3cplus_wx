import React from 'react';
import {App, U, Utils} from "../../common";
import {Toast} from "antd-mobile";
import copy from 'copy-to-clipboard';
import "../../assets/css/trade-detail.scss"
import {CommonTimer} from "../Comps";


export default class TradeDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            trade: {},
            regions: {},
        };
    }

    componentDidMount() {
        Utils.addr.loadRegion().then((regions) => {
            this.setState({regions});
        });
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        App.api(`/usr/trade/trade`, {id}).then((trade) => {
            this.setState({trade});
        });

    };

    pay = (id) => {
        let billId = 0;
        App.go(`/pay/${id}/${billId}`);
    };

    updateType = (id, type) => {
        App.api('/usr/trade/update_type', {id: id, type: type}).then(() => {
            if (type === 5) {
                Toast.success("取消成功", 1, null, false);
            }
            if (type === 4) {
                Toast.success("确认收货成功", 1, null, false);
            }
            if (type === 6) {
                Toast.success("评论成功", 1, null, false);
            }
            this.loadData();
        });

    };


    render() {
        let {trade} = this.state;
        let {
            id,
            type,
            totalPrice,
            address = {},
            tradeItems = [],
            createdAt,
            orderNumber,
            couponAmount = 0,
            totalAmount,
            payment = 0,
        } = trade;
        let {code, detail, mobile = '', name} = address;
        let curr = new Date().getTime();
        let codes = Utils.addr.getPCD(code);
        let strMobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
        return <div className='trade-detail-page'>
            <div className='top'>
                {type === 1 && <div className='wait-pay'>
                    <div className='icon icon-wait'/>
                    等待付款
                </div>}
                {type === 2 && <div className='wait-send'>
                    <div className='icon icon-payed'/>
                    等待发货
                </div>}
                {type === 3 && <div className='sent'>
                    <div className='icon icon-send'/>
                    卖家已发货
                </div>}
                {type === 4 && <div className='comment'>
                    <div className='icon icon-comment'/>
                    等待评论
                </div>}
                {type === 5 && <div className='close'>
                    <div className='icon icon-close'/>
                    订单已取消
                </div>}
                {type === 6 && <div className='all-ok'>
                    <div className='icon icon-ok'/>
                    交易成功
                </div>}
                {type === 1 && <div className='line-second'>
                    <span>需付款：￥{U.price.cent2yuan(totalAmount)}&nbsp;&nbsp;&nbsp;</span>
                    <span>剩余时间：<CommonTimer endAt={createdAt + 3600 / 2 * 1000}/></span>
                </div>}

                {(type === 2 || type === 3 || type === 4) && <div className='line-second'>
                    <span>剩余时间：<CommonTimer endAt={curr + 3600 * 24 * 10 * 1000}/></span>
                </div>}
            </div>


            <div className='address-bar'>
                {(type === 3 || type === 4 || type === 6) && <div className='express'>
                    <div className='express-icon'/>
                    <span className='name'>顺丰快递</span>
                    <div className='express-detail'>
                        <span className='express-num'>快递单号：903389370795</span>
                    </div>
                </div>}

                <div className='user-info'>
                    <div className='addr-icon'/>
                    <span className='name'>{name}</span>
                    <span className='mobile'>{strMobile}</span>
                </div>
                <div className='addr-detail'>
                    <span>地址：{codes}&nbsp;{detail}</span>
                </div>
            </div>

            <div className='cart-list'>
                <div className='product-bar-title'><span>商品清单</span></div>
                {tradeItems.map((cart, index) => {
                    let {productSno, num, product = {}} = cart;
                    let {specs = [], name} = product;
                    let _specs = specs.filter(spec => spec.sno === productSno) || {};
                    return <div className='product-detail' key={index}>
                        {_specs.map((item, index) => {
                            let {price, linePrice, imgs = [], params = []} = item;
                            return <div className='inner' key={index}>
                                <img src={imgs[0]}/>
                                <div className='right-info'>
                                    <div className='name'>{name}</div>
                                    {params.map((item, index) => {
                                        let {label, value} = item;
                                        return <span className='param' key={index}>
                                            {/*<span className='label'>{label}：</span>*/}
                                            <span className='value'>{value}</span>
                                        </span>;
                                    })}
                                    <span className='number'>X{num}</span>
                                    <div className='price-info'>
                                        <span className='line-price'>
                                            <em>￥</em>{U.price.cent2yuan(linePrice, false)}
                                        </span>
                                        <span className='price'><em>￥</em>{U.price.cent2yuan(price, false)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        })}
                    </div>
                })}
                <div className='service-bar'>
                    <div className='service'/>
                    <span>联系客服</span>
                </div>
            </div>

            <div className='cutting'/>

            <div className='trade-info'>
                <ul>
                    <li>订单编号：{orderNumber}
                        <div className='copy-btn' onClick={() => {
                            copy(orderNumber);
                            Toast.success('复制成功', 1, null, false)
                        }}>复制
                        </div>
                    </li>

                    <li>下单时间：{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')}</li>
                </ul>
                <ul>
                    {payment === 1 && <li>支付方式：微信支付</li>}
                    {payment === 2 && <li>支付方式：线下支付</li>}
                    <li>配送方式：送货上门</li>
                </ul>
            </div>

            <div className='cutting'/>

            <div className='total-detail'>
                <div className='amount'>
                    <p>商品金额：</p>
                    <i><em>￥</em>{totalAmount / 100}</i>
                </div>
                <div className='amount'>
                    <p>运费：</p>
                    <i><em>+￥</em>{(0).toFixed(2)}</i>
                </div>
                <div className='amount'>
                    <p>优惠券：</p>
                    <i><em>-￥</em>{couponAmount / 100}</i>
                </div>
                <div className='total-amount'>
                    <span>实付款：</span> <i><em>￥</em>{(totalPrice - couponAmount) / 100}</i>
                </div>
            </div>

            <div className='cutting'/>

            {/*   // NO_PAY(1),  //待支付
            // NO_SEND(2), //待发货
            // NO_GET(3), //待收货
            // NO_COMMENT(4), //待评论
            // CALL_OFF_TRADE(5),//订单取消
            // FINISHED(6);//已完成*/}

            <div className='bottom-btn'>
                {(type === 1 || type === 2) && <span className='cancel-trade' onClick={() => {
                    this.updateType(id, 5);
                }}>取消订单</span>}

                {type === 1 && <span className='pay' onClick={() => {
                    this.pay(id);
                }}>去支付</span>}

                {(type === 2 || type === 3) && <span className='go-service' onClick={() => {
                }}>联系客服</span>}

                {type === 3 && <span className='get-ok' onClick={() => {
                    this.updateType(id, 4)
                }}>确认收货</span>}
                {type === 4 && <span className='go-comment' onClick={() => {
                    this.updateType(id, 6)
                }}>去评论</span>}
                {(type === 4 || type === 5 || type === 6) && <span className='reset' onClick={() => {

                }}>再下一单</span>}
            </div>
        </div>

    }
}
