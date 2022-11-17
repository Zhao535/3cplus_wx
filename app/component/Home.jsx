import React from 'react';
import { _DATA, App, CTYPE, U } from "../common";
import '../assets/css/home.scss';
import {
    Banners,
    CommonTabs,
    TitleBar,
    HorizonalScrollContainer,
    MoreButton,
    Loading, ProductList, MerchantList, Sec2Timer,
    ArticleList
} from "./Comps";
import { Icon } from "antd";
import UIUtils from "../allData/UIUtils";
import ProductUtils from "../allData/ProductUtils";

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: 0,
            ui: {},
            products: [],
            productCategories: [],
            secKills: [],
            realTimeSecKill: []
        };
    }

    componentDidMount() {
        U.setWXTitle('首页');
        ProductUtils.loadProductCategories(this)
        this.loadData()
    }

    loadData = () => {
        let { activeKey } = this.state;
        this.setState({ loading: true, loaded: false })
        UIUtils.findUI(this, activeKey + 1);
        setTimeout(() => {
            this.setState({ loading: false, loaded: true })
        }, 400)
    }

    dealSecKill = () => {
        let { ui = {} } = this.state;
        let { components = [] } = ui;
        let seckillObj = components.find(item => item.key === "SECKILL") || {};
        if (Object.keys(seckillObj).length > 0) {
            let { list = [] } = seckillObj;
            let ids = [];
            list.map((seckill, index) => {
                let { id } = seckill
                ids.push(id)
            })
            App.api(`usr/secKill/secKills`, {
                secKillQo: JSON.stringify({
                    id: ids,
                    pageNumber: 1,
                    pageSize: 100
                })
            }).then((result) => {
                this.setState({ realTimeSecKill: result.content })
            })

        }
    }



    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onChange = (i) => {
        this.setState({
            activeKey: i,
        }, () => {
            this.loadData()
            i !== 2 && clearInterval(this.timerId);
            // i === 1 && ProductUtils.ProductList(this, {})
            i === 2 && this.initTimer();
        });
        //UIUtils.findUI(this, i + 1);

    };
    initTimer = () => {
        window.clearInterval(this.timerId);
        this.timerId = setInterval(() => {
            this.setState({ currT: new Date().getTime() })
        }, 1000);
    };


    render() {
        let { activeKey = 0, ui = {}, productCategories = [], diff, products = [], isStarted, isFinished, secKills = [], loading, loaded, realTimeSecKill = [] } = this.state;

        let { components = [], id, type } = ui;
        let MAIN_BANNER_WD = { width: "100vw", height: "100vw" }
        let SUB_BANNER_WD = { width: "100vw", height: "52vw" }

        return <div className='home-page'>
            <CommonTabs tabs={['推荐', '新品上架', '限时特惠']} onChange={this.onChange} />

            {loading && <Loading />}
            {loaded && <React.Fragment>
                <div className={'home-page-rec'}>
                    {
                        components.map((component, index) => {
                            let { key = '', list = [], title = '', subHeading = '', listStyle } = component;
                            if (key === 'BANNER') {
                                return <div key={index} className='-banner'>
                                    <Banners list={list} wd={type === 1 ? MAIN_BANNER_WD : SUB_BANNER_WD} />
                                    {type===1&&<div className='server'>
                                        <ul>
                                            <li><Icon type={'check-circle'} /><span>7天无理由退货</span></li>
                                            <li><Icon type={'check-circle'} /><span>全球设计</span></li>
                                            <li><Icon type={'check-circle'} /><span>3年质保</span></li>
                                            <li><Icon type={'check-circle'} /><span>厂家直销</span></li>
                                        </ul>

                                        <div className='get-coupon' onClick={() => {
                                            App.go(`/general-coupon`)
                                        }
                                        }>
                                            <img className="general-img"
                                                src={require("../../app/assets/3cimages/coupon/coupon-bg.png")} />
                                            <div className="inner">
                                                <div className="title">直减<em>100元</em></div>
                                                <div className="type-coupon">
                                                    全场通用券 | 满1000元使用
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                </div>

                            }
                            if (key === "AD") {
                                return <div key={index} className='-banner'>
                                    <Banners list={list} wd={{ width:"92vw",height:"32vw",margin:"0 auto 0 auto"}} type={CTYPE.bannerTypes.ad} />
                                    </div>
                            }
                            if (key === 'NAV') {
                                return <div key={index} className='nav'>
                                    <ul className='categories'>
                                        {list.map((nav, index1) => {

                                            return <li className='category' key={index1}>
                                                <img src={nav.icon} />
                                            </li>
                                        })}
                                        <li className='category category-more'>
                                            <img className='plus-icon'
                                                src={require('../assets/image/common/Plus.png')} />
                                            <div className='font'>更多</div>
                                        </li>
                                    </ul>
                                    <div className='clearfix' />
                                    {/*<MoreButton buttonName={'查看更多'} go={this.go}/>*/}
                                </div>
                            }
                            if (key === 'BESTBUY') {
                                return <div className='best-buy' key={index}>
                                    <TitleBar title={title} subHeading={subHeading} />
                                    <ProductList list={list} />
                                    {/*<MoreButton go={()=>{App.go(`/product`)}}/>*/}
                                </div>
                            }
                            if (key === 'MERCHANT') {
                                return <div key={index} className='merchant'>
                                    <TitleBar title={title} subHeading={subHeading} />
                                    <MerchantList list={list} productCategories={productCategories} />
                                    <MoreButton go={'merchants'} />
                                </div>
                            }
                            if (key === 'SCENE') {
                                let goSceneShopping = (id) => {
                                    App.go(`/scene/${id}`)
                                }

                                let goSceneProduct = (id) => {
                                    App.go(`/product/${id}/${0}`)
                                }

                                let renderScene = (item, index) => {
                                    let { img, title, subHeading, products = [], id } = item;
                                    if (products.length > 4) {
                                        products = products.filter(item => products.indexOf(item) < 4)
                                    }
                                    return <li className='render-scene' key={index}>
                                        <div onClick={() => {
                                            goSceneShopping(id)
                                        }}>
                                            <img className='scene-img' src={img} />
                                            <div className='scene-title'>{title}</div>
                                            <div className='scene-content'>{subHeading}</div>
                                        </div>
                                        <ul className='scene-products'>
                                            {
                                                products.map((product, index1) => {
                                                    let { specs = [], id } = product;
                                                    let { imgs = [] } = specs[0];
                                                    return <li className='scene-product' key={index1} onClick={() => {
                                                        goSceneProduct(id)
                                                    }}>
                                                        <img className='scene-product-img' src={imgs[0]} />
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </li>
                                }
                                return <div className='scenes' key={index}>
                                    <TitleBar title={title} subHeading={subHeading} />
                                    <HorizonalScrollContainer list={list} width={300} _render={renderScene} />
                                    <MoreButton go={'scenes'} />
                                </div>
                            }
                            if (key === 'ARTICLE') {
                                return <div className='article' key={index}>
                                    <TitleBar title='发现好玩' subHeading='探索从房间开始' withDot={true} />
                                    <ArticleList list={list} withIntro={true} />
                                </div>
                            }
                            if (key === "SECKILL") {
                                return <React.Fragment key={index}>
                                    <div className="find">
                                        <div className="seckill">
                                            <img src={require("../../app/assets/image/common/secKill.png")} />
                                            <div className="line"></div>
                                            <div className="wrap">
                                                <div className="content">
                                                    <p>于晋，三分钟前已获得平底锅一件</p>
                                                    <p>赵孟宇，两分钟前获得擀面杖一个</p>
                                                </div>
                                            </div>
                                        </div>
    
                                    </div>
                                    {list.length > 0 && realTimeSecKill.length > 0 && <div className='wrap'>
                                        {list.map((secKill, index1) => {
                                            let _secKill = realTimeSecKill.find(item => item.id == secKill.id) || {}
                                            let { product = {}, startAt, endAt, title, secKillSpec = [], productId } = _secKill;
                                            let currT = new Date().getTime();
                                            let notStart = startAt > currT;
                                            let ing = currT > startAt && endAt > currT;
                                            let ended = endAt < currT;
                                            let { price, specs = [] } = product;
                                            let spec = specs.find(item => item.sno === secKillSpec[0].sno) || {};
                                            let { imgs = [], linePrice, stock } = spec;
                                            return <div key={index1} className='find-product-product'>
                                                <img className='img' src={imgs[0]} />
                                                <div className='product-detail'>
                                                    <div className='info'>
                                                        {title}
                                                    </div>
                                                    <div className="rush">
    
                                                        {notStart && <div className="before">
                                                            距离秒杀开始： <Sec2Timer seconds={startAt - currT} />
                                                        </div>}
    
                                                        {ing && secKillSpec[0].num !== 0 && <div className="ing">
                                                            剩余时间：<Sec2Timer seconds={endAt - currT} />
                                                        </div>}
    
                                                        {ended && <div className="end">
                                                            活动结束，欢迎下次抢购
                                                        </div>
                                                        }
                                                    </div>
                                                    {/*<div className="stock">*/}
                                                    {/*    剩余库存：{secKillSpec[0].num}*/}
                                                    {/*</div>*/}
                                                    <div className='icon'>
                                                        <div className='price'>
                                                            <em>￥</em>{U.price.cent2yuan(secKillSpec[0].price.toFixed(2))}
                                                        </div>
                                                        <div className="line-price">
                                                            <em>￥</em>{U.price.cent2yuan(price.toFixed(2))}
                                                        </div>
                                                        <div className="rob" onClick={() => {
                                                            if (ing && secKillSpec[0].num !== 0) {
                                                                App.go(`/product/${product.id}/${secKill.id}`)
                                                            }
    
                                                        }}>{stock < 1 && <div className="end">已售空</div>}
    
                                                            {stock > 0 && <React.Fragment>{notStart && secKillSpec[0].num > 0 &&
                                                                <div className="before">马上开始</div>}
                                                                {ing && secKillSpec[0].num > 0 &&
                                                                    <div className="ing">开始抢</div>}
                                                                {ended && secKillSpec[0].num > 0 &&
                                                                    < div className="end">活动结束</div>}
                                                                {ing && secKillSpec[0].num <= 0 && <div className="no-stock">
                                                                    已售空
                                                            </div>}</React.Fragment>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
    
                                        })}
                                    </div>}
                                </React.Fragment>
                            }

                        })
                    }
                </div>
                </React.Fragment>}
        </div>
    }
}
