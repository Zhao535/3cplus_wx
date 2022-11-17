import React from 'react';
import '../../assets/css/merchant.scss';
import {FilterBar, MyRate, MyTags, Loading, ProductList, TopBar} from "../Comps";
import {App, U, Utils} from "../../common";
import {Toast} from 'antd-mobile';
import ProductUtils from "../../allData/ProductUtils";
import {Icon} from "antd";
import BrandUtils from "../../allData/BrandUtils";


export default class Merchant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            merchant: {},
            products: [],
            loading: false,
            merchantBrands: [],
            productCategories: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            favored: false,
        };
    }

    componentDidMount() {
        let {id} = this.state;
        this.loadData();
        this.loadProducts();
        this.loadFavored();
        ProductUtils.loadProductCategories(this);
        BrandUtils.merchantBrandList(this, id);
        U.setWXTitle('门店')
    }

    loadData = () => {
        let {id} = this.state;
        App.api(`usr/merchant/item`, {id: id}).then((merchant) => {
            this.setState({merchant}, () => {
                U.setWXTitle(merchant.name);
            })
        });

    }

    loadFavored = () => {
        let {id} = this.state;
        if (Utils.token()) {
            App.api(`/usr/collect/isCollect`, {type: 4, fromId: id}).then((res) => {
                this.setState({favored: res});
            })
        }
    }

    syncFilterBar = (sorter = {}, filter = {}, layout, withoutLoading) => {
        this.setState({
            sorter, filter, layout
        }, () => {
            !withoutLoading && this.loadProducts()
        });
    }

    loadProducts = () => {
        let {sorter = {}, filter = {}, layout, id, pagination = {}} = this.state;
        let {field = 'id', ascDesc = 'desc'} = sorter;
        let {prices = ['', ''], brandIds = []} = filter;
        let _prices = JSON.parse(JSON.stringify(prices));

        if (_prices[0] === '') {
            _prices[0] = 0;
        }
        if (_prices[1] === '') {
            _prices[1] = 999999999999999;
        }
        App.api(`usr/merchant/products`, {
            qo: JSON.stringify({
                merchantId: id,
                brandId: brandIds,
                sortPropertyName: field,
                sortAscending: ascDesc === "asc",
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                price: {
                    before: parseInt(U.price.yuan2cent(_prices[1])),
                    after: parseInt(U.price.yuan2cent(_prices[0]))
                },
            })
        }).then((result) => {
            this.setState({products: result.content})
        })
    }
    toCollect = () => {
        let {id} = this.state;
        if (Utils.token()) {
            let collect = {type: 4, fromId: id};
            App.api(`usr/collect/save`, {collect: JSON.stringify(collect)}).then(() => {
                this.loadFavored();
            });
        } else {
            App.go(`/login`)
        }


    }


    render() {
        let {loading, merchant = {}, products = [], productCategories = [], sorter = {}, filter = {}, layout, merchantBrands = [], collect = {}, favored = false} = this.state;
        let {logo, imgs = [], name, sequences = [], location = {}} = merchant;
        let {poiaddress, poiname} = location;
        if (!logo) {
            return <Loading/>
        }
        return <div className='merchant-page'>
            <div className='merchant-top'>
                <div className='merchant-logo'>
                    <img src={logo}/>
                    {favored ?
                        <img className='collect-icon' src={require('../../assets/3cimages/icon/collected-merchant.png')}
                             onClick={() => {
                                 this.toCollect()
                             }
                             }/>
                        : <img className='collect-icon' src={require('../../assets/3cimages/icon/mercahnt-collect.png')}
                               onClick={() => {
                                   this.toCollect()
                               }}/>}
                </div>
                <div className='merchant-detail'>
                    <MyRate score={5}/>
                    <div className='merchant-quantity'>2311购买</div>
                    <div className='merchant-collect'>2311收藏</div>
                </div>
                <ul className='merchant-categories'>
                    {sequences.map((sequence, index) => {
                        return <li className='merchant-category' key={index}>
                            {ProductUtils.getCategoryName(productCategories, sequence, false)}
                        </li>
                    })}
                </ul>
                <div className='merchant-location'>
                    <Icon type={'environment'}/>{poiaddress}{poiname}
                </div>
            </div>
            <FilterBar sorter={sorter} filter={filter} layout={layout} syncFilterBar={this.syncFilterBar}
                       loadData={this.loadData} brands={merchantBrands}/>
            <ProductList list={products}/>
            <div className='clearfix'/>
            <div className='bottom-line'>我是有底线的~~</div>
        </div>;
    }
}
