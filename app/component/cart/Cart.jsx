import React from 'react';
import { App, U, Utils } from "../../common";
import { inject, observer } from "mobx-react";
import { Checkbox, Icon, Modal, Stepper, Toast } from 'antd-mobile';
import CartUtils from "./CartUtils";
import "../../assets/css/cart.scss"
import { ParamModal } from "../Comps";

const CheckboxItem = Checkbox.CheckboxItem;
const alert = Modal.alert;

@inject('carts')
@observer
export default class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            number: 0,
            cartIds: [],
            total: 0,
            checkEdit: false,
            show_modal: false,
            address: {},
            addresses: [],
        };
    }

    componentDidMount() {
        U.setWXTitle('我的购物车');
        this.loadCarts();
        Utils.addr.loadRegion();
    }

    loadCarts = () => {
        CartUtils.get().then((carts) => {
            this.props.carts.setCarts(carts);
            this.dealSecKill();
        });
        App.api('/usr/address/items').then((result) => {
            let address = result.find(add => add.isDefault === 1) || result[0] || {};
            this.setState({ address: address });
        });
    };

    dealSecKill = () => {
        let carts = this.props.carts.getCarts || [];
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
            this.setState({ realTimeSecKill: result.content })
        })
    }

    updateNum = (id, number) => {
        App.api('usr/cart/update_number', {
            id: id,
            num: number
        }).then(() => this.loadCarts());
    };

    remove = (ids) => {
        let length = ids.length;
        alert('', `确定要删除已选中的${length}件商品?`, [
            {
                text: '删除', onPress: () => App.api('/usr/cart/batch_remove', {
                    ids: JSON.stringify(ids),
                },
                ).then(() => {
                    Toast.success("删除成功", 1, null, false);
                    this.loadCarts();
                })
            }
        ]);
    };

    changeParam = (product, productSno, id, secKillId, options) => {
        Utils.common.renderReactDOM(<ParamModal visible={true} comp={this} product={product}
            defaultSno={productSno} isCart={true} id={id} secKillId={secKillId} options={options} />);
    };

    render() {
        let carts = this.props.carts.getCarts || [];

        let merchants = [];
        let { cartIds = [], checkEdit, address, realTimeSecKill = [] } = this.state;
        let { code = '', detail } = address;
        let codes = Utils.addr.getPCD(code);
        let total = 0;
        cartIds.map((id) => {
            let cart = carts.find(c => c.id === id) || {};
            let { num } = cart;
            let _specs = U.price.secSpec(cart, realTimeSecKill)
            let { price = 0 } = _specs;
            total += num * price;
        });

        //构建店铺数组
        carts.map((cart) => {
            let { merchant = {} } = cart;
            let find = merchants.filter(m => m.id === merchant.id) || [];
            {
                find.length === 0 && merchants.push(merchant)
            }
        });

        //数组去重
        let length = cartIds.length;
        let merchantIds = new Set();
        let checkedCarts = carts.filter(item => cartIds.indexOf(item.id) > -1) || [];

        checkedCarts.map((cart) => {
            let { merchant = {} } = cart;
            merchantIds.add(merchant.id);
        });

        let checkAllCarts = (length === carts.length);

        return <div className="cart-page">

            {merchants.length !== 0 && <div className='cart-header'>
                <div className='cart-header-1'>
                    <span>购物车</span>
                    {merchants.length !== 0 && <div className='btn' onClick={() => {
                        this.setState({
                            checkEdit: !checkEdit,
                            cartIds: [],
                            total: 0
                        });
                    }}>
                        {checkEdit ? "完成" : "管理"}
                    </div>}
                </div>
                <div className='cart-header-2'>
                    <span className='cart-count-info'>共有{carts.length}件宝贝</span>
                    {address.id && <React.Fragment>
                        <div className='addr-icon' />
                        <span className='buy-addr'>{codes}&nbsp;{detail}</span>
                    </React.Fragment>}

                </div>
            </div>}

            {merchants.length === 0 &&
                <div className='cart-empty' onClick={() => App.go(`/home`)}>
                    <div className='empty-icon' />
                    <p>3C家居</p>
                    <p>完美你的生活，高贵你的空间~</p>
                    <p className='go'>快去逛逛吧</p>
                </div>}

            {merchants.map((merchant, index) => {
                let _carts = carts.filter(c => (c.merchant || {}).id === merchant.id) || [];
                let checkAll = _carts.every(c => cartIds.indexOf(c.id) > -1);
                //店铺互斥
                let disabled = !checkEdit && merchantIds.size === 1 && !merchantIds.has(merchant.id);
                return <div className='cart' key={index}>

                    <div className='merchant'>
                        <CheckboxItem checked={checkAll}
                            key={index}
                            onChange={(e) => {
                                if (disabled) {
                                    cartIds = [];
                                }
                                let checked = e.target.checked;
                                _carts.map((cart) => {
                                    let id = cart.id;
                                    let index = cartIds.indexOf(id);
                                    if (checked) {
                                        if (index === -1) {
                                            cartIds.push(id);
                                        }
                                    } else {
                                        if (index > -1) {
                                            cartIds = U.array.remove(cartIds, index);
                                        }
                                    }
                                });
                                this.setState({
                                    cartIds
                                }, () => {
                                    this.loadCarts(carts);
                                });
                            }}>
                            <div className='icon-merchant' />
                            <div className='name'
                                onClick={() => App.go(`/merchant/${merchant.id}`)}>{merchant.name}</div>
                            <Icon type={'right'} />
                        </CheckboxItem>
                    </div>

                    {_carts.map((item, index) => {
                        let { product = {}, productSno, num, id, cartPayload = {} } = item;
                        let _specs = U.price.secSpec(item, realTimeSecKill);
                        let seckill = realTimeSecKill.find(item => item.productId === product.id)
                        let { price, params = [], imgs = [] } = _specs;
                        return <div className='product' key={index}>
                            <CheckboxItem checked={cartIds.indexOf(id) > -1} key={index}
                                onChange={(e) => {
                                    let checked = e.target.checked;
                                    if (disabled) {
                                        cartIds = [];
                                    }
                                    if (checked) {
                                        cartIds.push(id);
                                    } else {
                                        cartIds = U.array.remove(cartIds, cartIds.indexOf(id));
                                    }
                                    this.setState({
                                        cartIds
                                    }, () => {
                                        this.loadCarts(carts);
                                    });
                                }}>
                                <img src={imgs[0]} onClick={() => App.go(`/product/${product.id}/${0}`)} />
                                <div className='right'>
                                    <p>{product.name}</p>
                                    <div className='params'
                                        onClick={() => this.changeParam(product, productSno, id, cartPayload.id, { secKill:seckill })}>
                                        {params.map((item, index) => {
                                            let { label, value } = item;
                                            return <div className='param' key={index}>
                                                <div className='label'>{label}：</div>
                                                <div className='value'>{value}</div>
                                            </div>;
                                        })}
                                        <Icon type={'down'} />
                                    </div>
                                    <div className='down'>
                                        <div className='price'><em>￥</em>{U.price.cent2yuan(price)}</div>
                                        <div className='count'>
                                            <a className='product-step'>
                                                <Stepper
                                                    style={{ float: 'right', minWidth: '10vw' }}
                                                    showNumber
                                                    min={1}
                                                    value={num}
                                                    onChange={(e) => {
                                                        this.updateNum(id, e);
                                                    }}
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CheckboxItem>
                        </div>;
                    })}
                </div>;
            })}

            {merchants.length !== 0 && <div className={'down-menu'}>
                {checkEdit && <Checkbox checked={checkAllCarts} onChange={(e) => {

                    if (e.target.checked) {
                        let _cartIds = [];
                        carts.map((item) => {
                            _cartIds.push(item.id);
                        });
                        this.setState({ cartIds: _cartIds });
                    } else {
                        this.setState({ cartIds: [] });
                    }

                }}>全选</Checkbox>}
                {!checkEdit && <div className='total-amount'>
                    <div className='left'>
                        <span>合计：</span>
                        <div className='price'>
                            <em>￥</em>{U.price.cent2yuan(total)}
                        </div>
                    </div>
                    <div className='account-btn' onClick={() => {
                        if (cartIds.length === 0) {
                            Toast.fail("请选择商品");
                            return;
                        }
                        let ids = encodeURIComponent(encodeURIComponent(JSON.stringify(cartIds)));
                        App.go(`/trade/${ids}`);
                    }}>
                        结算{length > 0 && <span className='account-num' onClick={() => {

                        }}>({length}件)</span>}
                    </div>
                </div>}
                {checkEdit && <div className='delete-btn' onClick={() => {
                    this.remove(cartIds);
                }}>
                    删除
                </div>}
            </div>}


        </div>;
    }
}
