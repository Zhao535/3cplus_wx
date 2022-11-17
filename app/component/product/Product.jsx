import React from 'react';
import '../../assets/css/product.scss';
import { App, CTYPE, U, Utils } from "../../common";
import { Icon } from "antd";
import { CouponModal, ParamModal, CommonTabs, CommonTimer, Loading } from "../Comps";
import { Toast } from "antd-mobile";
import Login from "../login/Login";

export default class Product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id) || 0,
            product: {},
            currSpec: {},
            merchant: {},
            specMap: {},
            popSpecsDrawer: false,
            showOverLay: false,
            onPickSpec: {},
            favored: false,
            buyNum: 1,
            label1: '',
            label2: '',
            secKillId: parseInt(this.props.match.params.secKillId) || 0,
            secKill: {},
            selectSecKillSpec: {},
            selectKillNum: 1,
            tabIndex: 0
        }
            ;
    }

    componentDidMount() {
        this.loadData();
        this.loadFavored();
        this.loadCoupons();

    }


    loadData = () => {
        let { id, secKillId } = this.state;
        App.api(`usr/product/item`, { id: id }).then((product) => {
            this.setState({
                product,
            }, () => {
                if (secKillId > 0) {
                    App.api(`usr/secKill/secKill`, { id: secKillId }).then((res) => {
                        if (Object.keys(res).length > 0) {
                            this.setState({
                                secKill: res
                            }, () => {
                                this.changeParam(product, false)
                            })
                        } else {
                            App.api(`usr/secKill/secKill_by_product_id`, { id }).then((res) => {
                                this.setState({
                                    secKill: res,
                                }, () => {
                                    this.changeParam(product, false)
                                })
                            })
                        }

                    });
                    this.initTimer();
                } else {
                    App.api(`usr/secKill/secKill_by_product_id`, { id }).then((res) => {
                        this.setState({
                            secKill: res,
                        })
                    })
                    this.initTimer();
                    this.changeParam(product, false)
                }
            })
        });

    }

    initTimer = () => {

        window.clearInterval(this.timerId);
        this.timerId = setInterval(() => {
            this.setState({ currT: new Date().getTime() })
        }, 1000);
    };

    loadFavored = () => {
        let { id } = this.state;
        if (Utils.token()) {
            App.api(`usr/collect/isCollect`, { type: 1, fromId: id }).then((favored) => {
                this.setState({ favored })
            })
        }

    }

    doShowDrawer = (popSpecsDrawer, showOverLay) => {
        this.setState({
            popSpecsDrawer, showOverLay
        })
    };

    goMerchant = (merchantId) => {
        App.go(`/merchant/${merchantId}`)
    };

    toCollect = () => {
        let { id } = this.state;
        if (Utils.token()) {
            let collect = { type: 1, fromId: id };
            App.api(`usr/collect/save`, { collect: JSON.stringify(collect) }).then(() => {
                this.loadFavored();
            });
        } else {
            App.go(`/login`)
        }

    }

    changeParam = (product, visible, action) => {
        let { secKill = {} } = this.state;
        Utils.common.renderReactDOM(<ParamModal visible={visible} comp={this} product={product}
            action={action} setCurrSpec={this.setCurrSpec} options={{ secKill }}
        />)
    };
    changeSecKillParam = (product, visible, action, secKillId) => {
        let { secKill = {} } = this.state;
        Utils.common.renderReactDOM(<ParamModal secKillId={secKillId} visible={visible} comp={this} product={product}
            action={action} setCurrSpec={this.setCurrSpec} loadData={this.loadData} options={{ secKill }}
        />)
    };

    couponModal = (visible, coupons, id) => {
        Utils.common.renderReactDOM(<CouponModal visible={visible} coupons={coupons} id={id} />)
    }

    // showCouponsModal= (carts, syncUserCoupon) => {
    //     Utils.common.renderReactDOM(<UserCouponsModal carts={carts} syncUserCoupon={syncUserCoupon}/>);
    // }

    loadCoupons = () => {
        let { id } = this.state;
        App.api(`/usr/coupon/coupons`, { productId: id }).then((result) => {
            this.setState({
                coupons: result
            });
        });
        if (Utils.token()) {
            App.api(`/usr/coupon/user_coupons`, { status: 1 }).then((result) => {
                this.setState({
                    userCoupons: result
                });
            });
        }
    };


    showModal = (visible) => {
        this.setState({ visible });
    };

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    setCurrSpec = (currSpec) => {
        // let { secKill } = this.state;
        // if (Object.keys(secKill).length > 0) {

        //     let selectSecKillSpec = secKill.secKillSpec.find(value => value.sno === currSpec.sno);

        //     this.setState({
        //         selectSecKillSpec
        //     })

        // }

        this.setState({ currSpec });

    };
    loadSecKillNum = () => {
        let { secKillId, currSpec } = this.state;
        App.api(`usr/secKill/select_secKill_stock`, { id: secKillId, sno: currSpec.sno }).then((res) => {
            this.setState({ selectKillNum: res })
        })
    };

    render() {
        let {
            favored = false,
            product,
            label1,
            label2,
            popSpecsDrawer,
            currSpec = {},
            showOverLay,
            onPickSpec,
            buyNum = 0,
            coupons = [],
            secKill = {},
            // selectSecKillSpec,
            selectKillNum,
            currT,
            tabIndex,
            secKillId, } = this.state;
        let { endAt = 0, secKillSpec = [] } = secKill;
        let { specs = [], name = '', id, merchant = {} } = product;
        let { logo, location = {} } = merchant;
        let { poiaddress, poiname } = location;
        let img = '';
        let _price;
        if (Object.keys(onPickSpec).length <= 0) {
            if (specs.length > 0) {
                onPickSpec = specs[0];
            }
        }
        let { imgs = [], price, params = [] } = onPickSpec;
        img = imgs[0];
        _price = price;
        if (Object.keys(onPickSpec).length > 0) {
            label1 = params[0].value;
            if (params[1]) {
                label2 = params[1].value;
            }
        }

        if (endAt > 0 && (endAt === currT || endAt < currT)) {
            clearInterval(this.timerId);
            Toast.info("活动结束")
            App.go(`/home`)
        }
        if (!id) {
            return <Loading />
        }
        const WITHSEC = Object.keys(secKill).length > 0;
        return <div className='product-page'>
            <div className='product-img'>
                <img src={img} />
            </div>
            <div className='product-detail'>
                {WITHSEC &&

                    <div className="seckill-buy">
                        <div className="secKill-buy-left">
                            <div className="seckill">
                                <div className="seckll-second">
                                    <em>￥</em>{secKillSpec.length > 0 && <span>{U.price.cent2yuan(secKillSpec[0].price)}</span>}
                                </div>

                                <div className="orign-price">￥ {U.price.cent2yuan(_price)}</div>

                            </div>
                            <div className='quantity-stock'>
                                <div className='product-quantity'>234人购买</div>
                                {secKillSpec.length > 0 && <div className='product-stock'>剩余库存：{secKillSpec[0].num}</div>}
                            </div>
                        </div>
                        <div className="secKill-buy-right">
                            <div className="secKill-title">
                                距活动结束
                        </div>
                            <div className="secKill-time">
                                {currT === endAt || endAt < currT &&
                                    <div>结束</div>
                                }
                                {currT !== endAt && currT < endAt && < div style={{ display: "flex" }}>
                                    <CommonTimer endAt={endAt} />
                                </div>

                                }
                            </div>
                        </div>

                    </div>}
                {!WITHSEC && <div className="product-detail-info">

                    <div className='product-price'>
                        <em>￥</em><span>{U.price.cent2yuan(_price)}</span></div>
                    <div className='quantity-stock'>
                        <div className='product-quantity'>234人购买</div>
                        <div className='product-stock'>{U.formatNumber.stock(20012)}</div>
                    </div>
                    <div className='product-name'>
                        {name}
                    </div>


                </div>}
                <div className='discount-ticket' onClick={() => {
                    this.couponModal(true, coupons, product.id)
                }}>
                    <ul className='tickets'>
                        <li className='ticket'>
                            满300减50
                        </li>
                        <li className='ticket'>
                            满300减50
                        </li>
                        <li className='ticket'>
                            满1300减50
                        </li>
                    </ul>
                    <div className='receive-button'>
                        领取
                    </div>
                </div>
            </div>
            <div className='product-merchant'>
                <img className='merchant-logo' src={logo} />
                <div className='merchant-detail'>
                    <div className='merchant-name'>{merchant.name}</div>
                    <div className='merchant-location'>
                        <Icon type={'environment'} />{poiaddress}{poiname}
                    </div>
                </div>
                <div className='merchant-button' onClick={() => {
                    this.goMerchant(merchant.id)
                }}>
                    进店逛逛
                </div>
            </div>
            <ul className={'selection-bar'}>
                <li className='selection'>
                    <div className='select-name'>选择</div>
                    <div className='select-right' onClick={() => {
                        this.changeParam(product, true)
                    }}>
                        <div
                            className='spec'>{label1}{label2 && label2}</div>
                        <img className="selection-more" style={{ width: '20px', height: '20px' }}
                            src={require('../../assets/3cimages/icon/121.png')} />
                    </div>
                </li>
                <li className='selection'>
                    <div className='select-name'>运费</div>
                    <div className='select-right'>
                        <div className='spec'>门店自提</div>
                        <img className="selection-more" style={{ width: '20px', height: '20px' }}
                            src={require('../../assets/3cimages/icon/121.png')} />
                    </div>
                </li>
                <li className='selection'>
                    <div className='select-name'>参数</div>
                    <div className='select-right'>
                        <div className='spec'>产地广东规格国标</div>
                        <img className="selection-more" style={{ width: '20px', height: '20px' }}
                            src={require('../../assets/3cimages/icon/121.png')} />
                    </div>
                </li>
                <li className='selection'>
                    <div className='select-name'>质保</div>
                    <div className='select-right'>
                        <div className='spec'>7天无理由退货</div>
                        <img className="selection-more" style={{ width: '20px', height: '20px' }}
                            src={require('../../assets/3cimages/icon/121.png')} />
                    </div>
                </li>
            </ul>
            <div className='product-tab'>

                <CommonTabs tabs={['商品详情', '评价（23）']} onChange={(e) => {
                    this.setState({ tabIndex: e })
                }} />
                {tabIndex === 0 &&
                    imgs.map((img, index) => {
                        return <div key={index} className="product-detail">
                            <img src={img} />
                        </div>
                    })
                }
                {tabIndex === 1 && <div className="comment">
                </div>}
            </div>
            <div className='bottom-bar'>
                <div className="bottom-bar-left">
                    <img className='bottom-img' src={require('../../assets/3cimages/icon/shop_icon@2x副本.png')} />
                    <img className='bottom-img'
                        src={require('../../assets/3cimages/icon/order-icon/39aae94e-006f-496f-92a5-03dadf585369副本.png')} />
                    {favored ?
                        <img className='bottom-img' src={require('../../assets/3cimages/icon/favored.png')}
                            onClick={() => {
                                this.toCollect()
                            }} /> :
                        <img className='bottom-img' src={require('../../assets/3cimages/icon/favor.png')}
                            onClick={() => {
                                this.toCollect()
                            }} />}
                </div>
                <div className="bottom-bar-right">
                    <div className='shopping-cart' onClick={() => {
                        if (secKillId > 0) {
                            this.setState({ product });
                            this.loadSecKillNum();
                            if (selectKillNum > 0) {
                                this.changeSecKillParam(product, true, 'cart', secKillId)
                                selectKillNum = selectKillNum - 1;
                                this.setState({ selectKillNum })
                            } else {
                                Toast.success("已抢购完")
                                App.go(`/home`)
                            }

                        } else {
                            this.changeParam(product, true, 'cart')

                        }
                    }}>加入购物袋
                    </div>
                    <div className='buy-now' onClick={() => {
                        if (secKillId > 0) {
                            this.setState({ product });
                            this.loadSecKillNum();
                            if (selectKillNum > 0) {
                                this.changeSecKillParam(product, true, 'order', secKillId)
                                selectKillNum = selectKillNum - 1;
                                this.setState({ selectKillNum })
                            } else {
                                Toast.success("已抢购完")
                                App.go(`/home`)
                            }

                        } else {
                            this.changeParam(product, true, 'order')

                        }
                    }}>立即购买
                    </div>
                </div>

            </div>


        </div>

    }
}
