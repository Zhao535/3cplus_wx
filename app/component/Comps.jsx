import React from 'react';
import { App, CTYPE, U, Utils } from "../common";
import PropTypes, { func } from 'prop-types';
import '../assets/css/comps.scss';
import { Carousel, InputItem, SearchBar } from "antd-mobile";
import { Icon } from "antd";
import classNames from 'classNames';
import _DATA from "../common/data";
import { Spin } from 'antd';
import ProductUtils from "../allData/ProductUtils";
import { isUndefined } from "underscore";
import { Modal, Stepper, Toast } from "antd-mobile";
import CartUtils from "./cart/CartUtils";


class Banners extends React.Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        wd: PropTypes.object.isRequired,
        type: PropTypes.symbol
    }

    static defaultProps = {
        wd: { width: '100vw', height: '100vw' },
        type: CTYPE.bannerTypes.banner
    }

    render() {

        let { list = [], type, wd = {} } = this.props;
        let isAD = type === CTYPE.bannerTypes.ad;
        return <div style={wd} className='my-carousel'>
            <Carousel autoplay infinite>
                {list.map((item, index) => {
                    let { img } = item;
                    return <img style={wd} src={img} key={index} onClick={() => U.redirect.redirectByAction(item)} />
                })}
            </Carousel>
            {isAD && <div className='ad-corner' />}
            {isAD && <div className='hot-corner' />}
        </div>
    }
}

class NavBar extends React.Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        column: PropTypes.number
    }

    static defaultProps = {
        column: 5
    }

    render() {
        let { list = [], column } = this.props;
        let multi = list.length > 6;
        return <div className='nav-bar-wrapper'>
            <ul className={classNames('nav-bar', { 'nav-bar-multi': multi })}>
                {list.map((item, index) => {
                    let { icon, label } = item;
                    return <li key={index} style={multi ? { width: `${100 / column}%` } : {}}>
                        <img src={icon} />
                        <p>{label}</p>
                    </li>
                })}
                {multi && <div className='clearfix' />}
            </ul>
        </div>
    }
}


class HorizonalScrollContainer extends React.Component {

    static propTypes = {
        _render: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        width: PropTypes.number.isRequired,
        withArrow: PropTypes.bool
    }

    static defaultProps = {
        _render: (item, index) => {
            return <li key={index}>
                <img src={item.icon} />
            </li>
        },
        withArrow: false,
    }

    render() {
        let { _render, list = [], width, withArrow } = this.props;
        return <div className='scroll-container'>
            <ul className='scroll-ul' style={{ width: `${list.length * (width + 10) + 30}px` }}>
                {list.map((item, index) => {
                    return _render(item, index);
                })}
                {withArrow &&
                    <li className='right-arrow'>
                        <div className='ra'><img src={require('../assets/3cimages/icon/rightArrow.png')} /></div>
                    </li>}
            </ul>
        </div>

    }
}


function MySearchBar() {
    return <div className='my-search-bar'>
        <SearchBar placeholder='输入产品或品牌查询' />
    </div>
}

class AdBlock extends React.Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        withoutMargin: PropTypes.bool
    }

    render() {
        let { list = [], withoutMargin } = this.props;
        return <div className={classNames('ad-block', { 'ad-block-pure': withoutMargin })}>
            <Banners list={list} type={CTYPE.bannerTypes.ad} />
        </div>
    }
}

function MyRate(props) {
    let { score } = props;
    let arr = [];

    let full = parseInt(score);
    for (let i = 0; i < full; i++) {
        arr.push('full');
    }
    let withHalf = score % 1 > 0;
    if (withHalf) {
        arr.push('half');
    }
    let empty = 5 - (withHalf ? 1 : 0) - full;
    for (let i = 0; i < empty; i++) {
        arr.push('empty')
    }
    return <div className='my-rate'>
        <ul>
            {arr.map((a, i) => <li key={i} className={a} />)}
        </ul>
        <span>{score}分</span>
    </div>
}

function MyTags(props) {
    let { tags = [] } = props;
    return <ul className='my-tags'>
        {tags.map((str, index) => {
            return <li key={index}>{str}</li>
        })}
    </ul>
}

class ProductList extends React.Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        layout: PropTypes.symbol
    }

    static defaultProps = {
        layout: CTYPE.productLayout.box
    }

    render() {
        let { list = [] } = this.props;
        return <React.Fragment>
            {list.length > 0 && <ul className={classNames('new-products')}>
                {list.map((item, index) => {

                    let { specs = [], id, price, name } = item;
                    let { imgs = [] } = specs[0];
                    return <li className='new-product' key={index} onClick={() => {
                        App.go(`/product/${id}/${0}`)
                    }}>
                        <img className='product-img' src={imgs[0]} />
                        <div className='product-detail'>
                            <div className='product-name'>{name}</div>
                            <div className='product-price'>
                                <em>{U.price.cent2yuan(price, true)}</em>
                                <img className='shopping-cart'
                                    style={{ width: '22px', height: '22px' }}
                                    src={require('../assets/3cimages/icon/shopping-cart.png')} />
                            </div>
                        </div>

                    </li>
                })}

                <div className='clearfix' />

            </ul>}
            {list.length <= 0 && NonData("暂时没有新的商品，快去逛逛吧~")}
        </React.Fragment>
    }
}

function NonData(message) {
    return <div className="non-data">{message}</div>
}

class FilterBar extends React.Component {

    static propTypes = {
        sorter: PropTypes.object.isRequired,
        filter: PropTypes.object.isRequired,
        brands: PropTypes.array,
        layout: PropTypes.symbol,

    }

    static defaultProps = {
        layout: CTYPE.productLayout.box
    }

    constructor(props) {
        super(props);
        this.state = {
            sorter: this.props.sorter,
            filter: this.props.filter,
            layout: this.props.layout,
            brands: this.props.brands,
            showDrawer: false,
            showOverLay: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            sorter: nextProps.sorter,
            filter: nextProps.filter,
            layout: nextProps.layout,
            brands: nextProps.brands,
        })
    }

    callback = (withoutLoading = false) => {
        let { sorter = {}, filter = {}, layout } = this.state;
        this.props.syncFilterBar(sorter, filter, layout, withoutLoading);
        this.doShowDrawer(false, false);
    };

    doShowDrawer = (showDrawer, showOverLay) => {
        this.setState({
            showDrawer, showOverLay
        })
    }


    render() {

        let { sorter = {}, filter = {}, showDrawer, showOverLay, brands = [] } = this.state;

        let { field = 'id', ascDesc = 'desc' } = sorter;

        let { prices = ['', ''], brandIds = [] } = filter;

        let isDesc = ascDesc === 'desc';


        return <React.Fragment>

            <div className='filter-bar'>

                <ul>
                    <li className={classNames({ 'active': field === 'id' })} onClick={() => {
                        if (field !== 'id') {
                            this.setState({
                                sorter: {
                                    field: 'id',
                                    ascDesc: 'desc'
                                }
                            }, this.callback)
                        }
                    }}>综合
                    </li>
                    <li className={classNames('sorter', { 'asc': field === 'price' && !isDesc }, { 'desc': field === 'price' && isDesc })}
                        onClick={() => {
                            if (field === 'price') {
                                this.setState({
                                    sorter: {
                                        field: 'price',
                                        ascDesc: isDesc ? 'asc' : 'desc'
                                    }
                                }, this.callback)
                            } else {
                                this.setState({
                                    sorter: {
                                        field: 'price',
                                        ascDesc: 'asc'
                                    }
                                }, this.callback)
                            }
                        }}>价格
                    </li>
                    <li className={classNames({ 'active': field === 'createdAt' })} onClick={() => {
                        if (field !== 'createdAt') {
                            this.setState({
                                sorter: {
                                    field: 'createdAt',
                                    ascDesc: 'desc'
                                }
                            }, this.callback)
                        }
                    }}>上新
                    </li>
                    <li className='filter' onClick={() => {
                        this.doShowDrawer(true, true)
                    }}>筛选
                    </li>
                </ul>


            </div>

            {showOverLay && <OverLay doShowDrawer={this.doShowDrawer} />}

            <div className={classNames('filter-drawer', { 'filter-drawer-open': showDrawer })}>
                <div className='container'>

                    <div className='block'>
                        <div className='title'>价格区间</div>
                        <div className='prices'>
                            <input type='number' value={prices[0]} onChange={(e) => {
                                prices[0] = e.target.value;
                                this.setState({
                                    filter: {
                                        ...filter,
                                        prices
                                    }
                                })
                            }} />
                            <div className='join' />
                            <input type='number' value={prices[1]} onChange={(e) => {
                                prices[1] = e.target.value;
                                this.setState({
                                    filter: {
                                        ...filter,
                                        prices
                                    }
                                })
                            }} />
                        </div>
                    </div>

                    <div className='split' />

                    {brands.length > 0 && <div className='block'>
                        <div className='title'>品牌</div>
                        <ul>
                            {brands.map((b, i) => {
                                let { id, name } = b;
                                let checked = brandIds.indexOf(id) > -1;
                                return <li key={i} className={classNames({ 'checked': checked })} onClick={() => {
                                    if (checked) {
                                        brandIds = U.array.remove(brandIds, brandIds.indexOf(id));
                                    } else {
                                        brandIds.push(id);
                                    }
                                    this.setState({
                                        filter: {
                                            ...filter,
                                            brandIds
                                        }
                                    })
                                }}>{name}</li>
                            })}
                        </ul>
                    </div>}

                </div>
                <div className='btm-bar'>
                    <div className='btn' onClick={() => {
                        this.setState({ filter: {} })
                    }}>重置
                    </div>
                    <div className='ok' onClick={() => this.callback(false)}>确认</div>
                </div>
            </div>
        </React.Fragment>
    }
}


class OverLay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeOut: false
        }
    }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflow = 'auto';
    }

    close = () => {
        this.props.doShowDrawer(false, true);
        this.setState({ fadeOut: true });
        setTimeout(() => {
            this.props.doShowDrawer(false, false);
        }, 400)
    }

    render() {
        let { fadeOut } = this.state;
        return <div className={classNames('overlay-ng', { 'overlay-ng-fade-out': fadeOut })} onClick={this.close} />
    }
}

function Loading() {
    return <div className='my-loading'>
        <Spin />
    </div>
}


class CommonTabs extends React.Component {

    static propTypes = {
        tabs: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };
    }

    render() {
        let { tabs = [], onChange } = this.props;
        let { index } = this.state;

        let left = 100 / tabs.length / 2;
        left += index * left * 2;
        return <ul className='common-tab'>

            {tabs.map((tab, i) => {

                let isActive = index === i;

                return <li key={i} className={classNames({ 'active': isActive })} onClick={() => {
                    if (!isActive) {
                        this.setState({ index: i });
                        onChange(i);
                    }
                }}>{tab}</li>;
            })}
            <div className='underline' style={{ left: `${left}vw` }} />
        </ul>;
    }
}

class CommonPopup extends React.Component {

    static propTypes = {
        okBtn: PropTypes.element.isRequired,
        onClose: PropTypes.func.isRequired,
        children: PropTypes.element
    };

    constructor(props) {
        super(props);
        this.state = {
            close: false
        };
    }

    close = () => {
        this.setState({ close: true });
        setTimeout(() => {
            this.props.onClose();
        }, 400);
    };

    render() {
        let { close } = this.state;
        let { okBtn, children } = this.props;
        return <React.Fragment>
            <div className={classNames('overlay', { 'overlay-fade-out': close })} onClick={this.close} />
            <div className={classNames('common-popup', { 'common-popup-close': close })}>
                <div className='container'>
                    {children}
                </div>
                {okBtn}
            </div>
        </React.Fragment>;
    }
}

class TopBar extends React.Component {

    static propTypes = {
        left: PropTypes.string,
        title: PropTypes.string,
        titleColor: PropTypes.string,
        right: PropTypes.string
    }

    static defaultProps = {
        titleColor: '#333'
    }


    render() {
        let { left, title, right, titleColor } = this.props;
        let isSearch = left === 'search';
        let isCancel = left === 'cancel'
        let isDetail = right === 'detail'
        let isMessage = right === 'message'
        return <div className='top-bar'>
            {isSearch && <img src={require(`../assets/image/common/search.png`)} />}
            {isCancel && <img src={require(`../assets/3cimages/icon/left-arrow.png`)} />}
            <div className='title' style={{ color: titleColor }}>{title}</div>
            {isMessage && <img src={require('../assets/image/common/message.png')} />}
            {isDetail && <img src={require('../assets/3cimages/icon/load.png')} />}

        </div>
    }


}

class ProductBar extends React.Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
    }

    render() {
        let { list = [] } = this.props;
        return <ul className='product-bar'>
            {
                list.map((product, index) => {
                    let { imgs = [], title, price } = product;
                    return <li key={index}>
                        <img src={imgs[0]} />
                        <div className='product-name'>{title}</div>
                        <div className='price'><em>￥{price}</em><img
                            src={require('../assets/image/common/shopping-cart.png')} /></div>
                    </li>
                })
            }
        </ul>
    }

}

class TitleBar extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        withDot: PropTypes.bool.isRequired,
        subHeading: PropTypes.string
    }

    static defaultProps = {
        withDot: true,
    }

    render() {
        let { title = '', subHeading = '', withDot = true } = this.props;
        return <div className='title-bar'>
            {
                withDot && <div className='title-dot-left'>
                    <div className='dot' />
                    <div className='dot' />
                </div>

            }

            <div className='whole-title'>
                <div className='title'>{title}</div>
                <div className='subHeading'>{subHeading}</div>
            </div>
            {
                withDot && <div className='title-dot-right'>
                    <div className='dot' />
                    <div className='dot' />
                </div>

            }
        </div>
    }


}

class MoreButton extends React.Component {

    static propTypes = {
        buttonName: PropTypes.string.isRequired,
        go: PropTypes.string.isRequired,
    }

    static defaultProps = {
        buttonName: '查看更多'
    }

    render() {
        let { buttonName, go } = this.props;
        return <div className='more-button'>
            <span onClick={() => {
                App.go(`/${go}`)
            }}>{buttonName}</span>
        </div>

    }

}

function NoMoreData() {
    return <div className='no-more-data'>
        哎呀！没有更多了~
    </div>

}

function RenderSex(props) {
    let { sex } = props;
    if (sex === 2) {
        return <img className='sex' src={require('../assets/3cimages/icon/woman.png')} />
    } else {
        return <img className='sex' src={require('../assets/3cimages/icon/man.png')} />
    }
}

class SceneList extends React.Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        withTitles: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        withTitles: true,
    }

    render() {
        let { list = [], withTitles } = this.props;
        return <ul className='scene-list'>
            {
                list.map((scene, index) => {
                    let { title, subHeading, img, content, products = [], type, id } = scene;
                    return <li key={index} className='scene' onClick={() => {
                        App.go(`/scene/${id}`)
                    }}>
                        {
                            withTitles &&
                            <div className='titles'>
                                <div className='scene-type'>
                                </div>
                                <div className='scene-subHeading'>
                                    {subHeading}
                                </div>
                            </div>
                        }
                        <img className='scene-img' src={img} />
                        <div className="scene-detail">
                            <div className='scene-title'>
                                {title}
                            </div>
                            <ul className='scene-products'>
                                {products.map((product, index1) => {
                                    let { id, specs = [] } = product;
                                    let { imgs = [] } = specs[0];
                                    return <React.Fragment key={index1} >
                                        {index1 < 4 && <img className='scene-product-img' src={imgs[0]}
                                            onClick={() => {
                                                App.go(`/product/${id}/${0}`)
                                            }
                                            } />}</React.Fragment>
                                })}
                            </ul>
                        </div>
                        <div className='clearfix' />
                    </li>

                })
            }
            <div className='clearfix' />
        </ul>

    }


}

class ArticleList extends React.Component {


    static propTypes = {
        list: PropTypes.array.isRequired,
        withIntro: PropTypes.bool,
        withMore: PropTypes.bool
    }

    static defaultProps = {
        withMore: true
    }

    render() {
        let { list = [], withIntro, withMore } = this.props;
        if (list.length % 2 === 0 && list.length > 2) {
            list = U.array.remove(list, 1)
        }
        return <React.Fragment>
            {list.length > 0 && < ul className="article-ul" >
                {
                    list.map((article, articleIndex) => {
                        let { id, picture, title, pageView, authorName, authorImg, intro } = article;
                        return <li key={articleIndex} className="article-li" onClick={() => {
                            App.go(`/article/${id}`)
                        }}>
                            <img src={picture} className="article-img" />
                            <div className="article-title">{title}</div>
                            <div className="article-detail">
                                <img src={authorImg} className="article-author-img" />
                                <div className="article-author">{authorName}</div>
                                <div className="article-browse"><span>{pageView}</span></div>
                            </div>
                            {withIntro && <div className="article-intro">
                                {intro}
                            </div>}
                        </li>
                    })
                }
                {
                    withMore && <li className="article-li">
                        <img src={require("../assets/image/home/article_more.png")} className="article-img" />
                        <div className="cover" />
                        <p className="article-p">查看更多<i /></p>
                    </li>
                }
            </ul >}
            {list.length <= 0 && NonData("暂时没有新的文章哦，快去逛逛吧~")}
        </React.Fragment>
    }
}


class MerchantList extends React.Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        productCategories: PropTypes.array.isRequired,
    }


    render() {
        let { list = [], productCategories = [] } = this.props;
        let renderCategory = (item, index) => {

            return <li className='category-name' key={index}>
                {item}
            </li>
        }
        return <ul className='stores'>
            {
                list.map((store, index1) => {
                    let { imgs = [], name = '', logo, sequences = [], id, productNum } = store;
                    let categoryNames = [];
                    sequences.map((sequence, index) => {
                        let categoryName = ProductUtils.getCategoryName(productCategories, sequence, false);
                        categoryNames.push(categoryName);
                    })
                    return <li key={index1} className='store' onClick={() => {
                        App.go(`/merchant/${id}`)
                    }}>
                        <div className='store-img'><img src={imgs[0]} /></div>
                        <div className='store-detail'>
                            <div className='store-name'>{name}</div>
                            <HorizonalScrollContainer list={categoryNames} width={30} _render={renderCategory} />
                            <div className='clearfix' />
                            <div className='store-stock'>{productNum > 0 ? `共有${productNum}件商品` : "暂无商品~"}</div>
                            <div className='store-detail-button'>查看详情</div>
                        </div>
                    </li>
                })
            }
        </ul>
    }

}


class MyStepper extends React.Component {

    static propTypes = {
        value: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        value: 1,
        min: 1,
        max: 99,
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            min: nextProps.min,
            max: nextProps.max,
            onChange: nextProps.onChange,
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            min: this.props.min,
            max: this.props.max,
            onChange: this.props.onChange,
        }
    }


    render() {
        let { min = 1, max = 99, onChange, value = 1 } = this.state;
        let canMinus = value > min;
        let canPlus = value < max;
        return <div className='my-stepper'>
            {canMinus ? <img className='minus' src={require('../assets/3cimages/icon/minus-333.png')} onClick={() => {
                value--;
                onChange(value)
                this.setState({ value })
            }
            } /> :
                <img className='minus' src={require('../assets/3cimages/icon/minus-bf.png')} />}
            <input className='number-input' value={value} onChange={(event) => {
                value = parseInt(event.target.value);
                (isNaN(value) || value < min) && (value = min);
                (value > max) && (value = max);
                onChange(value);
                this.setState({ value })
            }} />
            {canPlus ? <img className='plus' src={require('../assets/3cimages/icon/plus-333.png')} onClick={() => {
                value++;
                onChange(value)
                this.setState({ value })
            }
            } /> :
                <img className='plus' src={require('../assets/3cimages/icon/plus-bf.png')} />}
        </div>

    }
}


class PickBar extends React.Component {

    static propTypes = {
        buyNum: PropTypes.number.isRequired,
        product: PropTypes.object.isRequired,
        onPickSpec: PropTypes.object,
        showOverLay: PropTypes.bool.isRequired,
        popSpecsDrawer: PropTypes.bool.isRequired,
        changeBuyNum: PropTypes.func.isRequired,
        withNumberChange: PropTypes.bool
    };

    static defaultProps = {
        withNumberChange: true,
    }

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
            buyNum: this.props.buyNum,
            onPickSpec: this.props.onPickSpec,
            popSpecsDrawer: this.props.popSpecsDrawer,
            showOverLay: this.props.showOverLay,
            changeBuyNum: this.props.changeBuyNum,
            withNumberChange: this.props.withNumberChange,
            currSpec: {},
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            product: nextProps.product,
            buyNum: nextProps.buyNum,
            onPickSpec: nextProps.onPickSpec,
            popSpecsDrawer: nextProps.popSpecsDrawer,
            showOverLay: nextProps.showOverLay,
        })
    }

    doShowDrawer = (popSpecsDrawer, showOverLay) => {
        this.setState({
            popSpecsDrawer, showOverLay
        })
    }
    callBack = () => {
        let { onPickSpec = {}, popSpecsDrawer, showOverLay } = this.state;
        this.props.syncOnPickSpec(onPickSpec);
    }

    cancel = () => {
        let { currSpec } = this.state;
        this.setState({ currSpec: {} })
    }


    render() {
        let {
            product,
            withNumberChange,
            onPickSpec = {},
            changeBuyNum,
            popSpecsDrawer,
            showOverLay,
            buyNum,
            currSpec = {}
        } = this.state;
        let { specs = [], name = '', id } = product;
        //定义需要的变量：specMap,currSpec,onPickSpec,labels,label1,label2,ableSpec
        //取出属性的名称：
        //currSpec用户选中的规格（只有label和value，没有别的属性）
        let ables = [];//所有可以选的规格
        let label1 = '';//规格的第一个属性名
        let label2 = '';//规格的第二个属性名
        let values1 = [];//第一个属性的所有值
        let values2 = [];//第二个属性的所有值
        if (specs.length) {
            let { params = [] } = specs[0];
            label1 = params[0].label;
            if (params[1]) {
                label2 = params[1].label;
            }
            if (isUndefined(currSpec[label1]) && showOverLay) {
                if (Object.keys(onPickSpec).length > 0) {
                    let { params = [] } = onPickSpec;
                    currSpec[label1] = params[0].value;
                    if (label2) {
                        if (isUndefined(currSpec[label2])) {
                            if (params[1]) {
                                currSpec[label2] = params[1].value;
                            }
                        }

                    }
                } else {
                    currSpec[label1] = params[0].value;
                    if (label2) {
                        if (isUndefined(currSpec[label2])) {
                            currSpec[label2] = params[1].value;
                        }

                    }
                }
            }
        }
        //取出属性  商品可能有一个或两个属性

        //取出两个属性的值，筛选出所有可以选的规格
        specs.map((spec, index) => {
            let ableSpec = {};//商品的每个规格
            let { params = [] } = spec;
            let { label, value } = params[0];
            values1.push(params[0].value)
            if (label2) {
                values2.push(params[1].value)
            }
            ableSpec[label1] = params[0].value;
            label2 && (ableSpec[label2] = params[1].value);
            ables.push(ableSpec);
            if (label === label1 && value === currSpec[label1]) {
                if (!isUndefined(params[1])) {
                    let { label, value } = params[1];
                    if (label === label2 && value === currSpec[label2]) {
                        onPickSpec = spec;
                    }
                } else {
                    onPickSpec = spec;
                }
            }
            //556-566 : 把用户选中的规格的整个对象赋给onPickSpec;
        })
        //对所有属性的值去重
        values1 = [...new Set(values1)];
        if (label2) {
            values2 = [...new Set(values2)];
        }
        let { imgs = [], price, stock } = onPickSpec;
        let canSelect1 = [];
        let canSelect2 = [];
        let _able1 = ables.filter(value => value[label1] === currSpec[label1]) || [];//用户改变第2个属性的时候，可选的第一个属性
        let _able2 = ables.filter(value => value[label2] === currSpec[label2]) || [];//用户改变第1个属性的时候，可选的第二个属性
        _able1.map((a1) => {
            canSelect1.push(a1[label2])
        })
        _able2.map((a2) => {
            canSelect2.push(a2[label1])
        })
        return <div className='pick-bar'>

            <div className={popSpecsDrawer ? 'specs-drawer pop ' : 'specs-drawer'}>
                <div className='container'>

                    <div className='on-pick-product'>
                        <img className='on-pick-product-img' src={onPickSpec && onPickSpec.imgs[0]} />
                        <div className='on-pick-product-detail'>
                            <div className='on-pick-product-price'>
                                <em>￥</em> {onPickSpec && U.price.cent2yuan(onPickSpec.price)}
                            </div>
                            <div className='on-pick-product-stock'>
                                剩余库存： {onPickSpec && stock}
                            </div>
                        </div>
                    </div>
                    <div className='rt-label-name'>
                        {label1}
                    </div>
                    <ul className='rt-specs'>
                        {
                            values1.map((v, index) => {
                                let checked = currSpec[label1] === v;
                                let canselect = canSelect2.indexOf(v) < 0;
                                return <li key={index}
                                    className={classNames('rt-spec', { 'rt-spec onPick': checked }, { 'rt-spec cantPick': canselect })}
                                    onClick={() => {
                                        if (canSelect2.indexOf(v) >= 0) {
                                            currSpec[label1] = v;
                                            this.setState({ currSpec })
                                        }
                                    }}>
                                    {v}
                                </li>
                            })
                        }
                    </ul>
                    <div className='clearfix' />
                    <div className='rt-label-name'>
                        {label2}
                    </div>
                    {label2 && <ul className='rt-specs'>
                        {
                            values2.map((v, index) => {
                                let checked = currSpec[label2] === v;
                                let canselect = canSelect1.indexOf(v) < 0;
                                return <li key={index}
                                    className={classNames('rt-spec', { 'rt-spec onPick': checked }, { 'rt-spec cantPick': canselect })}
                                    onClick={() => {

                                        if (canSelect1.indexOf(v) >= 0) {
                                            currSpec[label2] = v;
                                            this.setState({ currSpec });
                                        }
                                    }}
                                >
                                    {v}
                                </li>
                            })
                        }
                    </ul>}
                    <div className='clearfix' />
                    {withNumberChange && <div className='buy-num'>
                        <div className='buy-num-title'>数量</div>
                        <MyStepper value={buyNum} min={1} max={stock}
                            onChange={(val) => {
                                changeBuyNum(val)
                            }} />
                    </div>}
                </div>

                <div className='ok-button' onClick={() => {
                    this.doShowDrawer(false, false);
                    this.setState({
                        onPickSpec
                    }, this.callBack)
                }
                }>确认
                </div>
            </div>

            {showOverLay && <MyOverLay cancel={this.cancel} doShowDrawer={this.doShowDrawer} />}

        </div>


    }


}


class MyOverLay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeOut: false
        }
    }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflow = 'auto';
    }

    close = () => {
        this.props.doShowDrawer(false, true);
        this.setState({ fadeOut: true });
        setTimeout(() => {
            this.props.doShowDrawer(false, false);
        }, 400)
        this.props.cancel();
    }

    render() {
        let { fadeOut } = this.state;
        return <div className={classNames('overlay-ng', { 'overlay-ng-fade-out': fadeOut })} onClick={this.close} />
    }
}

class ParamModal extends React.Component {


    static propTypes = {
        product: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            product: this.props.product,
            defaultSno: this.props.defaultSno || '1',
            _specs: [],
            action: this.props.action || 'spec',
            currSpec: {},
            num: 1,
            isCart: this.props.isCart || false,
            isScene: this.props.isScene || false,
            sno: '',
            visible: this.props.visible,
            secKillId: this.props.secKillId || false,
            options: this.props.options
        };

    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({ visible: false });
        });
        this.sortSpecs();
    }

    sortSpecs = () => {

        let { product = {}, defaultSno } = this.state;

        let { specs = [] } = product;
        let _specs = [];
        let names = [];
        let defaultIndex = 0;

        //筛选出全部的标签
        specs.map((spe) => {
            let { params = [] } = spe;
            params.map((sp) => {
                names.push(sp.label);
            });
        });
        names = [...new Set(names)];

        let _params = [];
        specs.map((item) => {
            let { sno, params } = item;
            if (sno === defaultSno) {
                _params = params;
            }
        });

        //为标签筛选出全部的可选值，建立规格的二维关系
        names.map((name, index) => {
            let values = [];
            specs.map((spe) => {
                let { params = [] } = spe;
                params.map((sp) => {
                    if (sp.label === name) {
                        values.push(sp.value);
                    }
                });
            });
            values = [...new Set(values)];
            values.map((v, _index) => {
                _params.map((p) => {
                    if (p.value === v) {
                        defaultIndex = _index;
                    }
                });
            });
            _specs.push({ name, index, active: defaultIndex, values });
        });

        //根据可下单的第一个规格初始化默认选中标签

        let { params = [] } = specs.length > 0 ? specs[0] : {};
        for (let i = 0; i < params.length; i++) {
            let sprop = params[i];
            for (let j = 0; j < _specs.length; j++) {
                let spec = _specs[j];
                let { name, values = [] } = spec;
                if (sprop.name === name) {
                    for (let k = 0; k < values.length; k++) {
                        if (values[k] === sprop.value) {
                            spec.active = k;
                        }
                    }
                }
            }
        }

        this.setState({ _specs }, () => {
            this.setCurrentSpec();
        });

    };

    setCurrentSpec = () => {
        let { product = {} } = this.state;
        let currSpec = this.getCurrentSpec();
        let { params = [] } = currSpec;
        if (params.length > 0) {
            this.setState({
                currSpec: this.getCurrentSpec()
            }, () => {
                if (!this.state.isCart) {
                    if (this.state.isScene) {
                        this.props.setCurrSpec(currSpec, product.id);
                    } else {
                        this.props.setCurrSpec(currSpec);
                    }
                }
            });
        }
    };

    getCurrentSpec = () => {

        let { product = {}, _specs = [] } = this.state;
        let { specs = [] } = product;
        let currSpec = {};
        specs.map((spe, index) => {
            let { params = [] } = spe;
            let num = 0;
            params.map((spec) => {
                _specs.map((sp) => {
                    if (spec.label === sp.name && spec.value === sp.values[sp.active]) {
                        num++;
                    }
                });
            });
            if (num === _specs.length) {
                currSpec = spe;
            }
        });
        return currSpec;
    };

    showModal = (visible, action) => {
        this.setState({ visible, action });
    };

    checkable = (specs, _specs, name, value) => {

        let checkedspecs = { name: _specs[0].name, value: _specs[0].values[_specs[0].active] };
        for (let i = 0; i < specs.length; i++) {

            let prop = specs[i];
            let num = 0;
            let { params } = prop;
            for (let j = 0; j < params.length; j++) {
                let sprop = params[j];
                if ((sprop.label === name && sprop.value === value) || (sprop.label === checkedspecs.name && sprop.value === checkedspecs.value)) {
                    num++;
                }
            }
            if (num === _specs.length) {
                return true;
            }
        }
    };

    cart = () => {
        let { currSpec = {}, num, secKillId, product = {},options={} } = this.state;
        let { merchantId, id, stock } = product;
        if (num > stock) {
            Toast.info("库存不足");
            return;
        }
        if (U.str.isEmpty(num)) {
            Toast.info("所加购的商品数量有误");
            return;
        }
        if (Utils.token()) {
            App.api('/usr/cart/save', {
                cart: JSON.stringify({
                    productId: id,
                    productSno: currSpec.sno,
                    num: num,
                    merchantId: merchantId,
                    cartPayload: { id: secKillId ? secKillId : 0, type: secKillId ? 2 : 1 }
                })
            }).then(() => {
                if (secKillId) {
                    App.api(`usr/secKill/modifyStock`, { id: secKillId, sno: currSpec.sno }).then(() => {
                        this.props.loadData();
                    });
                    Toast.success("加入购物车成功", 1, null, false);
                    this.setState({ visible: false });
                } else {
                    Toast.success("加入购物车成功", 1, null, false);
                    this.setState({ visible: false });
                }

            }
            );
        } else {
            Toast.fail("请先登录");
        }
    };
    loadCarts = () => {
        CartUtils.get().then((carts) => {
            this.props.comp.props.carts.setCarts(carts);
        });
    };

    buy = () => {
        let { ids = [], num, currSpec = {}, secKillId, product } = this.state;
        let { merchantId, id, stock } = product;
        if (num > stock) {
            Toast.info("库存不足");
            return;
        }
        if (U.str.isEmpty(num)) {
            Toast.info("所加购的商品数量有误");
            return;
        }
        if (id) {
            App.api('/usr/cart/save', {
                cart: JSON.stringify({
                    productId: id,
                    num: num,
                    merchantId: merchantId,
                    productSno: currSpec.sno,
                    cartPayload: { id: secKillId ? secKillId : 0, type: secKillId ? 2 : 1 }
                })
            }).then((res) => {
                let { id } = res;
                ids.push(id);
                this.setState({ visible: false });
                let str = encodeURIComponent(encodeURIComponent(JSON.stringify(ids)));
                App.go(`/trade/${str}/${secKillId}`);
            });
        } else {
            Toast.fail('请先登录');
        }

    };

    updateSno = () => {
        let { currSpec = {}, id } = this.state;
        App.api('/usr/cart/update_spec', {
            id,
            productSno: currSpec.sno
        }).then(() => {
            this.setState({ visible: false });
            this.loadCarts();
        });
    };


    render() {
        let { visible, product = {}, spe = '', currSpec = {}, action, _specs = [], num, isCart, isScene, secKillId, options = {} } = this.state;
        let { specs = [] } = product;
        let { imgs = [] } = currSpec;

        if (currSpec !== {}) {
            let { params = [] } = currSpec;
            let { secKill = {} } = options;
            let { secKillSpec = [] } = secKill;
            let selectSecKillSpec = secKillSpec.find(value => value.sno === currSpec.sno) || {};
            params.map((p) => {
                spe = spe + p.label + ':' + p.value + '     ';
            });
            currSpec.secKillPrice = selectSecKillSpec.price;
        }

        return <div>
            <Modal
                className='modal-buy-inner'
                popup
                closable={true}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
                animationType="slide-up">

                <div className='buy-header'>
                    <div className='buy-avt'>
                        <img src={imgs[0]} />
                    </div>
                    <div className='right-price'>
                        <div className='buy-price'>
                            {currSpec.secKillPrice > 0 && <span style={{}}>￥{(currSpec.secKillPrice / 100).toFixed(2)}</span>}
                            <span style={currSpec.secKillPrice > 0 ? { textDecoration: "line-through" } : {}}>￥{(currSpec.price / 100).toFixed(2)}</span>
                        </div>
                        <div
                            className='product-repertory'>剩余库存:&nbsp;{currSpec.stock > 9999 ? '9999+' : currSpec.stock}</div>
                    </div>
                </div>

                <div className='buy-body'>
                    {_specs.map((spec, index) => {
                        let { name, active, values = [] } = spec;
                        return <div className='specs' key={index}>
                            <div className='title'>{name}</div>
                            <ul>
                                {values.map((str, i) => {
                                    let checkable = index === 0 || this.checkable(specs, _specs, name, str);
                                    return <li key={i}
                                        className={checkable ? (active === i ? 'active' : '') : 'disabled'}
                                        onClick={() => {
                                            if (checkable) {
                                                spec.active = i;
                                                _specs[index] = spec;
                                                this.setState({
                                                    _specs
                                                }, () => {
                                                    this.setCurrentSpec();
                                                });
                                            } else {
                                                return
                                            }
                                        }}>
                                        {str}
                                    </li>;
                                })}
                            </ul>
                        </div>;
                    })}

                    {(!isCart && !isScene) && <div className='buy_count_choose'>
                        数量
                        <MyStepper
                            style={{ float: 'right', minWidth: '10vw' }}
                            min={1}
                            value={num}
                            max={currSpec.stock}
                            onChange={(e) => this.setState({ num: e })}
                        />
                    </div>}
                </div>

                {currSpec.stock <= 0 ? <div className="disabled-btn"><span>该商品暂时缺货</span></div> :

                    <div className='modal-buy-bottom' onClick={() => {
                        if (isCart) {
                            this.updateSno();
                        } else {
                            if (action === 'cart') {
                                this.cart();
                            } else if (action === 'order') {
                                this.buy();
                            } else if (action === 'changeSpec') {
                                this.setCurrentSpec();
                                this.showModal(false)
                            } else {
                                this.showModal(false);
                            }
                        }

                    }}>
                        <span>确定</span>
                    </div>
                }
            </Modal>
        </div>;
    }
}


class AddressComps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_modal: this.props.show_modal,
            addresses: this.props.addresses
        };
    }

    changeAddress = (show_modal, address) => {
        this.props.syncItem(show_modal, address);
        this.setState({ show_modal: false });
    };


    render() {

        let { addresses = [], show_modal } = this.state;
        return <Modal
            className='modal-address'
            popup
            closable={true}
            style={{ height: '50vh' }}
            visible={show_modal}
            onClose={() => {
                this.setState({ show_modal: false });
            }}
            animationType="slide-up">

            <div className='address-page'>

                {addresses.length === 0 && <div className='address-empty' onClick={() => App.go(`/address-edit/${0}`)}>
                    <div className='empty-icon' />
                </div>}

                {addresses.map((address, index) => {
                    let { name, id, code, detail, mobile = '', isDefault } = address;
                    let codes = Utils.addr.getPCD(code);
                    let strMobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
                    return <div className='address-item' key={index} onClick={() => {
                        this.changeAddress(false, address);
                    }}>
                        <div className='user-info'>
                            <span className='name'>{name}</span>
                            <span className='mobile'>{strMobile}</span>
                            {isDefault === 1 && <span className='default-address'>默认</span>}
                        </div>

                        <div className='addr-line-2'>
                            <div className='address-detail'>
                                <span className='detail'>{codes}&nbsp;{detail}</span>

                            </div>

                            <div className='icon-edit' onClick={() => {
                                App.go(`/location-edit/${id}`);
                                this.setState({ show_modal: false })
                            }} />
                        </div>

                    </div>;
                })}
            </div>

            <div className='modal-create-address' onClick={() => {
                App.go(`/location-edit/${0}`);
                this.setState({ show_modal: false })
            }}><span>+新建收货地址</span>
            </div>
        </Modal>;

    }

}

class MyCommonTabs extends React.Component {

    static propTypes = {
        tabs: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        index: PropTypes.number
    };

    static defaultProps = {
        index: 0,
    }


    render() {
        let { index, tabs = [], onChange } = this.props;

        let left = 100 / tabs.length / 2;

        left += index * left * 2;

        return <ul className='common-tab'>
            {tabs.map((tab, i) => {

                let isActive = index === i;

                return <li key={i} className={classNames({ 'active': isActive })} onClick={() => {
                    if (!isActive) {
                        this.setState({ index: i });
                        onChange(i)
                    }
                }}>{tab}</li>;
            })}

            <div className='underline' style={{ left: `${left}vw` }} />

        </ul>;
    }
}

class CommonTimer extends React.Component {

    static propTypes = {
        endAt: PropTypes.number.isRequired
    };

    constructor() {
        super();
        this.state = {};
        this.timerId = null;
    }

    componentDidMount() {
        this.initTimer();
    }

    initTimer = () => {
        clearInterval(this.timerId);
        this.timerId = setInterval(() => {
            let { endAt } = this.props;
            let curr = new Date().getTime();
            let diff = endAt - curr;
            if (diff < 0) {
                clearInterval(this.timerId);
            } else {
                let d = 0, h = 0, m = 0, s = 0;
                let seconds = (diff / 1000).toFixed(0);
                d = parseInt(seconds / (3600 * 24));
                h = parseInt((seconds % (3600 * 24)) / 3600 + (d * 24));
                m = parseInt((seconds % 3600) / 60);
                s = seconds % 60;
                this.setState({ timer: { d, h, m, s } });
            }
        }, 1000);
    };

    pad = (num = 0) => {
        return num < 10 ? `0${num}` : num.toString();
    };

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        let { endAt } = this.props;
        let { timer = {} } = this.state;

        return <div className='common-timer'>

            {/* {timer.d > 0 && <li><span>{this.pad(timer.d)}</span><p>天</p></li>} */}
            {timer.h >= 0 && <li><span>{this.pad(timer.h)}</span><p>:</p></li>}
            {timer.m >= 0 && <li><span>{this.pad(timer.m)}</span><p>:</p></li>}
            {timer.s >= 0 && <li><span>{this.pad(timer.s)}</span></li>}
        </div>;
    }

}

class Sec2Timer extends React.Component {

    static propTypes = {
        seconds: PropTypes.number.isRequired
    };

    constructor() {
        super();
    }


    pad = (num = 0) => {
        return num < 10 ? `0${num}` : num.toString();
    };


    render() {
        let { seconds } = this.props;
        seconds = (seconds / 1000).toFixed(0);
        let d = 0, h = 0, m = 0, s = 0;
        d = parseInt(seconds / (3600 * 24));
        h = parseInt((seconds % (3600 * 24)) / 3600);
        m = parseInt((seconds % 3600) / 60);
        s = seconds % 60;
        return <span className='common-timer'>

            {d > 0 && <span>{this.pad(d)}天</span>}
            {h > 0 && <span>{this.pad(h)}时</span>}
            {m > 0 && <span>{this.pad(m)}分</span>}
            {s > 0 && <span>{this.pad(s)}秒</span>}
        </span>;
    }

}

class CouponModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            id: this.props.id,
            coupons: []
        }
    }

    componentDidMount() {
        this.loadCoupons()
    }

    loadCoupons = () => {
        let { id } = this.state;
        if (Utils.token()) {
            App.api(`/usr/coupon/coupons`, { productId: id }).then((result) => {
                this.setState({
                    coupons: result
                });
            });
        }
    };
    change = (id) => {
        let { coupons = [] } = this.state;
        coupons.map((coupon, index) => {
            if (coupon.id === id) {
                coupons[index].isHaveCoupon = 1;
            }
        })
        this.setState({ coupons })
    }

    render() {
        let { visible, coupons = [] } = this.state;
        return <div>
            <Modal
                popup
                closable={true}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
                animationType="slide-up"
            >
                <div className="coupon-modal-inner">
                    <div className="modal-inner">
                        <div className="coupon-title">限时特惠</div>
                        <CouponList list={coupons} withButton={true} change={this.change} />
                    </div>
                </div>

            </Modal>
        </div>
    }

}

class CouponList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            withButton: this.props.withButton,
        }
    }

    componentDidMount() {
    }

    save = (id) => {
        App.api(`/usr/coupon/save`, { id }).then(() => {
            Toast.success('领取成功', 1, null, false);
            this.props.change(id);

        })
    };


    render() {
        let { withButton = false } = this.state;
        return <div className="coupon-list">
            {this.props.list.map((item, index) => {
                let { rule = {}, status, payload = {}, duration, isHaveCoupon, id } = item;
                let { values = [] } = rule;
                let { type, category = {}, product = {} } = payload;
                return <li className="_coupon" key={index}>
                    <div className="coupon-left">
                        <div className="coupon-price">
                            <div className="sym">￥</div>
                            {rule.type === 1 || rule.type === 2 ?
                                <div className="num">{U.price.cent2yuan(values[1])}</div> :
                                <div className="num">{U.price.cent2yuan(values[0])}</div>}
                        </div>
                        <div className="coupon-p">{rule.type === 1 && "满减"}
                            {rule.type === 2 && "每减"}
                            {rule.type === 3 && "直减"}</div>
                    </div>
                    <div className="coupon-right">
                        <div className="coupon-detail">
                            <div className="_data">
                                {rule.type === 1 && `满${values[0] / 100}减${values[1] / 100}`}
                                {rule.type === 2 && `每${values[0] / 100}减${values[1] / 100}`}
                                {rule.type === 3 && `直减${values[0] / 100}`}
                            </div>
                            <div className="coupon-intro">
                                <div className="coupon-type">
                                    {type === 1 && "全场通用"}
                                    {type === 2 && `仅限${category.name}类产品`}
                                    {type === 3 && "商品优惠券"}
                                </div>
                                <div className="date">{duration}天</div>
                            </div>
                        </div>
                        {withButton && !isHaveCoupon ?
                            <div className="coupon-button-gold coupon-button-gray" onClick={() => {
                                this.save(id)
                            }}>立即领取</div> : <div className="coupon-button-gray">已领取</div>}
                    </div>
                </li>

            })}
        </div>
    }

}


const id_div_user_coupons = 'div-user_coupons';

class UserCouponsModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            now: Date.now(),
            visible: true,
            userCoupons: [],
            carts: this.props.carts,
            productCategories: []
        };
    }

    componentDidMount() {
        this.loadCoupons();
    }

    loadCoupons = () => {
        let { carts = [] } = this.state;
        let cartIds = [];
        carts.map((cart, index) => {
            let { product = {} } = cart;
            cartIds.push(product.id)
        });

        if (Utils.token()) {
            App.api(`/usr/coupon/trade_coupons`, {
                ids: JSON.stringify(cartIds),
            }).then((result) => {
                this.setState({
                    userCoupons: result
                });
            });
        }
    };

    calcCouponAmount = (userCouponId, item) => {
        if (userCouponId === -1) {
            userCouponId = this.state.userCouponId;
        }
        if (userCouponId > 0) {

            let { userCoupons = [], carts } = this.state;
            let userCoupon = userCoupons.find(a => a.id === userCouponId) || {};
            let { coupon = {} } = userCoupon;
            let availablePrice = 0;
            let { payload = {}, rule = {} } = coupon;
            let { type, category = {} } = payload;

            carts.map((item) => {
                let { product = {}, productSno, num } = item;
                let { id, specs = [] } = product;
                let { sequence } = product;
                if (id) {
                    if (type === 1 || (type === 2 && (sequence.substr(0, 2) === category.sequence.substr(0, 2))
                        || (type === 3 && (id === payload.product.id)))) {
                        let price = specs.find(item => item.sno === productSno).price;
                        availablePrice += price * num;
                    }
                }
            });

            let couponAmount = 0;
            if (availablePrice === 0 || (rule.type === 1 || rule.type === 2) && (availablePrice < (rule.values[0] / 100))) {
                Toast.offline("该优惠券在此订单不可使用");
            } else {
                let { values = [0, 0], type } = rule;
                if (type === 1) {
                    couponAmount = Math.min(values[1] / 100, availablePrice);
                } else if (type === 2) {
                    couponAmount = parseInt(availablePrice / values[0]) * values[1] / 100;
                } else {
                    couponAmount = Math.min(values[0] / 100, availablePrice);
                }
                this.setState({ userCouponId, couponAmount });
                this.changeCoupon(item, couponAmount);
            }
        } else {
            this.setState({ userCouponId, couponAmount: 0 });
        }
    };

    changeCoupon = (userCoupon, couponAmount) => {
        this.props.syncUserCoupon(userCoupon, couponAmount);
        this.setState({ visible: false })
    };


    close = () => {
        this.setState({ visible: false });
        Utils.common.closeModalContainer(id_div_user_coupons);
    };

    render() {
        let { visible, now = '', userCoupons = [] } = this.state;
        return <Modal
            className='coupon-modal'
            popup
            title='我的优惠券'
            closable={false}
            visible={visible}
            getContainer={() => Utils.common.createModalContainer(id_div_user_coupons)}
            onClose={() => this.close()}
            animationType="slide-up">
            {userCoupons.map((userCoupon, index) => {
                let { coupon = {}, getAt = '', validThru = '', id } = userCoupon;
                let { rule = {}, payload = {} } = coupon;
                let { type = '', values = [0, 0] } = rule;
                let { category = {}, } = payload;
                return <div className='coupon-detail' key={index}>
                    <div className='left'>
                        <span className='money'>{type === 3 ? `￥${values[0] / 100}` : `￥${values[1] / 100}`}</span>

                        <span className='type'>
                            {type === 1 && '满减'}
                            {type === 2 && '每减'}
                            {type === 3 && '直减'}
                        </span>
                    </div>
                    <div className='right'>
                        <div className='info'>
                            <span className='line-1'>
                                {rule.type === 1 && `满${values[0] / 100}减${values[1] / 100}`}
                                {rule.type === 2 && `每${values[0] / 100}减${values[1] / 100}`}
                                {rule.type === 3 && `直减${values[0] / 100}`}
                            </span>

                            <span className='line-2'>
                                {payload.type === 1 && '全场通用'}
                                {payload.type === 2 && `仅限${category.name}类产品`}
                                {payload.type === 3 && '仅限本产品使用'}
                            </span>
                            <span
                                className='line-3'>{U.date.format(new Date(getAt), 'yyyy-MM-dd')}-{U.date.format(new Date(validThru), 'yyyy-MM-dd')}</span>
                        </div>

                        <span key={index} className={'get-btn'} onClick={() => {
                            this.calcCouponAmount(id, userCoupon);
                        }}>立即使用</span>

                    </div>

                </div>

            })
            }

        </Modal>;
    }

}

export {
    CommonTimer,
    MyCommonTabs,
    AddressComps,
    ParamModal,
    MyStepper,
    MerchantList,
    ArticleList,
    SceneList,
    OverLay,
    RenderSex,
    NoMoreData,
    MoreButton,
    ProductBar,
    TitleBar,
    TopBar,
    Banners,
    NavBar,
    HorizonalScrollContainer,
    MyRate,
    MyTags,
    ProductList,
    FilterBar,
    Loading,
    PickBar,
    CommonTabs,
    MySearchBar,
    AdBlock,
    CouponModal,
    CouponList,
    UserCouponsModal,
    Sec2Timer,
    NonData

};
